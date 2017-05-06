import Problem from "../models/solver/problem";
import Customer from "../models/customer";
import Node from "../models/node";
import * as lodash from 'lodash';
import Depot from "../models/depot";

export default class InstanceUtil {
    static importProblem(problemClass: string, problemId: string): Problem {
        const rawInstanceData = require(`../../data/instances/${problemClass}/${problemId}.json`);
        const customers: Array<Customer> = InstanceUtil.getCustomers(rawInstanceData);
        const depot: Depot = InstanceUtil.getDepot(rawInstanceData);
        const distances: Array<Array<number>> = rawInstanceData.distance_matrix;
        const constraints: any = InstanceUtil.getConstraints(rawInstanceData);
        const meta: any = {
            problemClass: problemClass,
            problemId: problemId
        };

        return new Problem(customers, depot, distances, constraints, meta);
    }

    private static getDepot(data: any): Depot {
        // Account for typo in source data
        const depotData = data.deport;
        depotData.id = 0;
        return new Depot(depotData);
    }

    private static getConstraints(data: any) {
        return {
            maxVehicles: data.max_vehicle_number,
            vehicleCapacity: data.vehicle_capacity,
            start: data.deport.ready_time,
            end:  data.deport.due_time
        }
    }

    private static getCustomers(data: any) {
        return Object.keys(data)
            .filter(key => lodash.startsWith(key, 'customer_'))
            .map(key => {
                data[key].id = parseInt(key.split('_')[1]);
                return data[key];
            })
            .sort((a, b) => a.id - b.id)
            .map(customerData => new Customer(customerData));
    }
}
