[<AutoOpen>]
module Taser.EdgeJs

open System
open System.Threading.Tasks
open EdgeJs

type JsCallback = Func<obj,Task<obj>>

type Edge with
    static member Func f =
        JsCallback(fun o -> f(unbox o) |> Async.Box |> Async.StartAsTask)

    static member Async js =
        fun arg ->
            /// raise the InnerException instead of AggregateException if there is just one
            try
                let func = Edge.Func js
                func.Invoke arg |> Async.AwaitTask
            with e ->
                match e with
                | :? AggregateException as ae ->
                    if ae.InnerExceptions.Count = 1 then raise ae.InnerException
                    else raise ae
                | _ -> raise e
