import Customer from "../customer";
import Node from "../node";
import Vehicle from "../vehicle";
import Depot from "../depot";
export default class Problem {
    costs: Array<Array<number>>;
    aptitude: Array<Array<boolean>>;
    customers: Array<Customer>;
    depot: Depot;
    distances: Array<Array<number>>;
    constraints: any;
    vehicles: Array<Vehicle>;
    meta: any;
    constructor(customers: Array<Customer>, depot: Depot, distances: Array<Array<number>>, constraints: any, meta: any) {
        this.costs = distances;
        this.distances = distances;
        this.depot = depot;
        this.customers = customers;
        this.constraints = constraints;
        this.vehicles = this.getNVehicles(this.constraints.maxVehicles);
        this.meta = meta;
    }

    private getNVehicles(n: number): Array<Vehicle> {
        const indexes: Array<number> = Array.apply(null, {length: n}).map(Number.call, Number);
        return indexes.map(idx => new Vehicle(idx))
    }

    getTravelCostBetweenNodes(from: Node, to: Node) {
        // cost = distance
        console.log(from, to);
        return this.distances[from.id][to.id];
    }

}