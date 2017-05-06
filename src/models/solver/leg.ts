export default class Leg {
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    toArray() {
        return [this.start, this.end];
    }

    jobsBetweenStartAndEnd() {
        return this.end - this.start - 1;
    }

    isValid() {
        return this.start !== undefined && this.end !== undefined && this.start < this.end;
    }
}