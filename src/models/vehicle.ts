export default class Vehicle {
    id: number;
    skillsPossessed: number;

    constructor(id: number) {
        this.id = id;
        this.skillsPossessed = -1;
    }

    index() {
        return this.id;
    }
}