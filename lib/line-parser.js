import CommentParser from './comment-parser.js';

class LineParser {
    constructor(content = '') {
        let pos = 0;

        // force to string
        if (typeof content !== 'string') {
            content = `${content}`;
        }

        const commentParser = new CommentParser(content);
        this.commentParser = commentParser;
        this.comments = commentParser.comments;

        // ECMAScript line terminators: CRLF counts as one line break.
        const rLineTerminator = /\r\n|[\r\n\u2028\u2029]/g;
        const rNonSpace = /\S/;
        const lines = [];
        let commentIndex = 0;

        // Lines and comment ranges are visited in source order.
        const isCommentLine = (start, end) => {
            let offset = start;
            while (commentIndex < this.comments.length) {
                const range = this.comments[commentIndex];
                if (range.end <= offset) {
                    commentIndex += 1;
                    continue;
                }

                // start is already non-whitespace; later gaps must contain only whitespace.
                const gapEnd = Math.min(range.start, end);
                if (gapEnd > offset && (offset === start || rNonSpace.test(content.slice(offset, gapEnd)))) {
                    return false;
                }
                if (range.end >= end) {
                    return true;
                }

                offset = range.end;
                commentIndex += 1;
            }
            return offset !== start && !rNonSpace.test(content.slice(offset, end));
        };

        const addLine = (start, end) => {
            const text = content.slice(start, end);
            const length = text.length;
            const line = lines.length;

            // =============================

            const firstNonSpace = text.search(rNonSpace);
            const blank = firstNonSpace === -1;

            // =============================
            let comment = false;
            let indent = length;
            if (!blank) {
                indent = firstNonSpace;
                comment = isCommentLine(start + indent, end);
            }

            // =============================

            lines.push({
                line,

                length,
                indent,

                start,
                end,

                blank,
                comment,

                text
            });
        };

        let match;
        while ((match = rLineTerminator.exec(content)) !== null) {
            addLine(pos, match.index);
            pos = rLineTerminator.lastIndex;
        }
        addLine(pos, content.length);
        this.lines = lines;
    }

    findLine(position) {
        const list = this.lines;
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

export default LineParser;
