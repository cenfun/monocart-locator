class QuoteToken {
    constructor(quote) {
        this.quote = quote;
        this.offset = 0;
        this.start = 0;
        this.end = 0;
    }

    getLocation(source) {
        return {
            start: this.start,
            end: this.end,
            text: source.slice(this.start, this.end)
        };
    }

    isOpen(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter === this.quote) {
            // console.log('open', this.quote);
            this.start = i;
            return true;
        }
        return false;
    }

    isClose(i, currentCharacter, nextCharacter) {
        this.offset = 0;
        if (currentCharacter === '\\') {
            this.offset = 1;
            return false;
        }
        if (currentCharacter === this.quote) {
            // console.log('close', this.quote);
            this.end = i + 1;
            return true;
        }
        return false;
    }
}

module.exports = QuoteToken;
