///<reference path='../TypeScript/built/local/typescript.d.ts' />
///<reference path='../TypeScript/built/local/typescript_internal.d.ts' />
import ts = require('typescript');

interface SourceFileVersion {
    filename: string;
    version: number;
    text: string;
}

// from https://github.com/Microsoft/TypeScript/issues/1651#issuecomment-69877863
function formatCode(orig: string, changes: ts.TextChange[]): string {
    var result = orig;
    for (var i = changes.length - 1; i >= 0; i--) {
        var change = changes[i];
        var head = result.slice(0, change.span.start);
        var tail = result.slice(change.span.start + change.span.length)
        result = head + change.newText + tail;
    }
    return result;
}

// 2015-01-13 from https://github.com/Microsoft/TypeScript/blob/master/src/harness/fourslash.ts#L350-L363
function defaultFormatCodeOptions(): ts.FormatCodeOptions {
    return {
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
}

// derived from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
function inMemoryLanguageService(files: SourceFileVersion[]): ts.LanguageService {
    var host: ts.LanguageServiceHost = {
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
        // TODO do something else with the log messages
        log: message => undefined, //console.log('log: ' + message),
        trace: message => undefined, //console.log('trace: ' + message),
        error: message => undefined, //console.log('error: ' + message),
        getCurrentDirectory: () => '',
        getScriptIsOpen: () => true,
        getDefaultLibFilename: () => "lib.d.ts",
        getLocalizedDiagnosticMessages: () => undefined,
        getCancellationToken: () => undefined,
        getCompilationSettings: () => { return {}; },
    };
    return ts.createLanguageService(host, ts.createDocumentRegistry())
}

export function format() {
    var f: SourceFileVersion = { filename: "triangle.ts", version: 0, 
        text: "class   Triangle { edges() { return 3; }}" };
    console.log('original: ' + f.text);
    var langSvc = inMemoryLanguageService([f]);
    var textChanges = langSvc.getFormattingEditsForDocument(f.filename, defaultFormatCodeOptions());
    console.log('number of text changes: ' + textChanges.length);
    textChanges.forEach(tc => console.log('start: ' + tc.span.start + ', length: '+ tc.span.length 
        + ', new text: \'' + tc.newText + '\''));
    var formatted = formatCode(f.text, textChanges);
    console.log('formatted: ' + formatted);
} 

format();