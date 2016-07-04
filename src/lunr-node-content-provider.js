'use strict'

var fs = require("fs");
var slash = require("slash");
var path = require("path");

function isIndexable(filepath) {
  let extentions = ["js", "html", "md"];
  return extentions.indexOf(filepath.slice(filepath.lastIndexOf(".") + 1)) >= 0;
}

// this function throws an error if the index file does not exist
export function loadIndexJson(l4idxFile) {
  fs.accessSync(l4idxFile, fs.R_OK | fs.W_OK);
  // l4idxFile exists and is accessible to rw, load it
  let data = fs.readFileSync(l4idxFile);
  return JSON.parse(data);
}

export function saveIndexJson(jsonIndex, filename) {
  var serialized = JSON.stringify(jsonIndex.toJSON());
  fs.writeFileSync(filename, serialized);
}

function getFilepaths() {
  var relFilePaths = [];
  (function walk(rootDir) {
    fs.readdirSync(rootDir).forEach(function(file) {
      var stat = fs.statSync(path.join(rootDir, file));
      if (stat.isDirectory()) {
        walk(path.join(rootDir, file));
      } else if (stat.isFile()) {
        // just index js-files for now, with size < 500kB
        if (isIndexable(file) && stat.size < 500000) {
        // if (file.slice(-3) === ".js") {
          relFilePaths.push(path.join(rootDir, file));
        }
      }
    });
  })("./");

  return relFilePaths;
}

export async function* FileReader(filepath) {
  let filepaths;
  if (filepath === undefined) {
    filepaths = getFilepaths();
  } else {
    filepaths = [filepath];
  }

  for (let i = 0; i < filepaths.length; i++) {
    let relPath = slash(path.normalize(filepaths[i]));
    let parsedPath = path.parse(relPath);
    // async doesn't work, always is done after one iteration
    // let content = await new Promise( function(resolve, reject) {
    //   fs.readFile(relPath, 'utf8', function (err, data) {
    //     if (err) reject();
    //     resolve(data);
    //   });
    // });
    let content = fs.readFileSync(relPath, 'utf8');
    yield {
      path: relPath,
      filename: parsedPath.base,
      ext: parsedPath.ext.slice(1),
      content: content
    }
  }
}