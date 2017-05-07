import Vehicle from "../vehicle";
import Customer from "../customer";
import Leg from "./leg";
export default class RepairOperation {
    vehicle: Vehicle;
    customer: Customer;
    start: number;
    leg: Leg;
    cost: number;

    constructor(vehicle: Vehicle, customer: Customer, start: number, leg: Leg, cost: number) {
        this.vehicle = vehicle;
        this.customer = customer;
        this.start = start;
        this.leg = leg;
        this.cost = cost;
    }

    toString() {
        return `V=${this.vehicle.id},C=${this.customer.id},T=${this.start},L=${this.leg.toArray()},c=${this.cost.toFixed(1)}`
    }
}