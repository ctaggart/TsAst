open System
open System.IO
open System.Runtime.InteropServices
open Taser
open Taser.Chakra

let printfn format = Printf.ksprintf System.Diagnostics.Debug.WriteLine format

type ScriptTarget =
    | ES3 = 0
    | ES5 = 1
    | ES6 = 2
    | ES2015 = 2
    | Latest = 2

type SourceFile() =
    member x.kind =
        ()
//        let fn = 
//            Edge.Async
//                """
//                var ts = require('typescript');
//                return function(p, cb) {
//                    //cb(null, 'get kind: ' + p); // returns 'get kind: function (d, cb) { return f(d, cb, ctx); }'
//                    //cb(null, p(null, true));
//                    p(d, cb);
//
//                    // none of these seam to work // each returns 'get kind: undefined'
//                    //cb(null, 'get kind: ' + p(function (x){ return x.kind; }) );
//                    //cb(null, 'get kind: ' + p(function (x, xcb){ xcb( 'x: ' + x); }) );
//                }
//                """
//        (fn obj) |> Async.Unbox
//        async {
//            let! o = fn args |> Async.Unbox
//            return SourceFile o
//        }


//function createSourceFile(fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes?: boolean): SourceFile;
type createSourceFileArgs = {
    fileName: string
    sourceText: string
    languageVersion: ScriptTarget
    setParentNodes: bool option
}

//let createSourceFile (args: createSourceFileArgs) : Async<SourceFile> =
//    let fn = 
//        """
//        var ts = require('typescript');
//        return function(p, cb) {
//            var o = ts.createSourceFile(p.fileName, p.sourceText, p.languageVersion, p.setParentNodes);
//            //var o = 'args: ' + p.fileName + p.languageVersion + p.setParentNodes
//            //cb(null, o);
//            var sfcb = function (err, ca) {
//                ca(o);
//            };
//            cb(null, sfcb);
//        }
//        """
//    fn args |> Async.Unbox
//    async {
//        let! o = fn args |> Async.Unbox
//        return SourceFile o
//    }

let getValueType v =
    
    let ec, vt = Native.JsGetValueType v
    Native.ThrowIfError ec
    vt

let printValueType v =
    printfn "ValueType: %A" (getValueType v)

// https://github.com/ctaggart/MsieJavaScriptEngine/commit/d345da3325da0c0eef563d5895e030fe7d4b3e1e
let passJsRefToFunction() =
//    let ch = ChakraHost()
//    let msg = ch.init()
//    printfn "Chakra init: %s" msg // TODO throw if not "NoError"
//    let rv = ch.runScript "'Hello' + ' World'"
//    printfn "rv: %s" rv

    let ec, rt = Native.JsCreateRuntime(JavaScriptRuntimeAttributes.None, null)
    Native.ThrowIfError ec

    let ec, ctx = Native.JsCreateContext rt
    Native.ThrowIfError ec

    let ec = Native.JsSetCurrentContext ctx
    Native.ThrowIfError ec

    let ec = Native.JsStartDebugging()
    Native.ThrowIfError ec

    // Hello World

    let sc = JavaScriptSourceContext.FromIntPtr IntPtr.Zero
//    let sc = JavaScriptSourceContext.FromIntPtr (IntPtr 1)
    let ec, v = Native.JsRunScript("'Hello' + ' World'", sc, String.Empty)
    Native.ThrowIfError ec
    printValueType v // String

    let ec, sr = Native.JsConvertValueToString v
    Native.ThrowIfError ec
    let ec, sp, n = Native.JsStringToPointer sr
    Native.ThrowIfError ec
    let s = Marshal.PtrToStringUni sp
    printfn "string: %s, length: %d" s n

    // TypeScript Services createNode

    use sr = new StreamReader(@"C:\ts\TsAst\node_modules\typescript\lib\typescriptServices.js")
    let js = sr.ReadToEnd()
    let ec, v = Native.JsRunScript(js, sc, String.Empty)
    Native.ThrowIfError ec
    printValueType v

//    let ec, v = Native.JsCallFunction(JavaScriptValue.FromString "ts.createNode", [| JavaScriptValue.FromInt32 1 |], uint16 1)
//    Native.ThrowIfError ec // InvalidArgument
//    printValueType v

    let ec, v = Native.JsRunScript("ts.createNode", sc, String.Empty)
    Native.ThrowIfError ec
    printValueType v // Function

    let ec, v = Native.JsCallFunction(v, [| JavaScriptValue.FromInt32 1 |], uint16 1)
    Native.ThrowIfError ec
    printValueType v // Object

//    let ec, v = Native.JsGetProperty(v, JavaScriptPropertyId.FromString "kind")
//    Native.ThrowIfError ec
//    printValueType v // Undefined

    let ec, names = Native.JsGetOwnPropertyNames v
    Native.ThrowIfError ec
    printValueType names // Array
    // TODO
//    printfn "names: %A" names



//    match vt with
//    | JavaScriptValueType.
    ()

[<EntryPoint>]
let main argv =
//    let fn = @"../../node_modules/typescript/lib/typescriptServices4.d.ts" |> Path.GetFullPath
//    printfn "loading %s" fn
//    let s = File.ReadAllText fn
//    let sf = createSourceFile { fileName = fn; sourceText = s; languageVersion = ScriptTarget.ES6; setParentNodes = None } |> Async.RunSynchronously
////    printfn "sf %A" sf
//    printfn "sf kind: %A" (sf.kind |> Async.RunSynchronously)
    passJsRefToFunction()
    0