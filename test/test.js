const fs = require('fs');
const path = require('path');
const assert = require('assert');
const EC = require('eight-colors');
const CG = require('console-grid');

const { Locator } = require('../lib/');

// test comments
const files = [{
    path: path.resolve(__dirname, 'cases/comments.js'),
    commentsCount: 15,
    commentLinesCount: 21,
    grid: true
}, {
    path: path.resolve(__dirname, 'cases/comments.css'),
    commentsCount: 2,
    commentLinesCount: 5,
    grid: true
}, {
    path: path.resolve(__dirname, '../lib/tokens/block-comment-token.js'),
    commentsCount: 2,
    commentLinesCount: 2
}, {
    path: path.resolve(__dirname, '../lib/tokens/line-comment-token.js'),
    commentsCount: 3,
    commentLinesCount: 3
}, {
    path: path.resolve(__dirname, '../lib/tokens/quote-token.js'),
    commentsCount: 2,
    commentLinesCount: 2
}, {
    path: path.resolve('package.json'),
    commentsCount: 0,
    commentLinesCount: 0
}, {
    path: path.resolve('.eslintrc.js'),
    commentsCount: 3,
    commentLinesCount: 3
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


    });
});
