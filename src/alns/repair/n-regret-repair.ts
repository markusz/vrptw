import {RepairOperator} from "../generic-repair";
import Solution from "../../models/solver/solution";
import Customer from "../../models/customer";
import * as lodash from "lodash";
import Job from "../../models/job";
import TimeUtil from "../../utils/time-util";
import TimeWindow from "../../models/time-window";
import Leg from "../../models/solver/leg";
import Vehicle from "../../models/vehicle";

export default class NRegretRepair implements RepairOperator {
    n: number;

    constructor(n: number) {
        this.n = n;
    }

    collectRepairOperations(s: Solution): Solution {
        let unservicedCustomers: Array<Customer> = s.getUnservicedCustomers();
        unservicedCustomers = lodash.shuffle(unservicedCustomers);
        for (let customer of unservicedCustomers) {
            this.collectRepairOperationsForCustomer(s, customer);
        }

        return s;
    }

    canJobBePlacedBetweenToNodes(first: Node, second: Node, customer: Customer) {

    }

    collectRepairOperationsForCustomer(solution: Solution, customer: Customer) {
        const vehicles: Array<Vehicle> = solution.problem.vehicles;

        for (let vehicle of vehicles) {
            const jobs: Array<Job> = solution.routes[vehicle.id].jobs;
            const legs: Array<Leg> = solution.routes[vehicle.id].getLegsInRoute();
            for (let leg of legs) {
                const predecessor: Job = jobs[leg.start];
                const successor: Job = jobs[leg.end];

                const currentLegCost: number = solution.problem.getTravelCostBetweenNodes(predecessor.node, successor.node);

                const travelCostToPredecessor: number = solution.problem.getTravelCostBetweenNodes(predecessor.node, customer);
                const travelCostToSuccessor: number = solution.problem.getTravelCostBetweenNodes(customer, successor.node);

                // costs are equal to time spent
                const totalCost: number = travelCostToPredecessor + customer.jobDuration + travelCostToSuccessor;
                // How many time units can we spend on the added detour
                let costBudget: number = 0;

                // two possibilities
                // 1) traveling (CD){1}-T-(CD){1} -> ca be ignored since no waiting time
                // 2) waiting (DWD) -> can be scheduled
                if (leg.jobsBetweenStartAndEnd() === 1) {
                    costBudget += jobs[leg.start + 1].getDuration();
                }

                // traveling (CD){1}-(WT|TW){1}-(CD){1}
                if (leg.jobsBetweenStartAndEnd() === 2) {
                    costBudget += jobs[leg.start + 1].getDuration();
                    costBudget += jobs[leg.start + 2].getDuration();
                }

                if (leg.jobsBetweenStartAndEnd() > 2) {
                    throw new Error('This should not happen');
                }

                const doesVehicleHaveTimeForCustomerIncludingTravelTime: boolean = totalCost <= costBudget;
                if (doesVehicleHaveTimeForCustomerIncludingTravelTime) {
                    const earliestPossibleStartOfCustomerServing: number = predecessor.time.end + travelCostToPredecessor + 1;
                    const latestPossibleStartOfCustomerServing: number = successor.time.start - travelCostToSuccessor;
                    const vehicleAvailability: TimeWindow = new TimeWindow(earliestPossibleStartOfCustomerServing, latestPossibleStartOfCustomerServing);
                    const possibleServiceWindows: Array<TimeWindow> = customer.availableTimeWindows
                        .filter(customerAvailability => TimeUtil.doTimeWindowsOverlap(customerAvailability, vehicleAvailability))
                        .map(tw => TimeUtil.getOverlap(tw, vehicleAvailability));

                    const doesAPossibleServiceWindowExist: boolean = possibleServiceWindows.length > 0;

                    if (doesAPossibleServiceWindowExist) {
                        const costOfLegWithAdditionalCustomer: number = solution.problem.getTravelCostBetweenNodes(predecessor.node, customer) + solution.problem.getTravelCostBetweenNodes(customer, successor.node);
                        const additionalCost: number = costOfLegWithAdditionalCustomer - currentLegCost;
                        console.log(`could schedule ${customer.id} for ${vehicle.id} with additional cost of ${costOfLegWithAdditionalCustomer.toFixed(2)} - ${currentLegCost.toFixed(2)} = ${(additionalCost).toFixed(2)}`)
                    }
                }
            }
        }
    }
}
