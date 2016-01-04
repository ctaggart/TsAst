open Taser.Chakra

let printfn format = Printf.ksprintf System.Diagnostics.Debug.WriteLine format

type ScriptTarget =
    | ES3 = 0
    | ES5 = 1
    | ES6 = 2
    | ES2015 = 2
    | Latest = 2

 type SyntaxKind =
    | Unknown = 0
    | EndOfFileToken = 1
    | SingleLineCommentTrivia = 2
    | MultiLineCommentTrivia = 3
    | NewLineTrivia = 4
    | WhitespaceTrivia = 5
    | ShebangTrivia = 6
    | ConflictMarkerTrivia = 7
    | NumericLiteral = 8
    | StringLiteral = 9
    | RegularExpressionLiteral = 10
    | NoSubstitutionTemplateLiteral = 11
    | TemplateHead = 12
    | TemplateMiddle = 13
    | TemplateTail = 14
    | OpenBraceToken = 15
    | CloseBraceToken = 16
    | OpenParenToken = 17
    | CloseParenToken = 18
    | OpenBracketToken = 19
    | CloseBracketToken = 20
    | DotToken = 21
    | DotDotDotToken = 22
    | SemicolonToken = 23
    | CommaToken = 24
    | LessThanToken = 25
    | LessThanSlashToken = 26
    | GreaterThanToken = 27
    | LessThanEqualsToken = 28
    | GreaterThanEqualsToken = 29
    | EqualsEqualsToken = 30
    | ExclamationEqualsToken = 31
    | EqualsEqualsEqualsToken = 32
    | ExclamationEqualsEqualsToken = 33
    | EqualsGreaterThanToken = 34
    | PlusToken = 35
    | MinusToken = 36
    | AsteriskToken = 37
    | AsteriskAsteriskToken = 38
    | SlashToken = 39
    | PercentToken = 40
    | PlusPlusToken = 41
    | MinusMinusToken = 42
    | LessThanLessThanToken = 43
    | GreaterThanGreaterThanToken = 44
    | GreaterThanGreaterThanGreaterThanToken = 45
    | AmpersandToken = 46
    | BarToken = 47
    | CaretToken = 48
    | ExclamationToken = 49
    | TildeToken = 50
    | AmpersandAmpersandToken = 51
    | BarBarToken = 52
    | QuestionToken = 53
    | ColonToken = 54
    | AtToken = 55
    | EqualsToken = 56
    | PlusEqualsToken = 57
    | MinusEqualsToken = 58
    | AsteriskEqualsToken = 59
    | AsteriskAsteriskEqualsToken = 60
    | SlashEqualsToken = 61
    | PercentEqualsToken = 62
    | LessThanLessThanEqualsToken = 63
    | GreaterThanGreaterThanEqualsToken = 64
    | GreaterThanGreaterThanGreaterThanEqualsToken = 65
    | AmpersandEqualsToken = 66
    | BarEqualsToken = 67
    | CaretEqualsToken = 68
    | Identifier = 69
    | BreakKeyword = 70
    | CaseKeyword = 71
    | CatchKeyword = 72
    | ClassKeyword = 73
    | ConstKeyword = 74
    | ContinueKeyword = 75
    | DebuggerKeyword = 76
    | DefaultKeyword = 77
    | DeleteKeyword = 78
    | DoKeyword = 79
    | ElseKeyword = 80
    | EnumKeyword = 81
    | ExportKeyword = 82
    | ExtendsKeyword = 83
    | FalseKeyword = 84
    | FinallyKeyword = 85
    | ForKeyword = 86
    | FunctionKeyword = 87
    | IfKeyword = 88
    | ImportKeyword = 89
    | InKeyword = 90
    | InstanceOfKeyword = 91
    | NewKeyword = 92
    | NullKeyword = 93
    | ReturnKeyword = 94
    | SuperKeyword = 95
    | SwitchKeyword = 96
    | ThisKeyword = 97
    | ThrowKeyword = 98
    | TrueKeyword = 99
    | TryKeyword = 100
    | TypeOfKeyword = 101
    | VarKeyword = 102
    | VoidKeyword = 103
    | WhileKeyword = 104
    | WithKeyword = 105
    | ImplementsKeyword = 106
    | InterfaceKeyword = 107
    | LetKeyword = 108
    | PackageKeyword = 109
    | PrivateKeyword = 110
    | ProtectedKeyword = 111
    | PublicKeyword = 112
    | StaticKeyword = 113
    | YieldKeyword = 114
    | AbstractKeyword = 115
    | AsKeyword = 116
    | AnyKeyword = 117
    | AsyncKeyword = 118
    | AwaitKeyword = 119
    | BooleanKeyword = 120
    | ConstructorKeyword = 121
    | DeclareKeyword = 122
    | GetKeyword = 123
    | IsKeyword = 124
    | ModuleKeyword = 125
    | NamespaceKeyword = 126
    | RequireKeyword = 127
    | NumberKeyword = 128
    | SetKeyword = 129
    | StringKeyword = 130
    | SymbolKeyword = 131
    | TypeKeyword = 132
    | FromKeyword = 133
    | OfKeyword = 134
    | QualifiedName = 135
    | ComputedPropertyName = 136
    | TypeParameter = 137
    | Parameter = 138
    | Decorator = 139
    | PropertySignature = 140
    | PropertyDeclaration = 141
    | MethodSignature = 142
    | MethodDeclaration = 143
    | Constructor = 144
    | GetAccessor = 145
    | SetAccessor = 146
    | CallSignature = 147
    | ConstructSignature = 148
    | IndexSignature = 149
    | TypePredicate = 150
    | TypeReference = 151
    | FunctionType = 152
    | ConstructorType = 153
    | TypeQuery = 154
    | TypeLiteral = 155
    | ArrayType = 156
    | TupleType = 157
    | UnionType = 158
    | IntersectionType = 159
    | ParenthesizedType = 160
    | ObjectBindingPattern = 161
    | ArrayBindingPattern = 162
    | BindingElement = 163
    | ArrayLiteralExpression = 164
    | ObjectLiteralExpression = 165
    | PropertyAccessExpression = 166
    | ElementAccessExpression = 167
    | CallExpression = 168
    | NewExpression = 169
    | TaggedTemplateExpression = 170
    | TypeAssertionExpression = 171
    | ParenthesizedExpression = 172
    | FunctionExpression = 173
    | ArrowFunction = 174
    | DeleteExpression = 175
    | TypeOfExpression = 176
    | VoidExpression = 177
    | AwaitExpression = 178
    | PrefixUnaryExpression = 179
    | PostfixUnaryExpression = 180
    | BinaryExpression = 181
    | ConditionalExpression = 182
    | TemplateExpression = 183
    | YieldExpression = 184
    | SpreadElementExpression = 185
    | ClassExpression = 186
    | OmittedExpression = 187
    | ExpressionWithTypeArguments = 188
    | AsExpression = 189
    | TemplateSpan = 190
    | SemicolonClassElement = 191
    | Block = 192
    | VariableStatement = 193
    | EmptyStatement = 194
    | ExpressionStatement = 195
    | IfStatement = 196
    | DoStatement = 197
    | WhileStatement = 198
    | ForStatement = 199
    | ForInStatement = 200
    | ForOfStatement = 201
    | ContinueStatement = 202
    | BreakStatement = 203
    | ReturnStatement = 204
    | WithStatement = 205
    | SwitchStatement = 206
    | LabeledStatement = 207
    | ThrowStatement = 208
    | TryStatement = 209
    | DebuggerStatement = 210
    | VariableDeclaration = 211
    | VariableDeclarationList = 212
    | FunctionDeclaration = 213
    | ClassDeclaration = 214
    | InterfaceDeclaration = 215
    | TypeAliasDeclaration = 216
    | EnumDeclaration = 217
    | ModuleDeclaration = 218
    | ModuleBlock = 219
    | CaseBlock = 220
    | ImportEqualsDeclaration = 221
    | ImportDeclaration = 222
    | ImportClause = 223
    | NamespaceImport = 224
    | NamedImports = 225
    | ImportSpecifier = 226
    | ExportAssignment = 227
    | ExportDeclaration = 228
    | NamedExports = 229
    | ExportSpecifier = 230
    | MissingDeclaration = 231
    | ExternalModuleReference = 232
    | JsxElement = 233
    | JsxSelfClosingElement = 234
    | JsxOpeningElement = 235
    | JsxText = 236
    | JsxClosingElement = 237
    | JsxAttribute = 238
    | JsxSpreadAttribute = 239
    | JsxExpression = 240
    | CaseClause = 241
    | DefaultClause = 242
    | HeritageClause = 243
    | CatchClause = 244
    | PropertyAssignment = 245
    | ShorthandPropertyAssignment = 246
    | EnumMember = 247
    | SourceFile = 248
    | JSDocTypeExpression = 249
    | JSDocAllType = 250
    | JSDocUnknownType = 251
    | JSDocArrayType = 252
    | JSDocUnionType = 253
    | JSDocTupleType = 254
    | JSDocNullableType = 255
    | JSDocNonNullableType = 256
    | JSDocRecordType = 257
    | JSDocRecordMember = 258
    | JSDocTypeReference = 259
    | JSDocOptionalType = 260
    | JSDocFunctionType = 261
    | JSDocVariadicType = 262
    | JSDocConstructorType = 263
    | JSDocThisType = 264
    | JSDocComment = 265
    | JSDocTag = 266
    | JSDocParameterTag = 267
    | JSDocReturnTag = 268
    | JSDocTypeTag = 269
    | JSDocTemplateTag = 270
    | SyntaxList = 271
    | Count = 272
    | FirstAssignment = 56
    | LastAssignment = 68
    | FirstReservedWord = 70
    | LastReservedWord = 105
    | FirstKeyword = 70
    | LastKeyword = 134
    | FirstFutureReservedWord = 106
    | LastFutureReservedWord = 114
    | FirstTypeNode = 151
    | LastTypeNode = 160
    | FirstPunctuation = 15
    | LastPunctuation = 68
    | FirstToken = 0
    | LastToken = 134
    | FirstTriviaToken = 2
    | LastTriviaToken = 7
    | FirstLiteralToken = 8
    | LastLiteralToken = 11
    | FirstTemplateToken = 11
    | LastTemplateToken = 14
    | FirstBinaryOperator = 25
    | LastBinaryOperator = 68
    | FirstNode = 135

type Node = 
    interface end

type Declaration =
    inherit Node
    
type SourceFile =
    inherit Declaration
    abstract member kind : int

type JsProxy(v: JavaScriptValue) =
    member x.JsValue = v

type SourceFileImpl(v) =
    inherit JsProxy(v)
    interface SourceFile with 
        member x.kind = (v.GetPropertyByName "kind").AsInt

let createJsFunction callback =
    JavaScriptValue.CreateFunction(JavaScriptNativeFunction callback)

type TypeScriptServices(cc: ChakraContext) =

    let fcreateSourceFile  = cc.RunScript "ts.createSourceFile"
    let fforEach  = cc.RunScript "forEach"

    member x.createSourceFile (fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes: bool option): SourceFile =
        let args = 
            [|  JavaScriptValue.FromString fileName
                JavaScriptValue.FromString sourceText
                JavaScriptValue.FromInt32 (int languageVersion)
                JavaScriptValue.FromBooleanOption setParentNodes
            |]
        let v = cc.CallFunction (fcreateSourceFile, args)
        SourceFileImpl v :> SourceFile

    // lib.d.ts TODO
    // forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    member x.forEach (callbackfn: ('T * float * 'T[]) -> unit, thisArg: obj option): unit =
        let callback = 
            createJsFunction(fun callee isConstructCall arguments argumentCount callbackData ->
                // TODO call callbackfn
                for arg in arguments do
                    printfn "arg: %A" arg
                JavaScriptValue.Invalid
            )
        let args = 
            [|  callback
                JavaScriptValue.FromObjectOption thisArg
            |]
        cc.CallFunction (fforEach, args) |> ignore

    // function forEachChild<T>(node: Node, cbNode: (node: Node) => T, cbNodeArray?: (nodes: Node[]) => T): T;
    member x.forEachChild<'T when 'T :> JsProxy> (node: Node, cbNode: Node -> 'T, cbNodeArray: (Node -> 'T) option, createJsProxy: JavaScriptValue -> 'T): 'T =
        let args = 
            [|  (node :?> JsProxy).JsValue
                // TODO
            |]
        let v = cc.CallFunction (fcreateSourceFile, args)
        createJsProxy v

let printValueType (v:JavaScriptValue) =
    printfn "ValueType: %A" v.ValueType

let passJsRefToFunction (cc: ChakraContext) =

    // Hello World
    let hw = cc.RunScript "'Hello' + ' World'"
    printfn "hw: %s" hw.AsString

    // create a function
    let createPerson = cc.RunScript "(function(){ return { name: 'Cameron', age: 36 } });"
    printValueType createPerson // Function

    // call that function
    let person = cc.CallFunction(createPerson, Array.empty)
    printValueType person // Object

    // get a property of the returned object
    printfn "name: %s" ((person.GetPropertyByName "name").AsString)

    // get the number of properties of the object
    let names = person.GetOwnPropertyNames()
    printValueType names // Array
    let plength = names.GetPropertyByName "length"
    printValueType plength // Number
    let ec, d = Native.JsNumberToDouble plength
    printfn "length: %d" plength.AsInt

    // TypeScript Services

    // get a function reference
    let createNode = cc.RunScript "ts.createNode"
    printValueType createNode // Function
    printfn "createNode: "

    // calling the function
    let node = cc.CallFunction(createNode, [| JavaScriptValue.FromInt32 1 |])
    printValueType node
    printfn "node: "

    // access a property on the returned object
    printfn "  kind: %d" ((node.GetPropertyByName "kind").AsInt)

    // pass in the object to a custom function
    let getKind = cc.RunScript "(function(x){ return x.kind; })"
    let kind = cc.CallFunction(getKind, [| node |])
    printValueType kind // Number
    printfn "kind: %d" kind.AsInt

[<EntryPoint>]
let main argv =
    let cc = ChakraContext()
    let fn = @"C:\ts\TsAst\node_modules\typescript\lib\typescriptServices.js"
    let js = readFileToEnd fn
    cc.RunScript js |> ignore
//    passJsRefToFunction cc

    let ts = TypeScriptServices cc
    let sf = ts.createSourceFile(fn, js, ScriptTarget.Latest, None)
    printfn "sf kind: %d" sf.kind 

    // print Nodes
    // print Nodes with JavaScript forEach

//    printfn "\nModules"

//    let getNodes = createJsFunction(fun callee isConstructCall arguments argumentCount callbackData ->
//        for arg in arguments do
//            printfn "arg: %A" arg
//        JavaScriptValue.Invalid
//    )


    0