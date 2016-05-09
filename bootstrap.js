'use strict';

const fs     = require ('fs');
const path   = require ('path');
const co     = require ('co');
const spawn  = require ('co-child-process');

function loadIgnoreList () {
  return JSON.parse (fs.readFileSync ('./.bootstrap-ignore.json'));
}

const ignoreList = loadIgnoreList ();

function * git () {
  const args = Array.prototype.slice.call (arguments);
  console.log (`git ${args.join (' ')}`);

  yield spawn ('git', args, {
    stdio: ['ignore', 1, 2],
    cwd: __dirname
  });
}

function * npm (verb, modPath, cwd) {
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
    cwd: cwd || __dirname
  });
}

function parsePackage (packagePath) {
  let def = fs.readFileSync (path.join (__dirname, packagePath));
  def = JSON.parse (def);

  let list = {};

  [def.dependencies, def.devDependencies]
    .filter (deps => !!deps)
    .forEach (deps => {
      Object
        .keys (deps)
        .filter (pkg => {
          return ignoreList.indexOf (pkg) === -1;
        })
        .forEach (pkg => {
          list[`${pkg}@${deps[pkg]}`] = null;
        });
    });

  return list;
}

function symlink (src, dst) {
  try {
    fs.symlinkSync (src, dst, 'junction');
  } catch (ex) {
    console.error (ex.stack);
  }
}

co (function * () {
  yield* git ('submodule', 'update',  '--init',      '--recursive');
  yield* git ('submodule', 'foreach', '--recursive', 'git checkout master');
  yield* git ('submodule', 'foreach', '--recursive', 'git pull');

  let list = {};
  ignoreList.forEach (pkg => {
    list = Object.assign (list, parsePackage (`${pkg}/package.json`));
  });

  yield* npm ('install', Object.keys (list));

  ignoreList.forEach (pkg => {
    symlink (
      path.join (__dirname, 'node_modules'),
      path.join (__dirname, `./${pkg}/node_modules`)
    );
    symlink (
      path.join (__dirname, `${pkg}`),
      path.join (__dirname, `./node_modules/${pkg}`)
    );
  });

  yield* npm ('run', ['compile'], path.join (__dirname, 'electrum-theme'));
  yield* npm ('run', ['rebuild'], path.join (__dirname, 'electrum'));
  yield* npm ('run', ['rebuild'], path.join (__dirname, 'electrum-arc'));
  yield* npm ('run', ['compile'], path.join (__dirname, 'electrum-starter-3'));
}).then (() => {
  console.log ('done');
}, err => {
  console.error (err.stack);
});
