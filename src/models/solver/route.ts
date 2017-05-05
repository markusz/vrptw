import Vehicle from "../vehicle";
import Job, {JobType} from "../job";
import Node from "../node";
export default class Route {
    jobs: Array<Job>;
    vehicle: Vehicle;

    constructor(vehicle: Vehicle, node: Node, start: number = 0, end: number) {
        this.vehicle = vehicle;
        const startInDepot: Job = new Job(node, JobType.Depot, start, start);
        const idleInDepot: Job = new Job(node, JobType.Wait, start + 1, end - 1);
        const endInDepot: Job = new Job(node, JobType.Depot, end, end);
        this.jobs = [startInDepot, idleInDepot, endInDepot]
    }
}