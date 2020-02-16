const fs = require('fs-extra');
const zlib = require('zlib');
const tar = require('tar');

const indir = './dist/brixthis';
const outdir = './dist/brixthis-bundle';

var assets = fs.readdirSync(indir).filter(fn => { return (!fn.endsWith('.js') && (!fn.endsWith('.html')))});
var bx = fs.readdirSync(indir).filter(fn => { return fn.startsWith('brixthis')});

var files = assets.concat(bx);

if (!fs.existsSync(outdir)){
    fs.mkdirSync(outdir);
}

files.forEach(file => {
    fs.copy(`${indir}/${file}`, `${outdir}/${file}`, function (err) {
        console.log('copying: ', file)
        if (err) {
          console.error(err);
        } else {
          console.log("copied:  ", file);
        }
      })
})

tar.c(
    {
      gzip: true
    },
    [outdir]
  ).pipe(fs.createWriteStream(`${indir}/brixthis-bundle.tgz`))