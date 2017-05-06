import Route from "./route";
import {JobType} from "../job";
import Problem from "./problem";
import Customer from "../customer";
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
}
