# monocart-locator
> Locator between the position and row/column location of the source code.

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