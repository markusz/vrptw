import Vehicle from "../vehicle";
import Job, {JobType} from "../job";
import Node from "../node";
import TimeWindow from "../time-window";
import Depot from "../depot";
import Leg from "./leg";
export default class Route {
    jobs: Array<Job>;
    vehicle: Vehicle;

    constructor(vehicle: Vehicle, depot: Depot) {
        this.vehicle = vehicle;
        const start = depot.availableTimeWindows[0].start;
        const end = depot.availableTimeWindows[0].end;

        const startInDepot: Job = new Job(depot, JobType.Depot, new TimeWindow(start, start));
        const idleInDepot: Job = new Job(depot, JobType.Wait, new TimeWindow(start + 1, end - 1));
        const endInDepot: Job = new Job(depot, JobType.Depot, new TimeWindow(end, end));
        this.jobs = [startInDepot, idleInDepot, endInDepot]
    }

    private isValidJobSuccession(first: Job, second: Job): boolean {
        if (first.isCustomerOrDepotJob() ) {
            // console.log('customer/depot not followed by wait/travel');
            return second.isTravelOrWaitingJob()
        }

        if (first.isTravelJob() ) {
            // console.log('travel job succeeds travel job');
            return !second.isTravelJob();
        }

        if (first.isWaitingJob() ) {
            // console.log('wait job succeeds wait job');
            return !second.isWaitingJob();
        }

        return false;
    }

    toString() {
        return this.jobs.reduceRight((acc, val) => acc + val.toShortString(), '');
    }

    setJobs(jobs: Array<Job>) {
        this.jobs = jobs;
    }

    isValid(): boolean {
        if (this.jobs.length < 3) {
            console.log('Route to short');
            return false;
        }

        if (!this.start().isDepotJob() || !this.end().isDepotJob()) {
            console.log('Route not starting and ending at depot');
            return false
        }

        for (let i = 0; i < this.jobs.length - 1; i++) {
            if (!this.isValidJobSuccession(this.jobs[i], this.jobs[i + 1])) {
                return false;
            }
        }

        return true;
    }

    start(): Job {
        return this.jobs[0];
    }

    end(): Job {
        return this.jobs[this.jobs.length - 1]
    }

    getLegsInRoute(): Array<Leg> {
        //i.e. [D,W,T,C,T,W,C,T,W,D]
        return this.jobs
        // [D,W,T,C,T,W,C,T,W,D] -> [0,3,6,9]
            .reduce((arr, job, idx) => {
                if (job.isCustomerOrDepotJob()) {
                    arr.push(idx)
                }
                return arr;
            }, [])
            // [0,3,6,9] -> [[0,3],[3,6],[6,9],[9,undefined]]
            .map((el, i, arr) => new Leg(el, arr[i + 1]))
            // [[0,3],[3,6],[6,9],[9,undefined]] -> [[0,3],[3,6],[6,9]]
            .filter(leg => leg.isValid());
    }
}