/////<reference path='node_modules/typescript/lib/typescript.d.ts' />
/////<reference path='../TypeScript/lib/typescript.d.ts' />
///<reference path='../TypeScript/built/local/typescript.d.ts' />
///<reference path='node.d.ts' />

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#pretty-printer-using-the-ls-formatter
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/parser.ts

//class MyEmitResolver implements ts.EmitResolver {
//    hasGlobalName(name: string) { return false; }

//}

export function main() {
    let source = "var a=function(v:number){return 0+1+2+3;}";
    let sourceFile = ts.createSourceFile("file.ts", source, ts.ScriptTarget.ES6, true);
    (<any>sourceFile).externalModuleIndicator = sourceFile.statements[0];

    // It would be nice if I could create it from scratch.
    //let sourceFile = <ts.SourceFile>ts.createNode(ts.SyntaxKind.SourceFile);
    //sourceFile.text = "";

    //let stmt = <ts.VariableStatement>ts.createNode(ts.SyntaxKind.VariableStatement);
    //let vdl = <ts.VariableDeclarationList>ts.createNode(ts.SyntaxKind.VariableDeclarationList);
    //let vd = <ts.VariableDeclaration>ts.createNode(ts.SyntaxKind.VariableDeclaration);
    //let id = <ts.Identifier>ts.createNode(ts.SyntaxKind.Identifier);
    //let t = <ts.LiteralExpression>ts.createNode(ts.SyntaxKind.FirstLiteralToken);
    //t.text = "1";
    //id.text = "a";
    //vd.name = id;
    //vdl.declarations = <ts.NodeArray<ts.VariableDeclaration>>[vd];
    //stmt.declarationList = vdl;

    //sourceFile.statements = <ts.NodeArray<ts.Statement>>[];
    //sourceFile.statements[0] = stmt;
    //sourceFile.statements = <ts.NodeArray<ts.Statement>>[<ts.Statement>stmt];

    //let formatCodeOptions = getDefaultOptions();
    //let rulesProvider = getRuleProvider(formatCodeOptions);

    //let edits = (<any>ts).formatting.formatDocument(sourceFile, rulesProvider, formatCodeOptions);
    //let code = applyEdits(sourceFile.text, edits);
    //console.log(code);
    
    let resolver: ts.EmitResolver = {
        hasGlobalName(name: string) { return false; },
        getReferencedExportContainer(node: ts.Identifier) { return undefined; },
        getReferencedImportDeclaration(node: ts.Identifier) { return undefined },
        getReferencedNestedRedeclaration(node: ts.Identifier) { return undefined },
        isNestedRedeclaration(node: ts.Declaration) { return false; },
        isValueAliasDeclaration(node: ts.Node) { return false; },
        isReferencedAliasDeclaration(node: ts.Node, checkChildren?: boolean) { return false; },
        isTopLevelValueImportEqualsWithEntityName(node: ts.ImportEqualsDeclaration) { return false; },
        getNodeCheckFlags(node: ts.Node) { return undefined; },
        isDeclarationVisible(node: ts.Declaration) { return true; },
        collectLinkedAliases(node: ts.Identifier) { return []; },
        isImplementationOfOverload(node: ts.FunctionLikeDeclaration) { return false; },
        writeTypeOfDeclaration(declaration: ts.AccessorDeclaration | ts.VariableLikeDeclaration, enclosingDeclaration: ts.Node, flags: ts.TypeFormatFlags, writer: ts.SymbolWriter) { },
        writeReturnTypeOfSignatureDeclaration(signatureDeclaration: ts.SignatureDeclaration, enclosingDeclaration: ts.Node, flags: ts.TypeFormatFlags, writer: ts.SymbolWriter) { },
        writeTypeOfExpression(expr: ts.Expression, enclosingDeclaration: ts.Node, flags: ts.TypeFormatFlags, writer: ts.SymbolWriter) { },
        isSymbolAccessible(symbol: ts.Symbol, enclosingDeclaration: ts.Node, meaning: ts.SymbolFlags) { return undefined; },
        isEntityNameVisible(entityName: ts.EntityName | ts.Expression, enclosingDeclaration: ts.Node) { return undefined; },
        getConstantValue(node: ts.EnumMember | ts.PropertyAccessExpression | ts.ElementAccessExpression) { return 0; },
        getReferencedValueDeclaration(reference: ts.Identifier) { return undefined; },
        getTypeReferenceSerializationKind(typeName: ts.EntityName) { return undefined; },
        isOptionalParameter(node: ts.ParameterDeclaration) { return false; },
        isArgumentsLocalBinding(node: ts.Identifier) { return false; },
        getExternalModuleFileFromDeclaration(declaration: ts.ImportEqualsDeclaration | ts.ImportDeclaration | ts.ExportDeclaration) { return undefined; }
    }

    const options: ts.CompilerOptions = {
        module: ts.ModuleKind.ES6,
        target: ts.ScriptTarget.ES6,
        emitBOM: false
    };

    let host: ts.EmitHost = {
        getCompilerOptions() { return options; },
        getSourceFile(fileName: string) { return undefined; },
        getCurrentDirectory() { return undefined; },
        getSourceFiles() { return []; },
        getCommonSourceDirectory() { return undefined; },
        getCanonicalFileName(fileName: string) { return undefined; },
        getNewLine() { return '\n'; },
        isEmitBlocked(emitFileName: string) { return false; },
        writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void) {
            console.log('fileName: ' + fileName);
            console.log('data: ' + data);
        }
    }

    //let emitResult = ts.emitFiles(resolver, host, sourceFile);
    //console.log(emitResult);

    const diagnostics = ts.createDiagnosticCollection();
    let emitResult = ts.emitDeclarations(host, resolver, diagnostics, "file.ts", [sourceFile], false)
    console.log(emitResult);
}

function getRuleProvider(options: ts.FormatCodeOptions) {
    // Share this between multiple formatters using the same options.
    // This represents the bulk of the space the formatter uses.
    let ruleProvider = new (<any>ts).formatting.RulesProvider();
    ruleProvider.ensureUpToDate(options);
    return ruleProvider;
}

function applyEdits(text: string, edits: ts.TextChange[]): string {
    // Apply edits in reverse on the existing text
    let result = text;
    for (let i = edits.length - 1; i >= 0; i--) {
        let change = edits[i];
        let head = result.slice(0, change.span.start);
        let tail = result.slice(change.span.start + change.span.length)
        result = head + change.newText + tail;
    }
    return result;
}

function getDefaultOptions(): ts.FormatCodeOptions {
    return {
        IndentSize: 4,
        TabSize: 4,
        NewLineCharacter: '\r',
        ConvertTabsToSpaces: true,
        InsertSpaceAfterCommaDelimiter: true,
        InsertSpaceAfterSemicolonInForStatements: true,
        InsertSpaceBeforeAndAfterBinaryOperators: true,
        InsertSpaceAfterKeywordsInControlFlowStatements: true,
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false, // added
        PlaceOpenBraceOnNewLineForFunctions: false,
        PlaceOpenBraceOnNewLineForControlBlocks: false,
        IndentStyle: ts.IndentStyle.Smart // added
    };
}

main();