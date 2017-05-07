///<reference path="../../../typings/globals/mocha/index.d.ts"/>
import Problem from "../../../src/models/solver/problem";
import InstanceUtil from "../../../src/utils/instance-util";
import RepairOperation from "../../../src/models/solver/repair-operation";
import NRegretRepair from "../../../src/alns/repair/n-regret-repair";
const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;


describe('[Unit][Repair] NRegretRepair', () => {
    const problem: Problem = InstanceUtil.importProblem('solomon', 'C101');

    const regret2Repair = new NRegretRepair(2, problem);
    const regret3Repair = new NRegretRepair(3, problem);

    describe('selectRepairOperation', () => {

        //2-regret = 4, 3-regret = 8
        const job1Repairs: Array<RepairOperation> = [
            new RepairOperation(null, null, 0, null, 6),
            new RepairOperation(null, null, 0, null, 10),
            new RepairOperation(null, null, 0, null, 14),
            new RepairOperation(null, null, 0, null, 30),
        ];

        //2-regret = 5, 3-regret = 6
        const job2Repairs: Array<RepairOperation> = [
            new RepairOperation(null, null, 0, null, 3),
            new RepairOperation(null, null, 0, null, 8),
            new RepairOperation(null, null, 0, null, 9)
        ];

        //2-regret = 1, 3-regret = 10
        const job3Repairs: Array<RepairOperation> = [
            new RepairOperation(null, null, 0, null, 1),
            new RepairOperation(null, null, 0, null, 2),
            new RepairOperation(null, null, 0, null, 11)
        ];

        const repairOperations: Array<Array<RepairOperation>> = [job1Repairs, job2Repairs, job3Repairs];

        expect(regret2Repair.selectRepairOperation(repairOperations).cost).eql(3);
        expect(regret3Repair.selectRepairOperation(repairOperations).cost).eql(1);
    });
});