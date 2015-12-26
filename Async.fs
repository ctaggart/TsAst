[<AutoOpen>]
module Taser.Async

open System

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

[<RequireQualifiedAccess>]
module Async =
    /// raise the InnerException instead of AggregateException if there is just one
    let AwaitTaskOne task = async {
        try
            return! Async.AwaitTask task
        with e ->
            return
                match e with
                | :? AggregateException as ae ->
                    if ae.InnerExceptions.Count = 1 then raise ae.InnerException
                    else raise ae
                | _ -> raise e }