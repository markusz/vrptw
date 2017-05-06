///<reference path="../../typings/globals/mocha/index.d.ts"/>
import Route from "../../src/models/solver/route";
import Vehicle from "../../src/models/vehicle";
import Depot from "../../src/models/depot";
const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;


describe('[Unit][Model] route.js', () => {
    const vehicle: Vehicle = new Vehicle(1);
    const depot: Depot = new Depot({
        "coordinates": {
            "x": 40.0,
            "y": 50.0
        },
        "demand": 0.0,
        "due_time": 1236.0,
        "ready_time": 0.0,
        "service_time": 0.0
    });

    const validRoute1: Route = new Route(vehicle, depot);

    describe('isValid', () => {
        // D-W-D
        it('correctly classifies a starting route as valid', () => expect(validRoute1.isValid()).true);
    });


    describe('getLegsInRoute', () => {
        // D-W-D
        it('correctly gets legs in starting route', () => expect(validRoute1.getLegsInRoute().map(leg => leg.toArray())).to.eql([[0, 2]]));
    });
});