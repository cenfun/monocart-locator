const QuoteToken = require('./tokens/quote-token.js');
const LineCommentToken = require('./tokens/line-comment-token.js');
const BlockCommentToken = require('./tokens/block-comment-token.js');

const singleQuote = "'";
const doubleQuote = '"';
const backQuote = '`';
const tokens = [
    new QuoteToken(singleQuote),
    new QuoteToken(doubleQuote),
    new QuoteToken(backQuote),
    new LineCommentToken(),
    new BlockCommentToken()
];

const getToken = (i, currentCharacter, nextCharacter) => {
    for (const item of tokens) {
        if (item.isOpen(i, currentCharacter, nextCharacter)) {
            return item;
        }
    }
};

class CommentParser {

    constructor(source) {

        const len = source.length;
        const comments = [];
        let currentToken;

        for (let i = 0; i < len; i++) {
            const currentCharacter = source[i];
            const nextCharacter = source[i + 1];

            if (currentToken) {
                if (currentToken.isClose(i, currentCharacter, nextCharacter)) {
                    if (currentToken.isComment) {
                        const comment = currentToken.getLocation(source);
                        // console.log(comment.text);
                        comments.push(comment);
                    }
                    //  else {
                    //     console.log(currentToken.getLocation(source).text);
                    // }
                    i += currentToken.offset;
                    currentToken = null;
                } else {
                    i += currentToken.offset;
                }
                continue;
            }

            currentToken = getToken(i, currentCharacter, nextCharacter);
            if (currentToken) {
                i += currentToken.offset;
            }

        }

        if (currentToken) {
            if (currentToken.isComment) {
                currentToken.end = len;
                comments.push(currentToken.getLocation(source));
            }
        }

        this.comments = comments;

    }

    isComment(start, end) {
        if (!this.comments.length) {
            return false;
        }
        const comment = this.findComment(start);
        if (start >= comment.start && end <= comment.end) {
            return true;
        }
        return false;
    }

    findComment(position) {
        const list = this.comments;
        let start = 0;
        let end = list.length - 1;
        while (end - start > 1) {
            const i = Math.floor((start + end) * 0.5);
            const item = list[i];
            if (position < item.start) {
                end = i;
                continue;
            }
            if (position > item.end) {
                start = i;
                continue;
            }
            return list[i];
        }
        // last two items, less is start
        const endItem = list[end];
        if (position < endItem.start) {
            return list[start];
        }
        return list[end];

    }


}

module.exports = CommentParser;
