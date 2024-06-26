# Monocart Locator
[![](https://img.shields.io/npm/v/monocart-locator)](https://www.npmjs.com/package/monocart-locator)
[![](https://badgen.net/npm/dw/monocart-locator)](https://www.npmjs.com/package/monocart-locator)
![](https://img.shields.io/github/license/cenfun/monocart-locator)

> A Locator for the source code position between offset and line/column.

## Features
- Position locator
- Line parser
- Comment parser

## Install
```sh
npm i monocart-locator
```

## Usage
```js
const locator = new Locator(source);
console.log(locator.lines);
console.log(locator.comments);

const offset = locator.locationToOffset({ line: 1, column: 1 });
const loc = locator.offsetToLocation(10);
```