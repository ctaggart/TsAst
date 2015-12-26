open EdgeJs
open Taser

let appendNetVersion (s:string) =
    async { return sprintf "%s embedded in a .NET %s app" s (System.Environment.Version.ToString()) }

type Funcs() =
    member x.appendNetVersion = Edge.Func appendNetVersion

let getVersions =
    Edge.Async
        """
        return function(funcs, cb) {
            funcs.appendNetVersion('Node.js ' + process.version, cb);
        }
        """

[<EntryPoint>]
let main argv =
    let s = getVersions(Funcs()) |> Async.Unbox |> Async.RunSynchronously
    printfn "This has %s written in F#." s
    0