var fm = require('file-manifest');
var findup = require('find-up');
var fs = require('fs');
var path = require('path');

exports.createManifest = (options, done) => {
  findup('package.json').then((filepath) => {
    var root = filepath.replace('/package.json', '');
    Promise.all([
      exports.getFromDir(root, options.routes || 'routes'),
      exports.getFromDir(root, options.middleware || 'middleware')
    ]).then((manifests) => {
      var manifest = {
        routes: manifests[0],
        middleware: manifests[1]
      };
      exports.writeManifest(manifest, done);
    }, (error) => {
      done(error);
    });
  });
};

exports.getFromDir = (root, dir) => {
  return fm.generate(path.join(root, dir), {
    load: 'readFile',
    reduce: 'nested'
  });
};

exports.writeManifest = (manifest, done) => {
  var output = path.resolve(__dirname, '../.manifest.json');
  fs.writeFile(output, JSON.stringify(manifest, null, 2), { encoding: 'utf8' }, done);
};
