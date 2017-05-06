import Node from "./node";
import TimeWindow from "./time-window";

export enum JobType {Wait, Travel, Customer, Depot}
export default class Job {
    node: Node;
    type: JobType;
    time: TimeWindow;

    constructor(node: Node, type: JobType, time: TimeWindow) {
        this.node = node;
        this.type = type;
        this.time = time;
    }

    getDuration(): number {
        //i.e. 1 2 3 4 5 6 -> 1 [ 2 3 4 5 ] 6 -> 5 - 2 + 1 = 4
        return this.time.getDuration()
    }

    isCustomerOrDepotJob(): boolean {
        return this.type === JobType.Customer || this.type === JobType.Depot;
    }

    isDepotJob(): boolean {
        return this.type === JobType.Depot;
    }

    isTravelJob(): boolean {
        return this.type === JobType.Travel;
    }

    isCustomerJob(): boolean {
        return this.type === JobType.Customer;
    }

    isWaitingJob(): boolean {
        return this.type === JobType.Wait;
    }

    isTravelOrWaitingJob(): boolean {
        return this.type === JobType.Travel || this.type === JobType.Wait;
    }
}
