import TimeWindow from "./time-window";
export default class Node {
    id: number;
    xCoordinate: number;
    yCoordinate: number;
    availableTimeWindows: Array<TimeWindow>;

    constructor(nodeData: any) {
        this.id = nodeData.id;
        this.xCoordinate = nodeData.coordinates.x;
        this.yCoordinate = nodeData.coordinates.y;
        this.availableTimeWindows = [new TimeWindow(nodeData.ready_time, nodeData.due_time)];
    }

    index(): number {
        return this.id;
    }
}
