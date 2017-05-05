import Solution from "../models/solver/solution";
import Problem from "../models/solver/problem";
import NRegretRepair from "../alns/repair/n-regret-repair";
import Customer from "../models/customer";

export default class ConstructionHeuristic {
    static findInitialSolutionForProblem(problem: Problem): Solution {
        console.log(`Starting to solve instance with ${problem.customers.length} customers and ${problem.vehicles.length} vehicles and constaints: ${JSON.stringify(problem.constraints)}`);
        // Minmale als Wurzelknoten setzen
        const sInitial: Solution = ConstructionHeuristic.getEmptySolution(problem);
        sInitial.printToConsole();
        const nRegretRepair: NRegretRepair = new NRegretRepair(2);
        // Iterationen starten hier
        let sTemp: Solution = sInitial;

        while (!sInitial.isComplete()) {
            const unservicedCustomers: Array<Customer> = sInitial.getUnservicedCustomers();
            // console.log(unservicedCustomers.length);
            sTemp = nRegretRepair.repair(sTemp);
            // s_c = s_t;
            // s_c.setT(System.currentTimeMillis() - s_c.getT_s());
        }
        return sInitial;
    }

    static getEmptySolution(problem: Problem): Solution {
        return new Solution(problem);
    }
}
