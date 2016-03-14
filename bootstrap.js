'use strict';

const fs     = require ('fs');
const path   = require ('path');
const co     = require ('co');
const spawn  = require ('co-child-process');
const rimraf = require ('rimraf');


function* git () {
  const args = Array.prototype.slice.call (arguments);
  console.log (`git ${args.join (' ')}`);

  yield spawn ('git', args, {
    stdio: ['ignore', 1, 2],
    cwd: __dirname
  });
}

function* npm (verb, modPath) {
  console.log (`npm ${verb} ${modPath}`);

  let args = [verb];
  if (Array.isArray (modPath)) {
    args = args.concat (modPath);
  } else {
    args.push (modPath);
  }
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  yield spawn (npm, args, {
    stdio: ['ignore', 1, 2],
    cwd: __dirname
  });
}

function* rm (nodeModPath) {
  console.log (`rm ${nodeModPath}`);

  yield rimraf.sync (path.join (__dirname, nodeModPath)) || {};
}

function parsePackage (packagePath) {
  let def = fs.readFileSync (path.join (__dirname, packagePath));
  def = JSON.parse (def);

  let list = {};

  [def.dependencies, def.devDependencies]
    .forEach (deps => {
      Object
        .keys (deps)
        .filter (pkg => {
          return !/^electrum(?:-arc)?$/.test (pkg);
        })
        .forEach (pkg => {
          list[`${pkg}@${deps[pkg]}`] = null;
        });
    });

  return Object.keys (list);
}

co (function* () {
  yield* git ('submodule', 'update', '--init', '--recursive');
  yield* git ('submodule', 'foreach', '--recursive', 'git checkout master');
  yield* git ('submodule', 'foreach', '--recursive', 'git pull');

  let list = [];
  list = list.concat (
    parsePackage ('electrum-starter-3/package.json'),
    parsePackage ('electrum/package.json'),
    parsePackage ('electrum-arc/package.json')
  );
  yield* npm ('install', list);

  fs.symlinkSync ('../node_modules', path.join (__dirname, './electrum-starter-3/node_modules'), 'junction');
  fs.symlinkSync ('../electrum', path.join (__dirname, './node_modules/electrum'), 'junction');
  fs.symlinkSync ('../electrum-arc', path.join (__dirname, './node_modules/electrum-arc'), 'junction');
}).then (() => {
  console.log ('done');
}, err => {
  console.error (err.stack);
});
