const fs = require('fs-extra');

const indir = './dist/tmp';
const outdir = './dist/brixthis';

var files = fs.readdirSync('./dist/tmp').filter(fn => { return !fn.endsWith('.js')});

files.forEach(file => {
    fs.copy(`${indir}/${file}`, `${outdir}/${file}`, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("copied: ", file);
        }
      })
})