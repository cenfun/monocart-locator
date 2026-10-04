const fs = require('fs');
const path = require('path');
const assert = require('assert');
const EC = require('eight-colors');
const CG = require('console-grid');

const { Locator, CommentParser } = require('../lib/');

// test comments
const files = [{
    path: path.resolve(__dirname, 'cases/comments.js'),
    commentsCount: 16,
    commentLinesCount: 21,
    grid: true
}, {
    path: path.resolve(__dirname, 'cases/template.js'),
    commentsCount: 12,
    commentLinesCount: 10,
    grid: true
}, {
    path: path.resolve(__dirname, 'cases/comments.css'),
    commentsCount: 2,
    commentLinesCount: 5,
    grid: true
}, {
    path: path.resolve('package.json'),
    commentsCount: 0,
    commentLinesCount: 0
}, {
    path: path.resolve('eslint.config.js'),
    commentsCount: 2,
    commentLinesCount: 2
}];


it('test comments', () => {
    files.forEach((item) => {
        item.name = path.basename(item.path);

        const source = fs.readFileSync(item.path).toString('utf-8');

        const locator = new Locator(source);

        const lineParser = locator.lineParser;

        // add line for comments
        lineParser.comments.forEach((comment) => {
            comment.line = lineParser.findLine(comment.start).line;
        });

        const commentLines = lineParser.lines.filter((l) => l.comment).map((c) => `${EC.yellow(c.line + 1)} ${EC.green(c.text)}`);
        console.log('===========================================');
        EC.logCyan(item.name);
        // console.log(commentLines.join('\n'));

        if (item.grid) {
            CG({
                columns: [{
                    id: 'indent',
                    formatter: (v) => {
                        if (!v) {
                            return '';
                        }
                        return v;
                    }
                }, {
                    id: 'text',
                    name: path.basename(item.path),
                    formatter: (v, row) => {
                        if (!v) {
                            return '';
                        }

                        if (row.comment) {
                            return EC.blue(v);
                        }

                        return v;
                    }
                }, {
                    id: 'blank',
                    formatter: (v) => {
                        if (!v) {
                            return '';
                        }
                        return v;
                    }
                }, {
                    id: 'comment',
                    formatter: (v) => {
                        if (!v) {
                            return '';
                        }
                        return v;
                    }
                }, {
                    id: 'length'
                }],
                rows: lineParser.lines
            });
        }

        assert.equal(lineParser.comments.length, item.commentsCount, `comments count not matched: ${item.path}`);
        assert.equal(commentLines.length, item.commentLinesCount, `comment lines count not matched: ${item.path}`);

        if (item.name === 'comments.js') {
            for (const text of ['[//]', 'sourceMappingURL=ghost.js.map', 'https?:\\/\\/example']) {
                const start = source.indexOf(text);
                assert.notEqual(start, -1);
                assert.equal(lineParser.commentParser.isComment(start, start + text.length), false, `${text} is not a comment`);
            }
            assert.equal(lineParser.comments.some((comment) => comment.text.includes('ghost.js.map')), false);
            assert.equal(lineParser.comments.some((comment) => comment.text === '// division is not a regular expression'), true);
        }

    });
});

it('distinguishes regular expressions from division and comments', () => {
    const dollar = '$';
    const source = [
        'const a = /[//]/g; // real comment',
        'const spaced = / foo/; // space after slash is still regexp',
        'const b = /[/# sourceMappingURL=ghost.js.map/]/;',
        'const c = /\\/\\/\\*x/; /* block comment */',
        'const d = 12 / 3 / 2; // division comment',
        'function match(value) { return /[//]/.test(value); }',
        'if (true) /[//]/.test("//");',
        `const t = \`${dollar}{/[//]/.test("//")}\`;`,
        `const u = \`${dollar}{/[//]/ / 2 // in template\n}\`;`
    ].join('\n');
    const parser = new CommentParser(source);
    assert.deepEqual(parser.comments.map((comment) => comment.text), [
        '// real comment',
        '// space after slash is still regexp',
        '/* block comment */',
        '// division comment',
        '// in template'
    ]);
});

it('only protects comment markers inside regexp character classes', () => {
    const source = [
        'const a = /[//]/; // line comment',
        'const b = /[/*]/; /* block comment */',
        `const longer = /${'x'.repeat(26)}[//]/; // within scan limit`,
        'if (ok) /[//]/.exec("x"); // no prefix needed',
        'const c = /\\//; // escaped slash is not a comment',
        'const numbers = [// real line comment',
        '    1, /* real block comment */ 2];',
        'const half = a / b / .5; // division'
    ].join('\n');
    assert.deepEqual(new CommentParser(source).comments.map((comment) => comment.text), [
        '// line comment',
        '/* block comment */',
        '// within scan limit',
        '// no prefix needed',
        '// escaped slash is not a comment',
        '// real line comment',
        '/* real block comment */',
        '// division'
    ]);
});

it('ignores comment markers after quotes inside a regexp character class', () => {
    const source = 'const r = /["\'][//]/; // real comment';
    const parser = new CommentParser(source);
    const marker = source.indexOf('//');
    assert.equal(parser.isComment(marker, marker + 2), false);
    assert.deepEqual(parser.comments.map((comment) => comment.text), ['// real comment']);
});

it('preserves comment boundaries for CRLF, block and EOF comments', () => {
    const source = 'x(); // CRLF\r\n/* block */x(); // EOF';
    const comments = new CommentParser(source).comments;
    assert.deepEqual(comments.map((comment) => [comment.block, comment.start, comment.end, comment.text]), [
        [false, 5, 12, '// CRLF'],
        [true, 14, 25, '/* block */'],
        [false, 30, source.length, '// EOF']
    ]);
    assert.equal(new CommentParser('/* unclosed').comments[0].text, '/* unclosed');
});

it('bounds lookahead for unterminated regexp classes', () => {
    const source = `${'/['.repeat(60000)}\n// next line\r\nconst r = /[//]/; // after regexp`;
    const parser = new CommentParser(source);
    assert.deepEqual(parser.comments.map((comment) => comment.text), [
        '// next line',
        '// after regexp'
    ]);

    const escapedNewline = ['/\\', '// after escaped newline'].join('\n');
    assert.deepEqual(new CommentParser(escapedNewline).comments.map((comment) => comment.text), [
        '// after escaped newline'
    ]);
});
