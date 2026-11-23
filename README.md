# Monocart Locator
[![](https://img.shields.io/npm/v/monocart-locator)](https://www.npmjs.com/package/monocart-locator)
[![](https://badgen.net/npm/dw/monocart-locator)](https://www.npmjs.com/package/monocart-locator)
![](https://img.shields.io/github/license/cenfun/monocart-locator)

> A lightweight source code position locator for converting between offset and line/column, with built-in line and comment parsing. Zero dependencies.

## Features
- Convert between offset and line/column positions
- Parse source code into lines with metadata (length, indent, blank, comment)
- Detect line comments (`//`) and block comments (`/* */`) with template literal (`${}`) support
- O(log n) position lookups via binary search

## Install
```sh
npm i monocart-locator
```

## Usage

### Upgrading from v1

Starting in v2, the package is ESM-only. Use `import` in ES modules or `await import('monocart-locator')` from an async function in CommonJS. If you still need synchronous `require()`, stay on v1 (`npm install monocart-locator@1`).

### Locator
The main API for source code position conversion.
```js
import { Locator } from 'monocart-locator';

const locator = new Locator(source);

// Convert 1-based line/column to offset
const offset = locator.locationToOffset({ line: 2, column: 5 });

// Convert offset to 1-based location
const loc = locator.offsetToLocation(100);
// { line, column, length, indent, start, end, blank, comment, text }

// Get source substring
const slice = locator.getSlice(0, 10);

// Get line info by 1-based line number
const lineInfo = locator.getLine(1);

// Access all parsed lines and comments
console.log(locator.lines);     // LineItem[]
console.log(locator.comments);  // CommentItem[]
```

### LineParser
Parse source code into lines with metadata.
```js
import { LineParser } from 'monocart-locator';

const lineParser = new LineParser(source);

console.log(lineParser.lines);     // LineItem[]
console.log(lineParser.comments);  // CommentItem[]

// Find line by offset
const lineInfo = lineParser.findLine(100);
```

### CommentParser
Detect line and block comments in source code with a lightweight scanner (not a full JavaScript parser). Single-line regexp character classes such as `/[//]/` and `/[/*]/` are protected when both `[` and the `//` or `/*` marker occur within 31 characters of the opening slash. After the marker, `]` and the closing slash may be anywhere on the same line. Markers outside the initial 31-character window and uncommon syntax such as division by an array containing a comment can still be misclassified.
```js
import { CommentParser } from 'monocart-locator';

const commentParser = new CommentParser(source);

console.log(commentParser.comments);  // CommentItem[]

// Check if a range is inside a comment
const isComment = commentParser.isComment(start, end);
```

## API

### `Locator`
| Property / Method | Description |
|---|---|
| `source` | Original source string |
| `lines` | `LineItem[]` - all parsed lines |
| `comments` | `CommentItem[]` - all parsed comments |
| `locationToOffset({ line, column })` | Convert 1-based line and column to offset |
| `offsetToLocation(offset)` | Convert offset to `LocationItem` (1-based line and column) |
| `getSlice(start, end)` | Get source substring by offsets |
| `getLine(line)` | Get `LineItem` by 1-based line number |

### `LineItem`
| Property | Type | Description |
|---|---|---|
| `line` | `number` | 0-based line number |
| `length` | `number` | Line length (excluding newline) |
| `indent` | `number` | Leading whitespace count |
| `start` | `number` | Start offset in source |
| `end` | `number` | End offset in source |
| `blank` | `boolean` | Whether line has no non-whitespace content |
| `comment` | `boolean` | Whether the line is nonblank and all non-whitespace characters are inside comments |
| `text` | `string` | Line text (excluding newline) |

### `LocationItem`
Returned by `offsetToLocation()`. Extends `LineItem` with 1-based position:
| Property | Type | Description |
|---|---|---|
| `line` | `number` | 1-based line number |
| `column` | `number` | 0-based column offset |

### `CommentItem`
| Property | Type | Description |
|---|---|---|
| `block` | `boolean` | `true` for block comments (`/* */`), `false` for line comments (`//`) |
| `start` | `number` | Start offset in source |
| `end` | `number` | End offset in source |
| `text` | `string` | Comment text including delimiters |

## Tests

Run `npm test` with Node.js 22.15.0 or later. The HTML coverage report is written to `.temp/coverage/index.html`.

## License
MIT