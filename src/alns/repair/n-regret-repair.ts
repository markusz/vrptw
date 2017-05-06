import {RepairOperator} from "../generic-repair";
import Solution from "../../models/solver/solution";
import Customer from "../../models/customer";
import * as lodash from "lodash";
import {JobType} from "../../models/job";
import TimeUtil from "../../utils/time-util";
import TimeWindow from "../../models/time-window";

export default class NRegretRepair implements RepairOperator {
    n: number;

    constructor(n: number) {
        this.n = n;
    }

    repair(s: Solution): Solution {
        let unservicedCustomers: Array<Customer> = s.getUnservicedCustomers();
        unservicedCustomers = lodash.shuffle(unservicedCustomers);
        for (let customer of unservicedCustomers) {
            this.scheduleCustomer(s, customer);
        }

        return s;
    }

    scheduleCustomer(solution: Solution, customer: Customer) {
        const availability = customer.availableTimeWindows;
        const vehicles = solution.problem.vehicles;

        for (let vehicle of vehicles) {

            const legs: Array<Array<[number, number]>> = solution.routes[vehicle.id].getLegsInRoute();

            const jobs = solution.routes[vehicle.id].jobs;

            // lower bound 1, upper bound length-1 excludes depot jobs
            for (let i = 1; i < jobs.length - 1; i++) {

                const isVehicleIdle: boolean = jobs[i].type === JobType.Wait;

                if (isVehicleIdle) {
                    //waitJob = idle Vehicle
                    const waitJob = jobs[i];
                    const predecessor = jobs[i - 1];
                    const successor = jobs[i + 1];
                    const travelCostToPredecessor: number = solution.problem.getTravelCostBetweenNodes(predecessor.node, customer);
                    const travelCostToSuccessor: number = solution.problem.getTravelCostBetweenNodes(customer, successor.node);

                    // costs are equal to time spent
                    const totalCost = travelCostToPredecessor + customer.jobDuration + travelCostToSuccessor;
                    const availableVehicleTime = waitJob.getDuration();
                    const doesVehicleHaveTimeForCustomerIncludingTravelTime: boolean = totalCost <= availableVehicleTime;

                    if (doesVehicleHaveTimeForCustomerIncludingTravelTime) {
                        const earliestPossibleArrivalAtCustomer: number = waitJob.time.start + travelCostToPredecessor;
                        const latestPossibleArrivalAtCustomer: number = waitJob.time.end - travelCostToSuccessor;
                        const vehicleAvailability: TimeWindow = new TimeWindow(earliestPossibleArrivalAtCustomer, latestPossibleArrivalAtCustomer);
                        const possibleServiceWindows: Array<TimeWindow> = customer.availableTimeWindows
                            .filter(customerAvailability => TimeUtil.doTimeWindowsOverlap(customerAvailability, vehicleAvailability))
                            .map(tw => TimeUtil.getOverlap(tw, vehicleAvailability));

                        const doesAPossibleServiceWindowExist: boolean = possibleServiceWindows.length > 0;

                        if (doesAPossibleServiceWindowExist) {
                            const currentCostOfSubroute: number = solution.problem.getTravelCostBetweenNodes(predecessor.node, successor.node);
                            console.log(`could schedule ${customer.id} for ${vehicle.id} with additional cost of `)
                        }

                    }
                }
            }
        }
    }
}
