class LineCommentToken {
    constructor() {
        this.isComment = true;
        this.offset = 0;
        this.start = 0;
        this.end = 0;
    }

    getLocation(source) {
        return {
            block: false,
            start: this.start,
            end: this.end,
            text: source.slice(this.start, this.end)
        };
    }

    isOpen(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '//') {
            this.start = i;
            this.offset = 1;
            // console.log('open', '//');
            return true;
        }
        return false;
    }

    isClose(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '\r\n') {
            this.end = i;
            this.offset = 1;
            // console.log('close', 'rn');
            return true;
        }
        if (currentCharacter === '\n') {
            this.end = i;
            // console.log('close', 'n');
            return true;
        }
        return false;
    }
}

module.exports = LineCommentToken;
