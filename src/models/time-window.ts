export default class TimeWindow {
    start: number;
    end: number;

    constructor(from: number, to: number) {
        if(from > to) {
            throw Error(`Invalid time window - Start ${from} is after end ${to}`)
        }

        this.start = from;
        this.end = to;
    }

    getDuration(): number {
        //i.e. 1 2 3 4 5 6 -> 1 [ 2 3 4 5 ] 6 -> 5 - 2 + 1 = 4
        return this.end - this.start + 1;
    }
}