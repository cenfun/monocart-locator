class CommentParser {

    // eslint-disable-next-line complexity
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

            // string singleQuote doubleQuote backQuote
            if (currentCharacter === "'" || currentCharacter === '"' || currentCharacter === '`') {
                quote = currentCharacter;
                isComment = false;
                tokenClose = quoteClose;
                continue;
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
