import Solution from "../models/solver/solution";
import RepairOperation from "../models/solver/repair-operation";
export interface RepairOperator {
   collectRepairOperations(s: Solution): Array<Array<RepairOperation>>
}