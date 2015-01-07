///<reference path='../TypeScript/built/local/typescript.d.ts' />

import ts = require('typescript');

export function main() {
    var m = <ts.ModuleDeclaration>ts.createNode(ts.SyntaxKind.ModuleDeclaration);
    var nm = <ts.Identifier>ts.createNode(ts.SyntaxKind.Identifier);
    nm.text = "Blah"
    m.name = nm;
    
    var sf = <ts.SourceFile>ts.createNode(ts.SyntaxKind.SourceFile);
    sf.statements = <ts.NodeArray<ts.ModuleElement>>[m];

    console.log("file: "+sf.text); // sf.text is undefined :(
}

main();