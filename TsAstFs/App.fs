module App

// an F# wrapper for the TypeScript module
module tsast =
    open EdgeJs

    let format (ts:string): Async<string> =
        let f = 
            Edge.Async
                """
                var tsast = require('tsast');
                return function(ts, cb) {
                    cb(null, tsast.format(ts));
                }
                """
        f ts |> Async.Unbox

[<EntryPoint>]
let main argv =
    async {
        let unformatted = "class   Triangle { edges() { return 3; }}"
        let! formatted = tsast.format unformatted
        printfn "unformatted: %s" unformatted
        printfn "formatted: %s" formatted  
    }
    |> Async.RunSynchronously
    0
