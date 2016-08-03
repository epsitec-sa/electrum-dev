'use strict';

const path   = require ('path');
const co     = require ('co');
const spawn  = require ('co-child-process');


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

co (function * () {
  yield* npm ('run', ['compile'], path.join (__dirname, 'electrum-theme'));
  yield* npm ('run', ['rebuild'], path.join (__dirname, 'electrum'));
  yield* npm ('run', ['rebuild'], path.join (__dirname, 'electrum-arc'));
  yield* npm ('run', ['compile'], path.join (__dirname, 'electrum-starter-3'));
}).then (() => {
  console.log ('done');
}, err => {
  console.error (err.stack);
});
