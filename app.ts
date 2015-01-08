///<reference path='../TypeScript/built/local/typescript.d.ts' />
import ts = require('typescript');

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

function compile(sourceFile: ts.SourceFile) {
    var outputs = [];
    var compilerOptions: ts.CompilerOptions = {
        noImplicitAny: true, noEmitOnError: true,
        target: ts.ScriptTarget.Latest, module: ts.ModuleKind.CommonJS
    };
    var defaultCompilerHost = ts.createCompilerHost(compilerOptions);
    var compilerHost: ts.CompilerHost = {
        getSourceFile: function (filename, languageVersion, onError) {
            console.log("getSourcefile: " + filename);
            if (filename === "file.ts")
                //return ts.createSourceFile(filename, contents, compilerOptions.target);
                return sourceFile;
            return defaultCompilerHost.getSourceFile(filename, languageVersion, onError);
        },
        writeFile: function (name, text, writeByteOrderMark) {
            outputs.push({ name: name, text: text, writeByteOrderMark: writeByteOrderMark });
        },
        getDefaultLibFilename: defaultCompilerHost.getDefaultLibFilename,
        useCaseSensitiveFileNames: defaultCompilerHost.useCaseSensitiveFileNames,
        getCanonicalFileName: defaultCompilerHost.getCanonicalFileName,
        getCurrentDirectory: defaultCompilerHost.getCurrentDirectory,
        getNewLine: defaultCompilerHost.getNewLine
    };
    var program = ts.createProgram(["file.ts"], compilerOptions, compilerHost);
    var errors = program.getDiagnostics();
    if (!errors.length) {
        var checker = program.getTypeChecker(true);
        errors = checker.getDiagnostics();
        program.emitFiles();
    }
    return {
        outputs: outputs,
        errors: errors.map( e => e.file.filename + "(" + e.file.getLineAndCharacterFromPosition(e.start).line + "): " + e.messageText )
    };
}

export function main() {
    var m = <ts.ModuleDeclaration>ts.createNode(ts.SyntaxKind.ModuleDeclaration);
    var nm = <ts.Identifier>ts.createNode(ts.SyntaxKind.Identifier);
    nm.text = "Blah"
    m.name = nm;

    var sf = <ts.SourceFile>ts.createNode(ts.SyntaxKind.SourceFile);
    //sf.statements = <ts.NodeArray<ts.ModuleElement>>[m];

    var result = compile(sf);
    console.log(JSON.stringify(result));
}

main();