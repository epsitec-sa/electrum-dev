'use strict';

const watt  = require ('watt');
const spawn = require ('child_process').spawn;


const git = watt (function * (next) {
  const args = Array.prototype.slice.call (arguments).slice (1);
  console.log (`git ${args.join (' ')}`);

  const proc = spawn ('git', args, {
    stdio: ['ignore', 1, 2],
    cwd: __dirname
  });

  proc.on ('error', (data) => console.error (data.toString ()));
  proc.on ('exit', next.parallel ());

  yield next.sync ();
}, {prepend: true});

watt (function * () {
  yield git ('submodule', 'update',  '--init',      '--recursive');
  yield git ('submodule', 'foreach', '--recursive', 'git checkout master');
  yield git ('submodule', 'foreach', '--recursive', 'git pull');
}, (err) => {
  if (err) {
    console.error (err.stack || err);
  } else {
    console.log ('done');
  }
}) ();
