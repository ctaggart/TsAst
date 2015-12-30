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

let getString v =
    let ec, sr = Native.JsConvertValueToString v
    Native.ThrowIfError ec
    let ec, sp, _ = Native.JsStringToPointer sr
    Native.ThrowIfError ec
    Marshal.PtrToStringUni sp

let passJsRefToFunction() =

    // setup
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
    let ec, v = Native.JsRunScript("'Hello' + ' World'", sc, String.Empty)
    Native.ThrowIfError ec
    printValueType v // String
    printfn "string: %s" (getString v)

    // create a function
    let ec, createPerson = Native.JsRunScript("(function(){ return { name: 'Cameron', age: 36 } });", sc, String.Empty )
    Native.ThrowIfError ec
    printValueType v // Function

    // call that function
    let ec, person = Native.JsCallFunction(createPerson, [|createPerson|], uint16 1)
    Native.ThrowIfError ec
    printValueType person // Object

    // get a property of the returned object
    let pidname = JavaScriptPropertyId.FromString "name"
    let ec, name = Native.JsGetProperty(person, pidname)
    Native.ThrowIfError ec
    printValueType name // String
    printfn "name: %s" (getString name)

    // get the number of properties of the object
    let ec, names = Native.JsGetOwnPropertyNames person
    Native.ThrowIfError ec
    printValueType names // Array
    let pidlength = JavaScriptPropertyId.FromString "length"
    let ec, plength = Native.JsGetProperty(names, pidlength)
    Native.ThrowIfError ec
    printValueType plength // Number
    let ec, d = Native.JsNumberToDouble plength
    printfn "length: %d" (int d)

    // TypeScript Services

    // load the js
    use sr = new StreamReader(@"C:\ts\TsAst\node_modules\typescript\lib\typescriptServices.js")
    let js = sr.ReadToEnd()
    let ec, v = Native.JsRunScript(js, sc, String.Empty)
    Native.ThrowIfError ec
    printValueType v

    // get a function reference
    let ec, createNode = Native.JsRunScript("ts.createNode", sc, String.Empty)
    Native.ThrowIfError ec
    printValueType createNode // Function
    printfn "createNode: "

    // calling the function
    let ec, node = Native.JsCallFunction(createNode, [| createNode; JavaScriptValue.FromInt32 1 |], uint16 2)
    Native.ThrowIfError ec
    printValueType node
    printfn "node: "

    // access a property on the returned object
    let pidkind = JavaScriptPropertyId.FromString "kind"
    let ec, pkind = Native.JsGetProperty(node, pidkind)
    Native.ThrowIfError ec
    printValueType pkind
    printfn "  kind: %s" (getString pkind) // works even with it beign a number :)

    // pass in the object to a custom function
    let ec, getKind = Native.JsRunScript("(function(x){ return x.kind; })", sc, String.Empty)
    Native.ThrowIfError ec
    printValueType getKind // Function
    let ec, kind = Native.JsCallFunction(getKind, [| getKind; node |], uint16 2)
    Native.ThrowIfError ec
    printValueType kind // Number
    printfn "kind: %s" (getString kind)

    ()

[<EntryPoint>]
let main argv =

    // the TypeScript to translate

    //    let fn = @"../../node_modules/typescript/lib/typescriptServices4.d.ts" |> Path.GetFullPath
    //    printfn "loading %s" fn
    //    let s = File.ReadAllText fn
    //    let sf = createSourceFile { fileName = fn; sourceText = s; languageVersion = ScriptTarget.ES6; setParentNodes = None } |> Async.RunSynchronously
    ////    printfn "sf %A" sf
    //    printfn "sf kind: %A" (sf.kind |> Async.RunSynchronously)

    passJsRefToFunction()
    0