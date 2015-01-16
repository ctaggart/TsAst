///<reference path='tsast.ts' /> 
import tsast = require('./tsast');

function main() {
    var f: tsast.SourceFileVersion = {
        filename: "triangle.ts", version: 0,
        text: "class   Triangle { edges() { return 3; }}"
    };
    console.log('original: ' + f.text);
    var langSvc = tsast.inMemoryLanguageService([f]);
    var textChanges = langSvc.getFormattingEditsForDocument(f.filename, tsast.defaultFormatCodeOptions());
    console.log('number of text changes: ' + textChanges.length);
    textChanges.forEach(tc => console.log('start: ' + tc.span.start + ', length: ' + tc.span.length
        + ', new text: \'' + tc.newText + '\''));
    var formatted = tsast.formatCode(f.text, textChanges);
    console.log('formatted: ' + formatted);
}

main()