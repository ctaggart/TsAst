
// Using the Type Checker
// How to I get the declared type from a TypeReferenceType in TypeScript Compiler API?
// https://stackoverflow.com/questions/47340859/how-to-i-get-the-declared-type-from-a-typereferencetype-in-typescript-compiler-a


import * as ts from "typescript";
import * as fs from "fs";
import {isTypeReference, isClassDeclaration} from "tsutils";

const tsPath = "node_modules/@types/mocha/index.d.ts"
const options: ts.CompilerOptions = { target: ts.ScriptTarget.ES2015 }
const host = ts.createCompilerHost(options, true);
const program = ts.createProgram([tsPath], options, host)
const checker = program.getTypeChecker()
const sourceFile = program.getSourceFile(tsPath)
// console.log(sourceFile)

function visitNode(node: ts.Node){
    switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
            const cd = (<ts.ClassDeclaration>node);
            // console.log(cd.name.getText())
            if(cd.name.getText() === "Doc"){
                printBaseClass(cd)
            }
    }
    ts.forEachChild(node, visitNode)
}

ts.forEachChild(sourceFile, visitNode);

function getFullTypeName (tp: ts.Type){
    if(tp.symbol){
        return checker.getFullyQualifiedName(tp.symbol)
    } else {
        return ""
    }
}

function getFullNodeName (nd: ts.Node){
    const tp =checker.getTypeAtLocation(nd)
    return getFullTypeName(tp)
}

function printBaseClass(cd: ts.ClassDeclaration){
    // console.log(cd)
    for(const hc of cd.heritageClauses) {
        console.log("heritage clause: " + hc.getText())

        console.log("hc name " + getFullNodeName(hc))

        for(const hctp of hc.types){
            let tp = checker.getTypeFromTypeNode(hctp)
            console.log(getFullTypeName(tp))

            if (isTypeReference(tp)) {
                const targetNode = checker.typeToTypeNode(tp.target)
                if(isClassDeclaration(targetNode)){
                    console.log("found it")
                } else {
                    console.log("targetNode is not a class " + targetNode.kind) // 159 TypeReference
                }
            }
        }
    }
}
