// Trade-off: keep the original scanner and only probe short, single-line regexp
// character classes containing // or /*, rather than parsing JavaScript syntax.
// Known limitations:
// - Division by an array containing a real comment (e.g. value / [/* real */ 1]
//   / 2) can be mistaken for a regexp, hiding that comment.
// - A regexp whose closing slash is more than 31 characters from its opening
//   slash is not protected, so markers in its character class may look like comments.
// - Regexps containing quotes but no comment markers are not protected; quotes
//   may confuse the original string scanner. This predates this change.
// eslint-disable-next-line complexity
const findRegExpEnd = (source, start) => {
    let inClass = false;
    let hasCommentMarker = false;
    const end = Math.min(source.length, start + 32);
    for (let i = start + 1; i < end; i++) {
        const char = source[i];
        if (char === '\n' || char === '\r' || char === '\u2028' || char === '\u2029') {
            break;
        }
        if (char === '\\') {
            i += 1;
        } else if (char === '[') {
            inClass = true;
        } else if (char === ']') {
            inClass = false;
        } else if (char === '/') {
            if (!inClass) {
                return hasCommentMarker ? i : -1;
            }
            if (source[i + 1] === '/' || source[i + 1] === '*') {
                hasCommentMarker = true;
            }
        }
    }
    return -1;
};

const isEscaped = (source, index) => {
    let count = 0;
    while (source[index - count - 1] === '\\') {
        count += 1;
    }
    return count % 2 === 1;
};

class CommentParser {

    // eslint-disable-next-line complexity, max-statements
    constructor(source) {

        const comments = [];

        let tokenClose = null;

        let isComment = false;
        let block = false;
        let start = 0;

        let closeOffset = 0;
        let commentOffset = 0;

        let quote;
        const quoteClose = (currentCharacter) => {
            if (currentCharacter === '\\') {
                closeOffset = 1;
                return false;
            }
            closeOffset = 0;
            return currentCharacter === quote;
        };

        // template literal expression tracking
        const templateStack = [];
        const templateClose = (currentCharacter, nextCharacter) => {
            if (currentCharacter === '\\') {
                closeOffset = 1;
                return false;
            }
            closeOffset = 0;
            if (currentCharacter === '$' && nextCharacter === '{') {
                closeOffset = 1;
                templateStack.push(1);
                return true;
            }
            return currentCharacter === '`';
        };

        const lineClose = (currentCharacter, nextCharacter) => {
            if (currentCharacter === '\r' && nextCharacter === '\n') {
                closeOffset = 1;
                return true;
            }
            closeOffset = 0;
            return currentCharacter === '\n';
        };

        const blockClose = (currentCharacter, nextCharacter) => {
            if (currentCharacter === '*' && nextCharacter === '/') {
                closeOffset = 1;
                commentOffset = 2;
                return true;
            }
            closeOffset = 0;
            return false;
        };

        const len = source.length;
        for (let i = 0; i < len; i++) {
            const currentCharacter = source[i];
            const nextCharacter = source[i + 1];

            if (tokenClose !== null) {
                if (tokenClose(currentCharacter, nextCharacter)) {
                    if (isComment) {
                        comments.push({
                            block,
                            start,
                            end: i + commentOffset
                        });
                    }
                    tokenClose = null;
                }
                i += closeOffset;
                continue;
            }

            // track braces in template expressions
            if (templateStack.length > 0 && currentCharacter === '{') {
                templateStack[templateStack.length - 1] += 1;
            } else if (templateStack.length > 0 && currentCharacter === '}') {
                if (--templateStack[templateStack.length - 1] === 0) {
                    templateStack.pop();
                    isComment = false;
                    tokenClose = templateClose;
                    continue;
                }
            }

            // string singleQuote doubleQuote backQuote
            if (currentCharacter === "'" || currentCharacter === '"' || currentCharacter === '`') {
                quote = currentCharacter;
                isComment = false;
                tokenClose = currentCharacter === '`' ? templateClose : quoteClose;
                continue;
            }

            if (currentCharacter === '/' && isEscaped(source, i)) {
                continue;
            }

            // A regexp without a comment marker needs no special handling.
            if (currentCharacter === '/' && nextCharacter !== '/' && nextCharacter !== '*') {
                const regExpEnd = findRegExpEnd(source, i);
                if (regExpEnd !== -1) {
                    i = regExpEnd;
                    continue;
                }
            }

            // line comments
            if (currentCharacter === '/' && nextCharacter === '/') {
                block = false;
                isComment = true;
                commentOffset = 0;
                start = i;
                tokenClose = lineClose;
                i += 1;
                continue;
            }

            // block comments
            if (currentCharacter === '/' && nextCharacter === '*') {
                block = true;
                isComment = true;
                commentOffset = 0;
                start = i;
                tokenClose = blockClose;
                i += 1;
            }

        }

        if (tokenClose && isComment) {
            comments.push({
                block,
                start,
                end: len
            });
        }

        // add comment text
        comments.forEach((it) => {
            it.text = source.slice(it.start, it.end);
        });

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
            const i = (start + end) >> 1;
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
