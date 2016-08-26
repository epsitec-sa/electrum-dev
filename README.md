# Electrum development module

Module to develop Electrum and its components.

## Installation

```
npm install
```

All modules are installed in the `node_modules` directory of `electrum-dev`.
All other `node_modules` directories are symlinks on this directory. Note
that `electrum` and `electrum-arc` are symlinks in the `node_modules`
directory.

## Starting

```
npm start
```

It starts the watchers on `electrum` and `electrum-arc` in order to compile
the `src/` directory in `/lib` every time that a file is changed in `src/`.

And it starts the webpack hot reload for `electrum-starter-3`: whenever a
`lib/` directory is changing in `electrum` or `electrum-arc`, the hot
reload is triggered.

## Hack

Changes in `electrum/src`, `electrum-arc/src` or `electrum-starter-3/src`
trigger a full hot reload.

## Add a submodule

To add a dependency as a submodule:

* Import module with `git submodule add https://github.com/url-to-git-repository.git`
* Edit `.scrc` and add the relative module path to the list of `modules`;
  dependencies should be listed before their consumers (e.g. `electrum` is
  needed by `electrum-arc`, so place `electrum` before `electrum-arc` in
  the list).
* Edit `start.js` to include the module.
* Edit _aliasing_ in `electrum-starter-3` file `webpack.config.js`, by
  adding an entry to the `resolve`.`alias` section, so that the module
  will be picked up properly by Webpack.
