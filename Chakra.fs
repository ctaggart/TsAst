module Taser.Chakra

open MsieJavaScriptEngine

let main() =
    use jse = 
        new MsieJsEngine(
            JsEngineSettings(
                EngineMode = JsEngineMode.ChakraEdgeJsRt,
                UseEcmaScript5Polyfill = false,
                UseJson2Library = false))

    jse.Execute
        """
        function add(num1, num2) {
			return (num1 + num2);
		}
        """

    let a = jse.Evaluate "add(7, 9);" 
    printfn "a: %A" a // a: 16.0

    let b = jse.Evaluate<int> "add(7, 9);"
    printfn "b: %A" b // b: 16

    let i = jse.CallFunction<int>("add", 7, 9)
    printfn "i: %A" i // i: 16

    jse.ExecuteFile @"C:\ts\TsAst\node_modules\typescript\lib\typescriptServices.js"
    let node = jse.Evaluate @"ts.createNode(1);"
    printfn "node: %A" node // node: System.__ComObject

    jse.Execute "function getKind(node){ return node.kind; }"
    let kind = jse.CallFunction("getKind", node);
    // Exception: One of the function parameters 'getKind' has a type `System.__ComObject`, which is not supported.
    printfn "kind: %A" kind