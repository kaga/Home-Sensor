import { assert } from 'chai';
import { Schedule } from './schedule';
import * as _ from 'lodash';

describe('schedule keeping', function () {

    it('should construct the schedule object from encoded value', function () {
        assert.equal(new Schedule().toJSON(), 0, 'Default to have no timeslot selected');
        assert.equal(new Schedule(16777215).toJSON(), 16777215, 'Maximum value that the constructor accepts');

        assert.throw(() => { new Schedule(16777216); }, 'exceeded maximum value for encodedTimeslot');
        assert.throw(() => { new Schedule(-1); }, 'encodedTimeslot cannot be negative values');
    });

    it('should allow including time', function () {
        const schedule = new Schedule();
        assert.isNotTrue(schedule.isWithinTimeslot(new Date()), 'Default to have no timeslot selected');
        schedule.includeHour(0);
        assert.isTrue(schedule.isWithinTimeslot(new Date(2016, 8, 11, 0, 0, 0)), 'should within timeslot');
        assert.isTrue(schedule.isWithinTimeslot(new Date(2016, 8, 11, 0, 30, 0)), 'should within timeslot in that hour');
        assert.isTrue(schedule.isWithinTimeslot(new Date(2016, 8, 11, 0, 59, 0)), 'should within timeslot in that hour');

        assert.isNotTrue(schedule.isWithinTimeslot(new Date(2016, 8, 11, 1, 0, 0)), 'out of the selected hour');

        assert.throw(() => { schedule.includeHour(24); }, 'value should between 0-23');
        assert.throw(() => { schedule.includeHour(-1); }, 'value should between 0-23');
    });

    it('should allow excluding time', function () {
        const schedule = new Schedule();
        assert.isNotTrue(schedule.isWithinTimeslot(new Date()), 'Default to have no timeslot selected');
        schedule.includeHour(0);
        assert.isTrue(schedule.isWithinTimeslot(new Date(2016, 8, 11, 0, 0, 0)), 'should within timeslot');

        schedule.excludeHour(0);
        assert.isNotTrue(schedule.isWithinTimeslot(new Date(2016, 8, 11, 0, 0, 0)), 'timeslot just excluded');

        assert.throw(() => { schedule.excludeHour(24); }, 'value should between 0-23');
        assert.throw(() => { schedule.excludeHour(-1); }, 'value should between 0-23');
    });

    it('should setTimeslot', function () {
        const schedule = new Schedule();
        assert.throw(() => { schedule.setTimeslots([false]); }, 'timeslot should be 24 in length');

        const timeslots: boolean[] = Array<boolean>(24);
        _.forEach(_.range(24), (i) => timeslots[i] = false);

        timeslots[0] = true;
        schedule.setTimeslots(timeslots);
        assert.equal(schedule.toJSON(), 1, 'should allow setting timeslot in array of boolean');
    });

    it('should output encoded timeslot to json', function () {
        assert.equal(new Schedule().toJSON(), 0, 'No timeslot enabled');

        const allDaySchedule = new Schedule();
        _.forEach(_.range(24), function (i) {
            allDaySchedule.includeHour(i);
        });
        const expectedEncodedValue = parseInt('111111111111111111111111', 2);
        assert.equal(allDaySchedule.toJSON(), expectedEncodedValue, 'Enable all timeslots');

        let singleHourSchedule = new Schedule();
        singleHourSchedule.includeHour(0);
        assert.equal(singleHourSchedule.toJSON(), 1);

        singleHourSchedule = new Schedule();
        singleHourSchedule.includeHour(23);
        singleHourSchedule.includeHour(0);
        assert.equal(singleHourSchedule.toJSON(), 8388609);
    });

    it('should return the schedule as saved after toJSON', function () {
        const schedule = new Schedule();
        schedule.setTimeslots([false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);

        schedule.toJSON();
        _.each(schedule.timeslots, (value, key) => {
            if (key === 3) {
                assert.isTrue(value);
            } else {
                assert.isFalse(value);
            }
        });
    });
});