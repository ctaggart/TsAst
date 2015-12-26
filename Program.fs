open EdgeJs
open Taser
open System.IO

let printfn format = Printf.ksprintf System.Diagnostics.Debug.WriteLine format

type ScriptTarget =
    | ES3 = 0
    | ES5 = 1
    | ES6 = 2
    | ES2015 = 2
    | Latest = 2

type SourceFile(obj:JsCallback) =
    member x.kind =
        let fn = 
            Edge.Async
                """
                var ts = require('typescript');
                return function(p, cb) {
                    cb(null, 'get kind: ' + p);
                    //cb(null, 'get kind: ' + p(function (x){ return 'x: ' + x + 'y: ' + y; }) );
                    //cb(null, 'get kind: ' + p(function (x){ return x.kind; }) );
                    //cb(null, 'get kind: ' + p(function (x, xcb){ xcb( 'x: ' + x); }) );
                    //cb(null, 'get kind: ' + p(function (x, xcb){ xcb( 'x: ' + x); }) );
                    //var a = p(function (x, xcb){ return xcb( 'x: ' + xcb); });
                    //cb(null, 'get kind: ' + a);
                }
                """
        (fn obj) |> Async.Unbox
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

let createSourceFile (args: createSourceFileArgs) : Async<SourceFile> =
    let fn = 
        Edge.Async
            """
            var ts = require('typescript');
            return function(p, cb) {
                var o = ts.createSourceFile(p.fileName, p.sourceText, p.languageVersion, p.setParentNodes);
                //var o = 'args: ' + p.fileName + p.languageVersion + p.setParentNodes
                //cb(null, o);
                var sfcb = function (err, ca) {
                    ca(sf);
                };
                cb(null, sfcb);
            }
            """
//    fn args |> Async.Unbox
    async {
        let! o = fn args |> Async.Unbox
        return SourceFile o
    }

[<EntryPoint>]
let main argv =
    let fn = @"../../node_modules/typescript/lib/typescriptServices4.d.ts" |> Path.GetFullPath
    printfn "loading %s" fn
    let s = File.ReadAllText fn
    let sf = createSourceFile { fileName = fn; sourceText = s; languageVersion = ScriptTarget.ES6; setParentNodes = None } |> Async.RunSynchronously
//    printfn "sf %A" sf
    printfn "sf kind: %A" (sf.kind |> Async.RunSynchronously)
    0