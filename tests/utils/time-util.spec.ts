///<reference path="../../typings/globals/mocha/index.d.ts"/>
import TimeUtil from "../../src/utils/time-util";
import TimeWindow from "../../src/models/time-window";
const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;


describe('[Unit][Util] time-util.js', () => {
    describe('doTimeWindowsOverlap(f,s)', () => {

        it('is a static function', () => {
            assert.isFunction(TimeUtil.doTimeWindowsOverlap);
        });

        it('correctly calculates if time windows are overlapping', () => {
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(0, 4), new TimeWindow(5, 10))).to.be.false;
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(11, 20), new TimeWindow(5, 10))).to.be.false;
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(11, 11), new TimeWindow(5, 5))).to.be.false;


            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(0, 4), new TimeWindow(4, 10))).to.be.true;
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(0, 4), new TimeWindow(2, 10))).to.be.true;
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(0, 4), new TimeWindow(0, 4))).to.be.true;
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(10, 20), new TimeWindow(0, 12))).to.be.true;
            expect(TimeUtil.doTimeWindowsOverlap(new TimeWindow(0, 20), new TimeWindow(3, 12))).to.be.true;
        });
    });

    describe('getOverlap(f,s)', () => {

        it('is a static function', () => {
            assert.isFunction(TimeUtil.getOverlap);
        });

        it('correctly calculates if time windows are overlapping', () => {
            assert.throws(() => {
                TimeUtil.getOverlap(new TimeWindow(0, 4), new TimeWindow(5, 10))
            });
            assert.throws(() => {
                TimeUtil.getOverlap(new TimeWindow(11, 20), new TimeWindow(5, 10))
            });
            assert.throws(() => {
                TimeUtil.getOverlap(new TimeWindow(11, 11), new TimeWindow(5, 5))
            });


            const a = TimeUtil.getOverlap(new TimeWindow(0, 4), new TimeWindow(4, 10));
            const b = TimeUtil.getOverlap(new TimeWindow(0, 4), new TimeWindow(2, 10));
            const c = TimeUtil.getOverlap(new TimeWindow(0, 4), new TimeWindow(0, 4));
            const d = TimeUtil.getOverlap(new TimeWindow(10, 20), new TimeWindow(0, 12));
            const e = TimeUtil.getOverlap(new TimeWindow(0, 20), new TimeWindow(3, 12));


            expect([a.start, a.end]).to.eql([4, 4]);
            expect([b.start, b.end]).to.eql([2, 4]);
            expect([c.start, c.end]).to.eql([0, 4]);
            expect([d.start, d.end]).to.eql([10, 12]);
            expect([e.start, e.end]).to.eql([3, 12]);
        });
    });
});