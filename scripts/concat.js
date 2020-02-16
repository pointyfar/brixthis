const pj = require('./../package.json');
const concat = require('concat');
var fs = require('fs');
var outdir = './dist/brixthis';

const version = pj.version;
const indir = "./dist/brixthis"
const files = [
    `${indir}/runtime.js`,
    `${indir}/polyfills.js`,
    `${indir}/main.js`
]

if (!fs.existsSync(outdir)){
    fs.mkdirSync(outdir);
}

const out = `${outdir}/brixthis.${version}.js`;
concat(files, out)

console.log("concat done.")