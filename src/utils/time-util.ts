import TimeWindow from "../models/time-window";
export default class TimeUtil {
    static doesTimeWindowIncludeTimeWindow(includer: TimeWindow, includee: TimeWindow) {
        const lowerBoundOk = includer.start <= includee.start;
        const upperBoundOk = includer.end >= includer.end;

        return lowerBoundOk && upperBoundOk
    }

    static doTimeWindowsOverlap(first: TimeWindow, second: TimeWindow): boolean {
        return !(first.start > second.end || second.start > first.end)
    }

    static getOverlap(first: TimeWindow, second: TimeWindow): TimeWindow {
        if(!TimeUtil.doTimeWindowsOverlap(first, second)) {
            throw new Error('No Overlap')
        }

        const start = Math.max(first.start, second.start);
        const end = Math.min(first.end, second.end);
        return new TimeWindow(start, end);
    }
}
