///<reference path='typescriptServices.d.ts' />

// causes IntelliSense to partially work
// needed by Node.js at runtime, but comment out to use IntelliSense
var TypeScript = require('./typescriptServices');

// node.d.ts redefines require(), so must be below above statement
///<reference path='node.d.ts' />
import fs = require('fs');
import path = require('path');

export function getName(ast: TypeScript.AST) {
    var k = ast.kind();
    switch (k) {
        case TypeScript.SyntaxKind.IdentifierName:
            return (<TypeScript.Identifier>ast).text();
        case TypeScript.SyntaxKind.QualifiedName:
            var qn = <TypeScript.QualifiedName>ast;
            return getName(qn.left) + '.' + getName(qn.right);
        default:
            return TypeScript.SyntaxKind[k];
    }
}

export function main() {
    var filename = process.cwd() + '/typescriptServices.d.ts'
    var source = String(fs.readFileSync(filename));
    var syntaxTree = TypeScript.Parser.parse('typescriptServices.d.ts', TypeScript.SimpleText.fromString(source), /*isDeclaration*/ true ,
        new TypeScript.ParseOptions(TypeScript.LanguageVersion.EcmaScript5, /*autoSemicolon*/ true));

    var cs = new TypeScript.CompilationSettings();
    cs.codeGenTarget = TypeScript.LanguageVersion.EcmaScript5;
    var ics = TypeScript.ImmutableCompilationSettings.fromCompilationSettings(cs);
    var sourceUnit = TypeScript.SyntaxTreeToAstVisitor.visit(syntaxTree, 'typescriptServices.d.ts', ics, /*incrementalAST*/ false);

    for (var i = 0, n = sourceUnit.moduleElements.childCount(); i < n; i++) {
        var me = sourceUnit.moduleElements.childAt(i);
        switch (me.kind()) {
            case TypeScript.SyntaxKind.ModuleDeclaration:
                var md = <TypeScript.ModuleDeclaration> me;
                console.log('module ' + getName(md.name));
                break;
            case TypeScript.SyntaxKind.ClassDeclaration:
                var cd = <TypeScript.ClassDeclaration> me;
                console.log('class ' + cd.identifier.text());
                break;
            case TypeScript.SyntaxKind.VariableStatement:
                break;
        }
    }
}

main();