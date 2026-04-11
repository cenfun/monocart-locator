/* eslint-disable */
// template expression with line comment
const a = `${
    // comment in expression
    value
}`;

// template expression with block comment
const b = `${/* block */ value}`;

// nested template literal
const c = `${`nested`}`;

// backtick in expression string
const d = `${'`'}`;

// object braces in expression
const e = `${ {key: 1} }`;

// arrow function braces in expression
const f = `${[1].map(v => { return v; })}`;

// escaped dollar-brace is not expression
const g = `\${not expr}`;

// comment after template
const h = `end`; // final
