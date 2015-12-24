﻿///<reference path='node_modules/typescript/lib/typescript.d.ts' />
///<reference path='node.d.ts' />

import ts = require('typescript');
import fs = require('fs');
import path = require('path');

function printChildTypes(root: ts.Node) {
    ts.forEachChild(root, n => console.log(n.kind + ' ' + (<any>ts).SyntaxKind[n.kind]));
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

function isKindHeritageClause(kind: ts.SyntaxKind) {
  return kind === ts.SyntaxKind.HeritageClause;
}

function isKindPropertySignature(kind: ts.SyntaxKind) {
  return kind === ts.SyntaxKind.PropertySignature;
}

function isKindTypeReference(kind: ts.SyntaxKind) {
  return kind === ts.SyntaxKind.TypeReference;
}

function isKindExpressionWithTypeArguments(kind: ts.SyntaxKind) {
  return kind === ts.SyntaxKind.ExpressionWithTypeArguments;
}

function isKindQuestionToken(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.QuestionToken;
}

function isKindTypeParameter(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.TypeParameter;
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

function getHeritageClauses(roots: ts.Node[]) {
  return getAll<ts.HeritageClause>(isKindHeritageClause, roots);
}

function getExpressionWithTypeArguments(roots: ts.Node[]) {
  return getAll<ts.ExpressionWithTypeArguments>(isKindExpressionWithTypeArguments, roots);
}

function getTypeReferences(roots: ts.Node[]) {
    return getAll<ts.TypeReferenceNode>(isKindTypeReference, roots);
}

function getIdentifiers(roots: ts.Node[]) {
    return getAll<ts.Identifier>(isKindIdentifier, roots);
}

function getTypeParameters(roots: ts.Node[]) {
    return getAll<ts.TypeParameterDeclaration>(isKindTypeParameter, roots);
}


// type guards

function isIdentifier(node: ts.Node): node is ts.Identifier {
    return isKindIdentifier(node.kind);
}

function isLiteralToken(node: ts.Node): node is ts.LiteralExpression {
    return isKindLiteralToken(node.kind);
}

function isHeritageClause(node: ts.Node): node is ts.HeritageClause {
  return isKindHeritageClause(node.kind);
}

function isPropertySignature(node: ts.Node): node is ts.VariableLikeDeclaration {
  return isKindPropertySignature(node.kind);
}

function isTypeReference(node: ts.Node): node is ts.TypeReferenceNode {
  return isKindTypeReference(node.kind);
}

function isExpressionWithTypeArguments(node: ts.Node): node is ts.ExpressionWithTypeArguments {
  return isKindExpressionWithTypeArguments(node.kind);
}



export function main() {
    const filename = process.cwd() + '/node_modules/typescript/lib/typescriptServices2.d.ts'
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
                console.log('  ' + name.text);
            const ts = getLiteralTokens([em]);
            ts.forEach(t => {
                console.log('    = ' + t.text);
            });
        });
    });

    console.log('\n# Interfaces');
    let ids = getInterfaceDeclarations(mbs);
    ids.map(id => {
        console.log(id.name.text);
        const tps = getTypeParameters([id]);
        tps.forEach(tp => {
            console.log('  of ' + tp.name.text);
        });

        const hcs = getHeritageClauses([id]);
        const ewtas = getExpressionWithTypeArguments(hcs);
        ewtas.forEach(ewta => {
            const ids = getIdentifiers([ewta]);
            ids.forEach(id => {
                console.log('  extends: ' + id.text);
            });
            //const qts = getQuestionTokens([ewta]);
            const trs = getTypeReferences([ewta]);
            trs.forEach(tr => {
                const ids = getIdentifiers([tr]);
                ids.forEach(id => {
                    console.log('    of ' + id.text);
                });
            });
        });

    });


    //printChildTypes(sf);
    console.log('done');
}

main();