///<reference path='node_modules/typescript/lib/typescript.d.ts' />
///<reference path='node.d.ts' />

import ts = require('typescript');
import fs = require('fs');
import path = require('path');

function printChildTypes(root: ts.Node) {
    ts.forEachChild(root, n => console.log(n.kind + ' ' + ts.SyntaxKind[n.kind]));
}

interface IsKind { (kind: ts.SyntaxKind): boolean }

function getAll<T extends ts.Node>(isKind: IsKind, roots: ts.Node[]) {
    const result: T[] = [];
    roots.forEach(root => {
        ts.forEachChild(root, node => {
            if (isKind(node.kind))
                result.push(<T>node);
        })
    });
    return result;
}

function getAllRecurse<T extends ts.Node>(isKind: IsKind, roots: ts.Node[]) {
    const result: T[] = [];
    roots.forEach(root => aggregate(root));
    return result;

    function aggregate(node: ts.Node): void {
        if (isKind(node.kind)) {
            result.push(<T>node);
        }
        ts.forEachChild(node, aggregate);
    }
}


function isKindModuleDeclaration(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.ModuleDeclaration;
}

function isKindModuleBlock(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.ModuleBlock;
}

function isKindInterfaceDeclaration(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.InterfaceDeclaration;
}

function isKindEnumDeclaration(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.EnumDeclaration;
}

function isKindEnumMember(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.EnumMember;
}

function isKindFunctionDeclaration(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.FunctionDeclaration;
}

function isKindIdentifier(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.Identifier;
}

function isKindLiteralToken(kind: ts.SyntaxKind) {
    return ts.SyntaxKind.FirstLiteralToken <= kind && kind <= ts.SyntaxKind.LastLiteralToken
}


function getModulesDeclarations(roots: ts.Node[]) {
    return getAll<ts.ModuleDeclaration>(isKindModuleDeclaration, roots);
}

function getModuleBlocks(roots: ts.Node[]) {
    return getAll<ts.ModuleBlock>(isKindModuleBlock, roots);
}

function getInterfaceDeclarations(roots: ts.Node[]) {
    return getAll<ts.InterfaceDeclaration>(isKindInterfaceDeclaration, roots);
}
    
function getInterfaceDeclarationsRecurse(roots: ts.Node[]) {
    return getAllRecurse<ts.InterfaceDeclaration>(isKindInterfaceDeclaration, roots);
}

function getEnumDeclarations(roots: ts.Node[]) {
    return getAll<ts.EnumDeclaration>(isKindEnumDeclaration, roots);
}

function getEnumMembers(roots: ts.Node[]) {
    return getAll<ts.EnumMember>(isKindEnumMember, roots);
}

function getFunctionDeclarations(roots: ts.Node[]) {
    return getAll<ts.FunctionDeclaration>(isKindFunctionDeclaration, roots);
}

function getLiteralTokens(roots: ts.Node[]) {
    return getAll<ts.LiteralExpression>(isKindLiteralToken, roots);
}


// type guards

function isIdentifier(node: ts.Node): node is ts.Identifier {
    return isKindIdentifier(node.kind);
}

function isLiteralToken(node: ts.Node): node is ts.LiteralExpression {
    return isKindLiteralToken(node.kind);
}


export function main() {
    const filename = process.cwd() + '/node_modules/typescript/lib/typescriptServices.d.ts'
    const source = String(fs.readFileSync(filename));

    const sf = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest);

    console.log('\n# Modules');
    const mds = getModulesDeclarations([sf]);
    //mds.map(m => m.name.text).sort().forEach(nm => console.log(nm));
    const mbs = getModuleBlocks(mds);

    const subMds = getModulesDeclarations(mbs);
    subMds.map(md => md.name.text).sort().forEach(nm => console.log(nm));

    console.log('\n# Functions');
    const fds = getFunctionDeclarations(mbs);
    fds.map(fd => console.log(fd.name.text));

    console.log('\n# Enums');
    const eds = getEnumDeclarations(mbs);
    eds.map(ed => {
        console.log(ed.name.text)
        const ems = getEnumMembers([ed]);
        ems.forEach(em => {
            const name = em.name;
            if (isIdentifier(name))
                console.error('  ' + name.text);
            const ts = getLiteralTokens([em]);
            ts.forEach(t => {
                console.log('    = ' + t.text);
            });
        });
    });

    console.log('\n# Interfaces');
    let ids = getInterfaceDeclarations(mbs);
    ids.map(id => console.log(id.name.text));


    //printChildTypes(sf);
    console.log('done');
}

main();