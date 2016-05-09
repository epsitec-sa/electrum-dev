'use strict';

const path  = require ('path');
const spawn = require ('child_process').spawn;

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

[
  'electrum',
  'electrum-arc',
  'electrum-theme'
].forEach (mod => {
  spawn (npm, [
    'run', 'watch'
  ], {
    stdio: ['ignore', 1, 2],
    cwd: path.join (__dirname, mod)
  });
});

spawn (npm, ['start'], {
  stdio: ['ignore', 1, 2],
  cwd: path.join (__dirname, 'electrum-starter-3')
});
