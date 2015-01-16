///<reference path='../TypeScript/built/local/typescript.d.ts' />
///<reference path='../TypeScript/built/local/typescript_internal.d.ts' />
import ts = require('typescript');

export interface SourceFileVersion {
    filename: string;
    version: number;
    text: string;
}

// from https://github.com/Microsoft/TypeScript/issues/1651#issuecomment-69877863
export function formatCode(orig: string, changes: ts.TextChange[]): string {
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
export function defaultFormatCodeOptions(): ts.FormatCodeOptions {
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
export function inMemoryLanguageService(files: SourceFileVersion[]): ts.LanguageService {
    function getFile(filename: string) {
        return ts.forEach(files, f => f.filename === filename ? f : undefined);
    }
    var host: ts.LanguageServiceHost = {
        getScriptFileNames: () => files.map(f => f.filename),
        getScriptVersion: filename => getFile(filename).version.toString(),
        getScriptSnapshot: filename => ts.ScriptSnapshot.fromString(getFile(filename).text),
        // TODO do something else with the log messages
        log: message => undefined, //console.log('log: ' + message),
        trace: message => undefined, //console.log('trace: ' + message),
        error: message => undefined, //console.log('error: ' + message),
        getCurrentDirectory: () => '',
        getScriptIsOpen: () => true,
        getDefaultLibFilename: () => "lib.d.ts",
        getCompilationSettings: () => { return {}; },
    };
    return ts.createLanguageService(host, ts.createDocumentRegistry())
}

export function format(ts: string): string {
    var f: SourceFileVersion = { filename: "file.ts", version: 0, text: ts };
    var langSvc = inMemoryLanguageService([f]);
    var textChanges = langSvc.getFormattingEditsForDocument(f.filename, defaultFormatCodeOptions());
    return formatCode(f.text, textChanges);
}