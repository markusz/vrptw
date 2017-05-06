import Solution from "../models/solver/solution";
export interface RepairOperator {
   collectRepairOperations(s: Solution): Solution
}