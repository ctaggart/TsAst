///<reference path='../TypeScript/bin/typescript.d.ts' />
///<reference path='node.d.ts' />

import ts = require('typescript');
import fs = require('fs');
import path = require('path');

// derived from getAllBinaryExpressions https://github.com/Microsoft/TypeScript/issues/254
function getAllInterfaces(root: ts.Node) {
    var result: ts.InterfaceDeclaration[] = [];
    aggregate(root);
    return result;

    function aggregate(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            result.push(<ts.InterfaceDeclaration>node);
        }
        ts.forEachChild(node, aggregate);
    }
}

export function main() {
    var filename = process.cwd() + '/../TypeScript/bin/typescript.d.ts'
    var source = String(fs.readFileSync(filename));

    var sf = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, "0");

    getAllInterfaces(sf)
        .map(ifd => ifd.name.text)
        .sort()
        .forEach(nm => console.log(nm));
}

main();