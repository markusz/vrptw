import Route from "./route";
import Job, {JobType} from "../job";
import Problem from "./problem";
import Customer from "../customer";
import RepairOperation from "./repair-operation";
import TimeWindow from "../time-window";
export default class Solution {
    routes: Array<Route>;
    problem: Problem;
    cost: number;
    customerServiced: Array<boolean>;

    constructor(underlyingProblem: Problem) {
        this.problem = underlyingProblem;
        this.customerServiced = underlyingProblem.customers.map(c => false);
        this.routes = this.getEmptyRoutesForEachVehicle();
    }

    clone(): Solution {
        return JSON.parse(JSON.stringify(this));
    }

    applyRepairOperation(repairOperation: RepairOperation): void {
        console.log(`${repairOperation.vehicle.id}->${repairOperation.customer.id}`);
        const route: Route = this.routes[repairOperation.vehicle.id];

        const cJobEnd = repairOperation.start + repairOperation.customer.jobDuration;
        const legStartJob: Job = route.jobs[repairOperation.leg.start];
        const legEndJob: Job = route.jobs[repairOperation.leg.end];

        const customerJob: Job = new Job(repairOperation.customer, JobType.Customer, new TimeWindow(repairOperation.start, cJobEnd));
        const subrouteToNewCustomer: Array<Job> = this.makeSubroute(legStartJob, customerJob);
        const subrouteFromNewCustomer: Array<Job> = this.makeSubroute(customerJob, legEndJob);

        // console.log('to:', subrouteToNewCustomer);
        // console.log('from:', subrouteFromNewCustomer);
        const mergedSubroute = this.mergeSubroutes(subrouteToNewCustomer, subrouteFromNewCustomer);

        route.setJobs(mergedSubroute);
        this.customerServiced[customerJob.node.index()] = true;
    }

    mergeSubroutes(first: Array<Job>, second: Array<Job>) {
        if (first[first.length - 1] !== second[0]) {
            throw new Error('Cannot merge, since jobs arent the same');
        }

        return first.slice(0, first.length - 1).concat(second);
    }

    makeSubroute(start: Job, end: Job): Array<Job> {
        const arrivalTime: number = end.getStart() - 1;
        const departureTime: number = arrivalTime - this.problem.getTravelCostBetweenNodes(start.node, end.node) + 1;

        const waitForTravelToCustomer: Job = new Job(start.node, JobType.Wait, new TimeWindow(start.getEnd() + 1, departureTime - 1));
        const travelToLegEnd: Job = new Job(start.node, JobType.Travel, new TimeWindow(departureTime, arrivalTime));

        const jobs: Array<Job> = [];
        jobs.push(start);
        if (waitForTravelToCustomer.getDuration() > 0) {
            jobs.push(waitForTravelToCustomer);
        }
        jobs.push(travelToLegEnd);
        jobs.push(end);

        return jobs;
    }

    getEmptyRoutesForEachVehicle(): Array<Route> {
        return this.problem.vehicles
            .map(vehicle => new Route(vehicle, this.problem.depot))
    }

    getUnservicedCustomers(): Array<Customer> {
        return this.customerServiced.reduce((unservicedCustomers, cs, i) => {
            if (cs === false) {
                const unservicedCustomer: Customer = this.problem.customers[i];
                unservicedCustomers.push(unservicedCustomer);
            }
            return unservicedCustomers;
        }, []);
    }

    printToConsole() {
        const printObject = {
            cost: this.cost,
            routes: this.routes,
            unservicedJobs: this.getUnservicedCustomers().map(c => c.id)
        };

        console.log(JSON.stringify(printObject, null, 2));
    }

    isComplete(): boolean {
        const jobsOnRoutes = this.routes
            .map(route => route.jobs)
            .reduceRight((a, b) => a.concat(b), [])
            .filter(job => job.type == JobType.Customer).length;

        return jobsOnRoutes === this.problem.customers.length;
    }

    toString(): Array<string> {
        return this.routes
            .map(r => r.vehicle.id + ':' + r.toString());
    }

    toCompactString(): Array<string> {
        return this.routes
            .filter(r => r.jobs.length > 3)
            .map(r => r.vehicle.id + ':' + r.toString());
    }
}
