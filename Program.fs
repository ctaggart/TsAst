open Taser.Chakra

let printfn format = Printf.ksprintf System.Diagnostics.Debug.WriteLine format

type ScriptTarget =
    | ES3 = 0
    | ES5 = 1
    | ES6 = 2
    | ES2015 = 2
    | Latest = 2

type SourceFile(v: JavaScriptValue) = // TODO
    member x.kind = (v.GetPropertyByName "kind").AsInt

type TypeScriptServices(cc: ChakraContext) =

    let fcreateSourceFile  = cc.RunScript "ts.createSourceFile"

    member x.createSourceFile (fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes: bool option): SourceFile =
        let args = 
            [|  JavaScriptValue.FromString fileName
                JavaScriptValue.FromString sourceText
                JavaScriptValue.FromInt32 (int languageVersion)
                JavaScriptValue.FromBooleanOption setParentNodes
            |]
        let v = cc.CallFunction (fcreateSourceFile, args)
        SourceFile v

let printValueType (v:JavaScriptValue) =
    printfn "ValueType: %A" v.ValueType

let passJsRefToFunction (cc: ChakraContext) =

    // Hello World
    let hw = cc.RunScript "'Hello' + ' World'"
    printfn "hw: %s" hw.AsString

    // create a function
    let createPerson = cc.RunScript "(function(){ return { name: 'Cameron', age: 36 } });"
    printValueType createPerson // Function

    // call that function
    let person = cc.CallFunction(createPerson, Array.empty)
    printValueType person // Object

    // get a property of the returned object
    printfn "name: %s" ((person.GetPropertyByName "name").AsString)

    // get the number of properties of the object
    let names = person.GetOwnPropertyNames()
    printValueType names // Array
    let plength = names.GetPropertyByName "length"
    printValueType plength // Number
    let ec, d = Native.JsNumberToDouble plength
    printfn "length: %d" plength.AsInt

    // TypeScript Services

    // get a function reference
    let createNode = cc.RunScript "ts.createNode"
    printValueType createNode // Function
    printfn "createNode: "

    // calling the function
    let node = cc.CallFunction(createNode, [| JavaScriptValue.FromInt32 1 |])
    printValueType node
    printfn "node: "

    // access a property on the returned object
    printfn "  kind: %d" ((node.GetPropertyByName "kind").AsInt)

    // pass in the object to a custom function
    let getKind = cc.RunScript "(function(x){ return x.kind; })"
    let kind = cc.CallFunction(getKind, [| node |])
    printValueType kind // Number
    printfn "kind: %d" kind.AsInt

[<EntryPoint>]
let main argv =
    let cc = ChakraContext()
    let fn = @"C:\ts\TsAst\node_modules\typescript\lib\typescriptServices.js"
    let js = readFileToEnd fn
    cc.RunScript js |> ignore
    let ts = TypeScriptServices cc
    let sf = ts.createSourceFile(fn, js, ScriptTarget.Latest, None)
    printfn "sf kind: %d" sf.kind 

//    passJsRefToFunction cc
    0