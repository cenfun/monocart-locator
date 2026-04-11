# Changelog

## 1.0.3

- Fixed template literal expression (`${}`) handling in `CommentParser` - backticks, nested templates, and comments inside expressions are now parsed correctly
- Improved `LineParser` performance by hoisting regex out of per-line loop
- Optimized binary search in `findLine` and `findComment` with bit shift
- Fixed `LocationItem` TypeScript definition to use `Omit<LineItem, 'line'>` avoiding conflicting `line` property semantics
- Fixed ESM wrapper (`index.mjs`) to use explicit named exports instead of fragile `export *` from CJS
- Added template literal test cases
- Improved README with full API reference and usage examples
- Updated dependencies

## 1.0.2

- Refactored `CommentParser` for improved performance

## 1.0.1

- Improved performance for comment and line parsing
- Fixed unit test

## 1.0.0

- Initial release
