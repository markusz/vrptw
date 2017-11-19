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

    getStart(): number {
        return this.time.start;
    }

    getEnd(): number {
        return this.time.end;
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

    toShortString(): string {
        if (this.type === JobType.Customer) {
            return `C${this.node.id}`;
        }

        if (this.type === JobType.Wait) {
            return 'W';
        }

        if (this.type === JobType.Depot) {
            return  'D';
        }

        if (this.type === JobType.Travel) {
            return 'T';
        }

        return '?';
    }

    toString() {
        var typeString;

        if (this.type === JobType.Customer) {
            typeString = `C${this.node.id}`;
        }

        if (this.type === JobType.Wait) {
            typeString = 'W';
        }

        if (this.type === JobType.Depot) {
            typeString = 'D';
        }

        if (this.type === JobType.Travel) {
            typeString = 'T';
        }

        return `${typeString}[${this.getStart()},${this.getEnd()}]`
    }
}
