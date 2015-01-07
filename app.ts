///<reference path='../TypeScript/built/local/typescript.d.ts' />
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
        console.log('node: ' + (ts.tokenToString(node.kind)));
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            result.push(<ts.InterfaceDeclaration>node);
        }
        ts.forEachChild(node, aggregate);
    }
}

export function main() {
    var filename = process.cwd() + '/../TypeScript/built/local/typescript.d.ts'
    var source = String(fs.readFileSync(filename));
    //console.log("source: " + source);

    var scanner = ts.createScanner(ScriptTarget.Latest, true, source);
    var root = ts.createNode(scanner.scan());

    getAllInterfaces(root).forEach(ifd => {
        console.log('interface: ' + ifd.name);
    });

    console.log('done');
}

main();