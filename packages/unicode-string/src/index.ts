import getUnicodeChars from './get-unicode-chars';

export class UnicodeString extends String {
    private chars : string[];

    constructor(text: string | String | UnicodeString) {
        super(text = text + '');
        this.chars = getUnicodeChars(UnicodeString.normalize(text));
    }
    get baseLength() : number {
        return super.length;
    }
    get baseString() : string {
        return super.valueOf();
    }
    get characters() : string[] {
        return [ ...(this.chars) ];
    }
    get length() : number {
        return this.chars.length;
    }

    at(position: number) : string | undefined {
        if (
            position == null ||
            !Number.isFinite(position = Number(position)) ||
            Math.abs(position) >= this.chars.length
        ) {
            return;
        }
        if (position < 0) {
            position = this.chars.length - position;
        }
        return this.chars[position];
    }
    charAt(position: number) : string {
        position = Number(position);
        if (Number.isInteger(position)) {
            position = 0;
        }
        return this.chars[position];
    }

    // charCodeAt() - ??
    // codePointAt() - ??

    concat(...args: Array<string | String | UnicodeString>) : string {
        return this.baseString.concat(...(args.map(value => '' + value)));
    }
    concatUS(...args: Array<string | String | UnicodeString>) : UnicodeString {
        return UnicodeString.from(this.baseString.concat(...(args.map((value : unknown) => value + ''))));
    }
    endsWith(searchTerm: string | UnicodeString, endPosition?: number) : boolean {
        let selfChars = this.characters;
        if (endPosition == null) {
            endPosition = selfChars.length
        }
        if (
            searchTerm == null ||
            !Number.isInteger(endPosition = Number(endPosition)) ||
            endPosition > selfChars.length
        ) {
            return false
        }
        selfChars = selfChars.slice(0, endPosition);

        let searchChars : string[];
        if (searchTerm instanceof UnicodeString) {
            searchChars = searchTerm.characters;
        } else {
            searchChars = UnicodeString.from('' + searchTerm).characters;
        }
        for (let idx = searchChars.length; idx > 0; idx -= 1) {
            if (selfChars[selfChars.length - idx] !== searchChars[searchChars.length - idx]) {
                return false;
            }
        }
        return true;
    }
    includes(searchTerm: string | UnicodeString, startPosition?: number) : boolean {
        return -1 < this.indexOf(searchTerm, startPosition);
    }
    indexOf(searchTerm: string | UnicodeString, startPosition?: number) : number {
        if (searchTerm == null) {
            return -1;
        }

        let matchChars : string[];
        if (searchTerm instanceof UnicodeString) {
            matchChars = searchTerm.characters;
        } else {
            matchChars = UnicodeString.from(searchTerm + '').characters;
        }
        const matchLen = matchChars.length;
        if (matchLen === 0) {
            return 0;
        }

        let idx = Number(startPosition);
        if (!Number.isInteger(idx) || idx < 0) {
            idx = 0;
        }
        const chars = this.chars;
        const len = chars.length, end = len - matchLen;

        if (idx >= end) {
            return -1;
        }
        while (idx < end) {
            let offset = 0;
            while (offset < matchLen) {
                if (chars[idx + offset] === matchChars[offset]) {
                    offset += 1;
                    if (offset === matchLen) {
                        return idx;
                    }
                } else {
                    idx += 1;
                    break;
                }
            }
        }
        return -1;
    }

    // lastIndexOf() - TODO
    // localeCompare() - TODO

    // match() - regex
    // matchAll() - regex

    normalize(form?: "NFC" | "NFD" | "NFKC" | "NFKD") : string {
        return this.toString().normalize(form);
    }
    normalizeUS(form?: "NFC" | "NFD" | "NFKC" | "NFKD") : UnicodeString {
        return UnicodeString.from(this.normalize(form));
    }
    padEnd(length: number, padding : string | UnicodeString = ' ') : string {
        length = Number(length);
        if (!Number.isInteger(length) || length <= this.chars.length) {
            return this.toString();
        }
        let padText : string;
        if (padding == null) {
            padText = ' '.repeat(length - this.chars.length);
        } else if (padding instanceof UnicodeString) {
            padText = padding.toString().repeat(Math.ceil(length / padding.length));
        } else {
            padding = UnicodeString.from(padding);
            padText = padding.toString().repeat(Math.ceil(length / padding.length));
        }
        return UnicodeString.from(this.toString() + padText).slice(0, length);
    }
    padEndUS(length: number, padding: string | UnicodeString = ' ') : UnicodeString {
        return UnicodeString.from(this.padEnd(length, padding));
    }
    padStartUS(length: number, padding: string | UnicodeString = ' ') : UnicodeString {
        length = Number(length);
        if (!Number.isInteger(length) || length <= this.chars.length) {
            return UnicodeString.from(this.toString());
        }
        let padText : string;
        if (padding == null) {
            padText = ' '.repeat(length - this.chars.length);
        } else if (padding instanceof UnicodeString) {
            padText = padding.toString().repeat(Math.ceil(length / padding.length));
        } else {
            padding = UnicodeString.from(padding);
            padText = padding.toString().repeat(Math.ceil(length / padding.length));
        }
        return UnicodeString.from(padText + this.toString()).sliceUS(length - this.chars.length)
    }
    repeat(count: number) : string {
        return this.valueOf().repeat(count);
    }
    repeatUS(count: number) : UnicodeString {
        return UnicodeString.from(this.repeat(count))
    }


    // replace() - regex
    // replaceAll() - regex
    // search() - regex

    slice(start: number, end?: number) : string {
        return this.chars.slice(start, end).join('');
    }
    sliceUS(start: number, end?: number) : UnicodeString {
        return UnicodeString.from(this.slice(start, end));
    }

    // split() - regex

    startsWith(searchTerm: string | UnicodeString, startPosition?: number) : boolean {
        if (searchTerm === '') {
            return true;
        }
        startPosition = Number(startPosition);
        if (searchTerm == null || Number.isFinite(startPosition) || this.characters.length <= startPosition) {
            return false;
        }
        let search : string[];
        if (searchTerm instanceof UnicodeString) {
            search = searchTerm.characters;
        } else {
            search = UnicodeString.from('' + searchTerm).characters;
        }
        const chars = this.characters.slice(startPosition);
        for (let idx = 0, end = search.length; idx < end; idx += 1) {
            if (chars[idx] !== search[idx]) {
                return false;
            }
        }
        return true;
    }
    substring(start: number, end?: number) : string {
        start = Number(start);
        if (!Number.isFinite(start) || start < 0) {
            start = 0;
        }
        end = Number(end);
        if (!Number.isFinite(end) || end < 0) {
            end = 0;
        }
        return this.slice(start, end);
    }
    substringUS(start: number, end?: number) : UnicodeString {
        return UnicodeString.from(this.substring(start, end));
    }
    toJSON() {
        return this.valueOf();
    }

    // toLocaleLowerCase() - TODO
    // toLocaleUpperCase() - TODO

    toLowerCase() : string {
        return this.valueOf().toLowerCase();
    }
    toLowerCaseUS() : UnicodeString {
        return UnicodeString.from(this.toLowerCase());
    }
    toString() {
        return this.valueOf();
    }
    toUpperCase() : string {
        return this.valueOf().toUpperCase();
    }
    toUpperCaseUS() : UnicodeString {
        return UnicodeString.from(this.toUpperCase());
    }
    trim() : string {
        return this.valueOf().trim();
    }
    trimUS() : UnicodeString {
        return UnicodeString.from(this.trim())
    }
    trimEnd() : string {
        return this.valueOf().trimEnd();
    }
    trimEndUS() : UnicodeString {
        return UnicodeString.from(this.valueOf().trimEnd());
    }
    trimStart() : string {
        return this.valueOf().trimStart();
    }
    trimStartUS() : UnicodeString {
        return UnicodeString.from(this.valueOf().trimStart());
    }
    valueOf() {
        return this.chars.join('');
    }

    static from(subject: unknown) : UnicodeString {
        if (typeof subject === 'function') {
            throw new Error('invalid input')
        } else if (subject == null) {
            subject = '';
        } else if (typeof subject !== 'string') {
            subject = '' + subject;
        }
        return new Proxy(new UnicodeString(<string>subject), {
            get(target, property, reciever) {

                // index handling
                if (typeof property === 'number' || Number.isFinite(Number(property))) {
                    return target.chars[<number>(<unknown>property)];
                }

                return Reflect.get(target, property, reciever);
            },
            getOwnPropertyDescriptor(target, key) : PropertyDescriptor | undefined {
                if (Number.isInteger(Number(key))) {
                    const value = Number(key);
                    return { enumerable: true, configurable: false, writable: false, value: target.chars[value] }
                }
            },
            ownKeys(target) : string[] {
                const res : string[] = [];
                for (let i = 0, len = target.length; i < len; i += 1) {
                    res.push(i + '');
                }
                return res;
            }
        });
    }
    static normalize(subject: string | String | UnicodeString) : string {
        return ('' + subject).normalize("NFC");
    }
}

export default UnicodeString.from;