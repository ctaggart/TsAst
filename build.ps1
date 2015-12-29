.\paket.bootstrapper.exe
.\paket.exe restore
msbuild TsAst.sln
copy .\packages\Edge.js\content\edge\x86\node.dll .\bin\Debug\
$dir = '.\bin\Debug\edge'
if (-Not (Test-Path $dir)){ md $dir }
copy .\packages\Edge.js\content\edge\double_edge.js $dir
copy .\packages\Edge.js\content\edge\edge.js $dir
$dir = '.\bin\Debug\edge\x86'
if (-Not (Test-Path $dir)){ md $dir }
copy .\packages\Edge.js\content\edge\x86\edge.node $dir
npm install