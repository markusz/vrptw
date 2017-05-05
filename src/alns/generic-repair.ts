import Solution from "../models/solver/solution";
export interface RepairOperator {
   repair(s: Solution): Solution
}