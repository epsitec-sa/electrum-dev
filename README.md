# Electrum development module

Module to develop Electrum and its components.

## Installation

```
npm install
```

All modules are installed in the `node_modules` directory of `electrum-dev`. All other
`node_modules` directories are symlinks on this directory. Note that `electrum` and
`electrum-arc` are symlinks in the `node_modules` directory.

## Starting

```
npm start
```

It starts the watchers on `electrum` and `electrum-arc` in order to compile the `src/`
directory in `/lib` every time that a file is changed in `src/`.

And it starts the webpack hot reload for `electrum-starter-3`. When a `lib/` directory
is changing in `electrum` or `electrum-arc`, the hot reload is triggered.

## Hack

Change something in `electrum/src`, `electrum-arc/src` or `electrum-starter-3/src`;
everything should be hot reloaded.
