const pj = require('./../package.json');
const concat = require('concat');

const version = pj.version;
const dir = "./dist/brixthis"
const files = [
    `${dir}/polyfills.js`,
    `${dir}/runtime.js`,
    `${dir}/main.js`
]

const out = `${dir}/brixthis.${version}.js`;
concat(files, out)
