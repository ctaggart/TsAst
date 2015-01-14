///<reference path='../TypeScript/built/local/typescript.d.ts' />
///<reference path='../TypeScript/built/local/typescript_internal.d.ts' />
import ts = require('typescript');

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

interface SourceFile {
    filename: string;
    version: number;
    text: string;
}

export function format() {
    var files: SourceFile[] = [
        { filename: "file1.ts", version: 0, text: "class   Triangle { edges() { return 3; } }" },
    ];

    var servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => files.map(f => f.filename),
        getScriptVersion: (filename) => ts.forEach(files,
            f => f.filename === filename ? f.version.toString() : undefined),
        getScriptSnapshot: (filename) => {
            var file = ts.forEach(files, f => f.filename === filename ? f : undefined);
            var readText = () => file.text
            return {
                getText: (start, end) => readText().substring(start, end),
                getLength: () => readText().length,
                getLineStartPositions: () => [],
                getChangeRange: oldSnapshot => undefined
            };
        },
        log: message => console.log('log: ' + message),
        getCurrentDirectory: () => '',
        getScriptIsOpen: () => true,
        getDefaultLibFilename: () => "lib.d.ts",
        getLocalizedDiagnosticMessages: () => undefined,
        getCancellationToken: () => undefined,
        getCompilationSettings: () => { return {}; },
        // missing from example
        trace: message => console.log('trace: ' + message),
        error: message => console.log('error: ' + message),
    };

    var services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())

    // from src\harness\fourslash.ts
    var formatCodeOptions: ts.FormatCodeOptions = {
        IndentSize: 4,
        TabSize: 4,
        NewLineCharacter: ts.sys.newLine,
        ConvertTabsToSpaces: true,
        InsertSpaceAfterCommaDelimiter: true,
        InsertSpaceAfterSemicolonInForStatements: true,
        InsertSpaceBeforeAndAfterBinaryOperators: true,
        InsertSpaceAfterKeywordsInControlFlowStatements: true,
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        PlaceOpenBraceOnNewLineForFunctions: false,
        PlaceOpenBraceOnNewLineForControlBlocks: false,
    };

    var textChanges = services.getFormattingEditsForDocument("file1.ts", formatCodeOptions);
    console.log('text changes: ' + textChanges.length);
    textChanges.forEach(tc =>
        console.log('tc: ' + tc.span.start + ' ' + tc.span.length + ' "' + tc.newText + '"'));

    var sf = services.getSourceFile("file1.ts");
    textChanges.forEach(tc => {
        var tcr: ts.TextChangeRange = {
            span: tc.span,
            newLength: tc.newText.length,
        }
        var b = sf.update(tc.newText, tcr);
        console.log('b.text: ' + b.text);
    });
    console.log('sf.text: ' + sf.text);
} 

format();