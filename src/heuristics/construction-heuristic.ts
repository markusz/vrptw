import Solution from "../models/solver/solution";
import Problem from "../models/solver/problem";
import RegretKRepair from "../alns/repair/regret-k-repair";
import Customer from "../models/customer";

export default class ConstructionHeuristic {
    static findInitialSolutionForProblem(problem: Problem): Solution {
        console.log(`Starting to solve instance with ${problem.customers.length} customers and ${problem.vehicles.length} vehicles and constaints: ${JSON.stringify(problem.constraints)}`);
        // Minmale als Wurzelknoten setzen
        const sInitial: Solution = ConstructionHeuristic.getEmptySolution(problem);
        const regretKRepair: RegretKRepair = new RegretKRepair(2, problem);
        // Iterationen starten hier
        let sTemp: Solution = sInitial;

        while (!sInitial.isComplete()) {
            const unservicedCustomers: Array<Customer> = sInitial.getUnservicedCustomers();
            try {
                console.log(sTemp.toCompactString());
                sTemp = regretKRepair.repair(sTemp);
            } catch(e) {
                console.log('Could not repair solution -> ', e)
            }
        }
        return sInitial;
    }

    static getEmptySolution(problem: Problem): Solution {
        return new Solution(problem);
    }
}
