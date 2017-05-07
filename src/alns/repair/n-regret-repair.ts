import {RepairOperator} from "../generic-repair";
import Solution from "../../models/solver/solution";
import Customer from "../../models/customer";
import * as lodash from "lodash";
import Job from "../../models/job";
import TimeUtil from "../../utils/time-util";
import TimeWindow from "../../models/time-window";
import Leg from "../../models/solver/leg";
import Vehicle from "../../models/vehicle";
import Problem from "../../models/solver/problem";
import RepairOperation from "../../models/solver/repair-operation";

export default class NRegretRepair implements RepairOperator {
    n: number;
    problem: Problem;

    constructor(n: number, problem: Problem) {
        this.n = n;
        this.problem = problem;
    }

    repair(s: Solution) {
        const repairOperations: Array<Array<RepairOperation>> = this.collectRepairOperations(s);
        const repairOperation: RepairOperation = this.selectRepairOperation(repairOperations);
        s.applyRepairOperation(repairOperation);
        return s;
    }

    collectRepairOperations(s: Solution): Array<Array<RepairOperation>> {
        const repairOperations: Array<Array<RepairOperation>> = [];
        const unservicedCustomers = lodash.shuffle(s.getUnservicedCustomers());
        for (let customer of unservicedCustomers) {
            repairOperations[customer.id] = this.collectRepairOperationsForCustomer(s, customer);
        }

        return repairOperations;
    }

    selectRepairOperation(repairOperation: Array<Array<RepairOperation>>): RepairOperation {
        const n = this.n - 1;
        const res: Array<Array<RepairOperation>> = repairOperation
            .map(repairOperations => repairOperations.sort((b, a) => b.cost - a.cost)) // sort repair operations per vehicle descending
            .sort((first, second) =>  (second[n].cost - second[0].cost) - (first[n].cost - first[0].cost)); //
        return res[0][0];
    }

    collectRepairOperationsForCustomer(solution: Solution, customer: Customer) {
        const vehicles: Array<Vehicle> = this.problem.vehicles;
        const repairOperations: Array<RepairOperation> = [];

        for (let vehicle of vehicles) {
            const jobs: Array<Job> = solution.routes[vehicle.id].jobs;
            const legs: Array<Leg> = solution.routes[vehicle.id].getLegsInRoute();
            for (let leg of legs) {
                const predecessor: Job = jobs[leg.start];
                const successor: Job = jobs[leg.end];

                const currentLegCost: number = this.problem.getTravelCostBetweenNodes(predecessor.node, successor.node);

                const travelCostToPredecessor: number = this.problem.getTravelCostBetweenNodes(predecessor.node, customer);
                const travelCostToSuccessor: number = this.problem.getTravelCostBetweenNodes(customer, successor.node);

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
                    const vehicleAvailability: TimeWindow = this.getVehicleServiceWindowForSchedulingCustomerBetweenTwoOtherCustomers(predecessor, successor, customer);
                    const customerAvailability: Array<TimeWindow> = customer.availableTimeWindows;

                    const possibleServiceWindows: Array<TimeWindow> = customerAvailability
                        .filter(customerAvailability => TimeUtil.doTimeWindowsOverlap(customerAvailability, vehicleAvailability))
                        .map(tw => TimeUtil.getOverlap(tw, vehicleAvailability));

                    if (possibleServiceWindows.length > 0) {
                        const costOfLegWithAdditionalCustomer: number = this.problem.getTravelCostBetweenNodes(predecessor.node, customer) + solution.problem.getTravelCostBetweenNodes(customer, successor.node);
                        const additionalCost: number = costOfLegWithAdditionalCustomer - currentLegCost;
                        // console.log(`could schedule ${customer.id} for ${vehicle.id} with additional cost of ${costOfLegWithAdditionalCustomer.toFixed(2)} - ${currentLegCost.toFixed(2)} = ${(additionalCost).toFixed(2)}`)

                        for (let sw of possibleServiceWindows) {
                            repairOperations.push(new RepairOperation(vehicle, customer, sw.start, leg, additionalCost));
                            if (sw.start !== sw.end) {
                                repairOperations.push(new RepairOperation(vehicle, customer, sw.end, leg, additionalCost));
                            }
                        }
                    }
                }
            }
        }

        // console.log(repairOperations.map(i => i.toString()));
        return repairOperations;
    }

    private getVehicleServiceWindowForSchedulingCustomerBetweenTwoOtherCustomers(predecessor: Job, successor: Job, customer: Customer): TimeWindow {
        const travelCostToPredecessor: number = this.problem.getTravelCostBetweenNodes(predecessor.node, customer);
        const travelCostToSuccessor: number = this.problem.getTravelCostBetweenNodes(customer, successor.node);

        // end of previous job + travel time = earliest possible
        const earliestPossibleStartOfCustomerServing: number = predecessor.time.end + travelCostToPredecessor + 1;
        // start of successor job - travel time - duration of new customer = latest possible start
        const latestPossibleStartOfCustomerServing: number = successor.time.start - travelCostToSuccessor - customer.jobDuration;
        return new TimeWindow(earliestPossibleStartOfCustomerServing, latestPossibleStartOfCustomerServing);
    }
}
