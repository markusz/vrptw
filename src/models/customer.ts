import Node from "./node";
export default class Customer extends Node {
    jobDuration: number;
    skillsRequired: number;

    constructor(customerData: any) {
        super(customerData);
        this.skillsRequired = -1;
        this.jobDuration = customerData.service_time;
    }
}
