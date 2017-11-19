import InstanceUtil from "./utils/instance-util";
import ImprovementHeuristic from "./heuristics/improvement-heuristic"
import ConstructionHeuristic from "./heuristics/construction-heuristic";

const problem = InstanceUtil.importProblem('solomon', 'C101');
// console.log(`Imported problem ${JSON.stringify(problem.meta)}`);
const solution = ConstructionHeuristic.findInitialSolutionForProblem(problem);
console.log('Solution', solution);
ImprovementHeuristic.improveSolution(solution);