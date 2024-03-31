class BlockCommentToken {
    constructor() {
        this.isComment = true;
        this.offset = 0;
        this.start = 0;
        this.end = 0;
    }

    getLocation(source) {
        return {
            block: true,
            start: this.start,
            end: this.end,
            text: source.slice(this.start, this.end)
        };
    }

    isOpen(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '/*') {
            this.start = i;
            this.offset = 1;
            // console.log('open', '/*');
            return true;
        }
        return false;
    }

    isClose(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter + nextCharacter === '*/') {
            this.end = i + 2;
            this.offset = 1;
            // console.log('close', '*/');
            return true;
        }
        return false;
    }
}

module.exports = BlockCommentToken;
