[<AutoOpen>]
module EdgeJs.FSharp
 
open System
open System.Threading.Tasks
 
type Async with
    static member Box (r:Async<'TResult>) =
        async {
            let! o = r
            return box o
        }
 
    static member Unbox<'TResult> (r:Async<obj>) : Async<'TResult> =
        async {
            let! o = r
            return unbox o
        }
 
type Edge with
    static member Func f =
        Func<obj,Task<obj>>(fun o -> f(unbox o) |> Async.Box |> Async.StartAsTask)
 
    static member Async js =
        fun arg ->
            let func = Edge.Func js
            func.Invoke arg |> Async.AwaitTask