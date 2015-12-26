///<reference path='node_modules/typescript/lib/typescript.d.ts' />
///<reference path='node.d.ts' />

import ts = require('typescript');
import fs = require('fs');
import path = require('path');

function printChildTypes(root: ts.Node) {
    ts.forEachChild(root, n => console.log(n.kind + ' ' + (<any>ts).SyntaxKind[n.kind]));
}

interface IsKind { (kind: ts.SyntaxKind): boolean }

function getKind<T extends ts.Node>(isKind: IsKind, roots: ts.Node[]) {
    const result: T[] = [];
    roots.forEach(root => {
        ts.forEachChild(root, node => {
            if (isKind(node.kind))
                result.push(<T>node);
        })
    });
    return result;
}

function hasKind<T extends ts.Node>(isKind: IsKind, roots: ts.Node[]): boolean {
    let result = false;
    roots.forEach(root => {
        ts.forEachChild(root, node => {
            if (isKind(node.kind)) {
                result = true;
                return;
            }
        });
    });
    return result;
}

function getKindRecurse<T extends ts.Node>(isKind: IsKind, roots: ts.Node[]) {
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

function isKindPropertyDeclaration(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.PropertyDeclaration;
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

function isKindVariableStatement(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.VariableStatement;
}

function isKindVariableDeclarationList(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.VariableDeclarationList;
}

function isKindVariableDeclaration(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.VariableDeclaration;
}

function isKindKeyword(kind: ts.SyntaxKind) {
    return ts.SyntaxKind.FirstKeyword <= kind && kind <= ts.SyntaxKind.LastKeyword
}

function isKindParameter(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.Parameter;
}



function getModulesDeclarations(roots: ts.Node[]) {
    return getKind<ts.ModuleDeclaration>(isKindModuleDeclaration, roots);
}

function getModuleBlocks(roots: ts.Node[]) {
    return getKind<ts.ModuleBlock>(isKindModuleBlock, roots);
}

function getInterfaceDeclarations(roots: ts.Node[]) {
    return getKind<ts.InterfaceDeclaration>(isKindInterfaceDeclaration, roots);
}
    
function getInterfaceDeclarationsRecurse(roots: ts.Node[]) {
    return getKindRecurse<ts.InterfaceDeclaration>(isKindInterfaceDeclaration, roots);
}

function getEnumDeclarations(roots: ts.Node[]) {
    return getKind<ts.EnumDeclaration>(isKindEnumDeclaration, roots);
}

function getEnumMembers(roots: ts.Node[]) {
    return getKind<ts.EnumMember>(isKindEnumMember, roots);
}

function getFunctionDeclarations(roots: ts.Node[]) {
    return getKind<ts.FunctionDeclaration>(isKindFunctionDeclaration, roots);
}

function getLiteralTokens(roots: ts.Node[]) {
    return getKind<ts.LiteralExpression>(isKindLiteralToken, roots);
}

function getHeritageClauses(roots: ts.Node[]) {
  return getKind<ts.HeritageClause>(isKindHeritageClause, roots);
}

function getExpressionWithTypeArguments(roots: ts.Node[]) {
  return getKind<ts.ExpressionWithTypeArguments>(isKindExpressionWithTypeArguments, roots);
}

function getTypeReferences(roots: ts.Node[]) {
    return getKind<ts.TypeReferenceNode>(isKindTypeReference, roots);
}

function getIdentifiers(roots: ts.Node[]) {
    return getKind<ts.Identifier>(isKindIdentifier, roots);
}

function getTypeParameters(roots: ts.Node[]) {
    return getKind<ts.TypeParameterDeclaration>(isKindTypeParameter, roots);
}

function getVariableStatements(roots: ts.Node[]) {
    return getKind<ts.VariableStatement>(isKindVariableStatement, roots);
}

function getVariableDeclarationLists(roots: ts.Node[]) {
    return getKind<ts.VariableDeclarationList>(isKindVariableDeclarationList, roots);
}

function getVariableDeclarations(roots: ts.Node[]) {
    return getKind<ts.VariableDeclaration>(isKindVariableDeclaration, roots);
}

function getKeywords(roots: ts.Node[]) {
    return getKind<ts.LiteralExpression>(isKindKeyword, roots);
}

function getParameters(roots: ts.Node[]) {
    return getKind<ts.ParameterDeclaration>(isKindParameter, roots);
}

function getPropertyDeclarations(roots: ts.Node[]) {
    return getKind<ts.PropertyDeclaration>(isKindPropertyDeclaration, roots);
}

// TODO ts.PropertySignature exposed in newer version
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L590
function getPropertySignatures(roots: ts.Node[]) {
    return getKind<ts.VariableLikeDeclaration>(isKindPropertySignature, roots);
}

function hasQuestionToken(roots: ts.Node[]) {
    return hasKind(isKindQuestionToken, roots);
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

function isVariableStatement(node: ts.Node): node is ts.VariableStatement {
    return isKindVariableStatement(node.kind);
}

function isVariableDeclaration(node: ts.Node): node is ts.VariableDeclaration {
    return isKindVariableDeclaration(node.kind);
}

function isVariableDeclarationList(node: ts.Node): node is ts.VariableDeclarationList {
    return isKindVariableDeclarationList(node.kind);
}

function isKeyword(node: ts.Node): node is ts.LiteralExpression {
    return isKindKeyword(node.kind);
}

function isParameter(node: ts.Node): node is ts.ParameterDeclaration {
    return isKindParameter(node.kind);
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
    fds.map(fd => {
        console.log(fd.name.text)
        printType(fd, '  returns ');
        const pds = getParameters([fd]);
        pds.forEach(pd => {
            printText(pd.name, '  parameter ');
            printType(pd, '    ');
        });
    });

    console.log('\n# Enums');
    const eds = getEnumDeclarations(mbs);
    eds.map(ed => {
        console.log(ed.name.text);
        const ems = getEnumMembers([ed]);
        ems.forEach(em => {
            printText(em.name, '  ');
            const lts = getLiteralTokens([em]);
            lts.forEach(lt => printText(lt, '    = '));
        });
    });

    console.log('\n# Interfaces');
    let ifds = getInterfaceDeclarations(mbs);
    ifds.map(ifd => {
        console.log(ifd.name.text);
        const tps = getTypeParameters([ifd]);
        tps.forEach(tp => {
            console.log('  of ' + tp.name.text);
        });

        const hcs = getHeritageClauses([ifd]);
        const ewtas = getExpressionWithTypeArguments(hcs);
        ewtas.forEach(ewta => {
            printIdentifiers([ewta], '  ');
            printTypeReferences([ewta], '    ');
        });

        const pss = getPropertySignatures([ifd]);
        pss.forEach(ps => {
            printText(ps.name, '  prop: ');
            printType(ps, '    ');
        });
    });

    console.log('\n# Variables');
    const vbs = getVariableStatements(mbs);
    const vdls = getVariableDeclarationLists(vbs);
    const vds = getVariableDeclarations(vdls);
    vds.map(vd => {
        printIdentifiers([vd], '');
        printType(vd, '  ');
    });

    //printChildTypes(sf);
    console.log('done');
}

function printText(node: ts.Identifier | ts.LiteralExpression | ts.ComputedPropertyName | ts.BindingPattern, indent: string) {
    if (isIdentifier(node))
        console.log(indent + node.text);
    else if (isLiteralToken(node))
        console.log(indent + node.text);
    else // TODO other types
        console.log(indent + 'name kind ' + node.kind);
}

function printType(node: ts.Node, indent: string) {
    printTypeReferences([node], indent);
    printKeywords([node], indent); // if simple types like string, bool
    if (hasQuestionToken([node]))
        console.log(indent + '?');
}

function printIdentifiers(nodes: ts.Node[], indent: string) {
    const ids = getIdentifiers(nodes);
    ids.forEach(id => console.log(indent + id.text));
}

function printTypeReferences(nodes: ts.Node[], indent: string) {
    const trs = getTypeReferences(nodes);
    trs.forEach(tr => printIdentifiers(trs, indent));
}

function printKeywords(nodes: ts.Node[], indent: string) {
    const kws = getKeywords(nodes);
    kws.forEach(kw => {
        switch (kw.kind) {
            case ts.SyntaxKind.BooleanKeyword:
                console.log(indent + 'boolean');
                break;
            case ts.SyntaxKind.StringKeyword:
                console.log(indent + 'string');
                break;
            default:
                console.log(indent + (<any>ts).SyntaxKind[kw.kind]);
        }
    });
}

main();