
// Using the Type Checker
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker

import * as ts from "typescript";
import * as fs from "fs";

let tsPath = "node_modules/typescript/lib/typescript.d.ts"
const options: ts.CompilerOptions = { target: ts.ScriptTarget.ES2015 }
const host = ts.createCompilerHost(options, true);
const program = ts.createProgram([tsPath], options, host)
const checker = program.getTypeChecker()
const sourceFile = program.getSourceFile(tsPath)

function visitNode(node: ts.Node){
    switch (node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
            const fd = (<ts.FunctionDeclaration>node);
            if(fd.name.getText() === "visitFunctionBody"){
                printFunctionComments(fd)
            }
    }
    ts.forEachChild(node, visitNode)
}

ts.forEachChild(sourceFile, visitNode);

function printFunctionComments(fd: ts.FunctionDeclaration){
    const symbol = checker.getSymbolAtLocation(fd.name)
    const comments = ts.displayPartsToString(symbol.getDocumentationComment())
    console.log ("\n" + fd.name.getText() + "comments\n"+ comments)
}
