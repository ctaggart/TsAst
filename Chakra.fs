[<AutoOpen>]
module Taser.Chakra.ChakraExt

open System
open System.IO
open System.Runtime.InteropServices
open Taser
open Taser.Chakra

let readStreamToEnd stream =
    use sr = new StreamReader(stream: Stream)
    sr.ReadToEnd()

let readFileToEnd file =
    readStreamToEnd(File.OpenRead file)

type ChakraContext() =
    let sc = JavaScriptSourceContext.FromIntPtr IntPtr.Zero

    let rt =
        let ec, rt = Native.JsCreateRuntime(JavaScriptRuntimeAttributes.None, null)
        Native.ThrowIfError ec
        rt

    let ctx =
        let ec, ctx = Native.JsCreateContext rt
        Native.ThrowIfError ec
        let ec = Native.JsSetCurrentContext ctx
        Native.ThrowIfError ec
        ctx

    member x.RunScript script = 
        let ec, v = Native.JsRunScript(script, sc, String.Empty)
        Native.ThrowIfError ec
        v

    member x.RunScriptFromStream stream =
        x.RunScript (readStreamToEnd stream)

    member x.RunScriptFromFile file =
        x.RunScript (readFileToEnd file)

    member x.CallFunction (fn, args) =
        // the function is also the first argument
        let args = Array.append [|fn|] args
        let ec, v = Native.JsCallFunction(fn, args, uint16 args.Length)
        Native.ThrowIfError ec
        v

type JavaScriptValue with
    member x.GetPropertyByName name =
        let id = JavaScriptPropertyId.FromString name
        x.GetProperty id

    member x.AsString = x.ToString()
    member x.AsFloat = x.ToDouble()
    member x.AsInt = int x.AsFloat

    static member FromBooleanOption (v: bool option) =
        match v with
        | None -> JavaScriptValue.Undefined
        | Some b -> JavaScriptValue.FromBoolean b