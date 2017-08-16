var addon = require('../native')

console.log(addon.hello())
console.log(addon.getYear(Date))

import ts = require("typescript")
console.log('ts.version: ' + ts.version);
console.log('ts.version: ' + addon.tsVersion);