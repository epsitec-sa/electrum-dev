'use strict';

const co    = require ('co');
const spawn = require ('co-child-process');


function * git () {
  const args = Array.prototype.slice.call (arguments);
  console.log (`git ${args.join (' ')}`);

  yield spawn ('git', args, {
    stdio: ['ignore', 1, 2],
    cwd: __dirname
  });
}

co (function * () {
  yield* git ('submodule', 'update',  '--init',      '--recursive');
  yield* git ('submodule', 'foreach', '--recursive', 'git checkout master');
  yield* git ('submodule', 'foreach', '--recursive', 'git pull');
}).then (() => {
  console.log ('done');
}, err => {
  console.error (err.stack);
});
