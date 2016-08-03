'use strict';

const path  = require ('path');
const watt  = require ('watt');
const spawn = require ('child_process').spawn;


const npm = watt (function * (verb, modPath, cwd, next) {
  console.log (`npm ${verb} ${modPath}`);

  let args = [verb];
  if (Array.isArray (modPath)) {
    args = args.concat (modPath);
  } else {
    args.push (modPath);
  }
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const proc = spawn (npm, args, {
    stdio: ['ignore', 1, 2],
    cwd: cwd || __dirname
  });

  proc.on ('error', (data) => console.error (data.toString ()));
  proc.on ('exit', next.parallel ());

  yield next.sync ();
});

watt (function * () {
  yield npm ('run', ['compile'], path.join (__dirname, 'electrum-theme'));
  yield npm ('run', ['rebuild'], path.join (__dirname, 'electrum'));
  yield npm ('run', ['rebuild'], path.join (__dirname, 'electrum-arc'));
  yield npm ('run', ['compile'], path.join (__dirname, 'electrum-starter-3'));
}, (err) => {
  if (err) {
    console.error (err.stack || err);
  } else {
    console.log ('done');
  }
}) ();
