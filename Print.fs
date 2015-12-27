[<AutoOpen>]
module Taser.Print

let printfn format = Printf.ksprintf System.Diagnostics.Debug.WriteLine format