export type CommentItem = {
    block: boolean;
    start: number;
    end: number;
    text: string;
}

export class CommentParser {
    constructor(source: string);
    comments: CommentItem[];
    isComment(start: number, end: number): boolean;
}


export type LineItem = {
    /** 0-base */
    line: number;

    length: number;
    indent: number;

    start: number;
    end: number;

    blank?: boolean;
    comment?: boolean;

    text: string;
}

export class LineParser {
    constructor(source: string);
    lines: LineItem[];
    comments: CommentItem[];
    findLine(pos: number): LineItem;
}


export type LocationItem = LineItem & {
    /** 1-base */
    line: number;
    column: number;
}

export class Locator {
    constructor(source: string);
    source: string;
    lineParser: LineParser;
    lines: LineItem[];
    comments: CommentItem[];

    /** 1-base */
    locationToOffset(loc: LocationItem): number;
    offsetToLocation(offset: number): LocationItem;

    getSlice(start: number, end?: number): string;

    /** 1-base to 0-base */
    getLine(line: number): LineItem;

}