const fs = require('fs-extra');
const tar = require('tar');
const pj = require('./../package.json');
const version = pj.version;


const indir = './dist/brixthis';
const bundleDir = './dist/brixthis-bundle';
const tarDest = `${indir}/brixthis-bundle.${version}.tgz`

var assets = fs.readdirSync(indir).filter(fn => { return (!fn.endsWith('.js') && (!fn.endsWith('.html')))});
var bx = fs.readdirSync(indir).filter(fn => { return fn.startsWith('brixthis')});

var files = assets.concat(bx);
console.log(files)

if (!fs.existsSync(bundleDir)){
    fs.mkdirSync(bundleDir);
}


function tarFiles(dirToCopy, outputFile) {

return tar.c(
      {
        gzip: true,
        file: outputFile
      },
      [dirToCopy]
    ).then(() => {
      console.log( 'Tarball has been created at', outputFile)
      })
}


function copyFiles(){

  let copied = 0;
  for ( let i = 0; i < files.length; i++){
    fs.copy(`${indir}/${files[i]}`, `${bundleDir}/${files[i]}`, function (err) {
        console.log('copying: ', files[i])
        if (err) {
          console.error(err);
        } else {
          copied++;
          console.log("copied:  ", files[i]);
          if(copied == files.length ){
            tarFiles(bundleDir, tarDest)
          }
        }
      })
  }
  
}

copyFiles();