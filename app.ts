///<reference path='../TypeScript/built/local/typescript.d.ts' />
///<reference path='../TypeScript/built/local/typescript_internal.d.ts' />
import ts = require('typescript');

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

interface CompileOutput {
    name: string;
    text: string;
    writeByteOrderMark: boolean
}

//interface PrintKind {
//    node: ts.Node;
//    indent: string;
//}

// node.getChildren() throws exception, so using this instead
function getChildren(node: ts.Node) {
    var children: ts.Node[] = []
    ts.forEachChild(node, n => children.push(n));
    //console.log("number of children: " + children.length);
    return children;
}

function createId(text: string) {
    var id = <ts.Identifier>ts.createNode(ts.SyntaxKind.Identifier);
    id.text = "Square";
    return id;
}

function printKinds(sf: ts.SourceFile, root: ts.Node) {
    printKind(root, "  ");
    function printKind(node: ts.Node, indent: string) {
        var txt = indent + node.kind + " " + (<any>ts).SyntaxKind[node.kind];
        txt += ' pos: ' + node.pos + ', end: ' + node.end;
        var st = ts.getSourceTextOfNodeFromSourceFile(sf, node);
        txt += ', sourceText: ' + st;
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                var cd = <ts.ClassDeclaration>node;
                txt += " " + cd.name.text;
                //cd.name.text = "Square";
                //cd.name = createId("Square");
                
                break;
        }
        console.log(txt); // + " " + node.getText());
        //node.getChildren()
        //    .forEach(n => printKind(n, indent + "  "));
            //.forEach(n => console.log("child " + n));
        //for (var n in getChildren(node)) {
        //    console.log("  child:" + n);
        //    printKind(n, indent + "  ");
        //}
        getChildren(node).forEach(n => {
            //console.log("  child:" + n);
            printKind(n, indent + "  ");
        });
    }
}

function defaultCompileOptions(): ts.CompilerOptions {
    return {
        noImplicitAny: true,
        noEmitOnError: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.CommonJS,
        declaration: true
    }
}

function compile(){ // sourceFile: ts.SourceFile) {
    
    //ts.createLanguageServiceSourceFile
    //ts.createLanguageService
    //ts.createHo
    
    var outputs: CompileOutput[] = [];

    var compilerOptions = defaultCompileOptions();
    var sourceFile = ts.createSourceFile("file.ts", "class Triangle { edges() { return 3; } }", compilerOptions.target);
    printKinds(sourceFile, sourceFile);

    //console.log("sourceFile: " + JSON.stringify(sourceFile));
    //console.log("sourcefile symbol: " + sourceFile.kind);
    //var cl = sourceFile.statements[0];
    
    

    //console.log("class: " + JSON.stringify(cl));


    //for (var st in sourceFile.statements. ) {
    //sourceFile.statements.forEach(function (me, i) {
    //    //console.log("st: " + st);
    //    console.log("st: " + JSON.stringify(me));
    //});

    var defaultCompilerHost = ts.createCompilerHost(compilerOptions);
    var compilerHost: ts.CompilerHost = {
        getSourceFile: function (filename, languageVersion, onError) {
            console.log("getSourcefile: " + filename);
            if (filename === "file.ts")
                //return ts.createSourceFile(filename, contents, compilerOptions.target);
                //return sourceFile;
                //return ts.createSourceFile(filename, "class Triangle { edges() { return 3; } }", compilerOptions.target);
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
        var emitResult = program.emitFiles();
        
    }

    //console.log("sourcefile: " + sourceFile.text);

    return {
        outputs: outputs,
        errors: errors.map( e => e.file.filename + "(" + e.file.getLineAndCharacterFromPosition(e.start).line + "): " + e.messageText )
    };
}

interface SourceFile {
    filename: string;
    version: number;
    text: string;
}

// from core.ts
//export function forEach<T, U>(array: T[], callback: (element: T, index: number) => U): U {
//    if (array) {
//        for (var i = 0, len = array.length; i < len; i++) {
//            var result = callback(array[i], i);
//            if (result) {
//                return result;
//            }
//        }
//    }
//    return undefined;
//}

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services
function langSvc() {
    var txt = "class   Triangle { edges() { return 3; } }";

    // Files constituting our program
    var files: SourceFile[] = [
        { filename: "file1.ts", version: 0, text: txt },
    ];

    // Create the language service host to allow the LS to communicate with the host
    var servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => 
            //ts.map(files, f => f.filename),
            files.map(f => f.filename),
        getScriptVersion: (filename) => ts.forEach(files,
            f => f.filename === filename ? f.version.toString() : undefined),
        getScriptSnapshot: (filename) => {
            var file = ts.forEach(files, f => f.filename === filename ? f : undefined);
            // Read the text if we have not read it already
            var readText = () => file.text //?
                //file.text : file.text = fs.readFileSync(filename).toString();
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
        // example is missing:
        trace: message => console.log('trace: ' + message),
        error: message => console.log('error: ' + message),
    };

    // Create the language service files
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

    // Write a single file outputs
    //var emitFile = (filename: string) => {
    //    var output = services.getEmitOutput(filename);
    //    ts.forEach(output.outputFiles, o => {
    //        console.log("Writing file: " + o.name);
    //        //fs.writeFileSync(o.name, o.text, "utf8");
    //        console.log(o.text);
    //    });
    //};

    //emitFile("file1.ts");

} 

export function main() {
    //var m = <ts.ModuleDeclaration>ts.createNode(ts.SyntaxKind.ModuleDeclaration);
    //var nm = <ts.Identifier>ts.createNode(ts.SyntaxKind.Identifier);
    //nm.text = "Blah"
    //m.name = nm;

    //var sf = <ts.SourceFile>ts.createNode(ts.SyntaxKind.SourceFile);
    ////sf.statements = <ts.NodeArray<ts.ModuleElement>>[m];

    //var result = compile();
    ////var result = compile(sf);
    //console.log(JSON.stringify(result));
    langSvc();
}

main();