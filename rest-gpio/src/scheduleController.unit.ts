import { assert } from 'chai';
import { ScheduleController } from './scheduleController';
import { Schedule } from './schedule/schedule';
import { MockGpioController } from './gpio/mockGpioController';
import * as sinon from 'sinon';
import * as _ from 'lodash';
import * as moment from 'moment';

describe('Schedule Controller manages gpio by 24 hour time schedule', function () {

    it('should update gpio on init', function () {
        const clock = sinon.useFakeTimers(new Date(2016, 8, 20, 10, 0, 0).getTime());
        const gpioController = new MockGpioController();
        const schedule = new Schedule();
        schedule.includeHour(10);

        const controller = new ScheduleController(gpioController, schedule);
        controller.getGpioController();

        assert.isTrue(gpioController.state, 'should set state to true at init');

        _.each(_.range(0, (60 * 59) + 59), (minute) => {
            clock.tick(1000);

            assert.isTrue(gpioController.state, `should set state to true between 10:00 ~ 10:59:59, current time: ${moment(clock.now).format('LLL')}`);
        });
        clock.tick(1000);
        assert.isFalse(gpioController.state, `just out of 10am timeslot, current time: ${moment(clock.now).format('LLL')}`);
        clock.restore();
    });

    it('should trigger gpio on updating schedule', function () {
        const clock = sinon.useFakeTimers(new Date(2016, 8, 20, 10, 0, 0).getTime());
        const gpioController = new MockGpioController();
        const controller = new ScheduleController(gpioController, new Schedule());

        assert.equal(gpioController.state, false);

        const schedule = new Schedule();
        schedule.includeHour(10);
        controller.updateSchedule(schedule);
        assert.equal(gpioController.state, true);

        clock.tick(61 * 60 * 1000);
        assert.isFalse(gpioController.state);
        clock.restore();
    });
});