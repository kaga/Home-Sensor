import * as moment from 'moment';
import { Schedule } from './schedule/schedule';
import { GpioController } from './gpio/gpioController';

export class ScheduleController {
    private schedule: Schedule;
    private timeoutReference: NodeJS.Timer;
    private gpioController: GpioController;

    constructor(gpioController: GpioController, schedule: Schedule = new Schedule()) {
        this.gpioController = gpioController;
        this.updateSchedule(schedule);
    }

    updateSchedule(schedule: Schedule) {
        this.schedule = schedule;
        this.updateRelayState();
    }

    getGpioController() {
        return this.gpioController;
    }

    private updateRelayState = () => {
        if (this.timeoutReference) {
            clearTimeout(this.timeoutReference);
        }

        const relayNewState = this.schedule.isWithinTimeslot(new Date());
        this.gpioController.writeToPin(relayNewState);

        this.timeoutReference = setTimeout(this.updateRelayState, this.nextTimeoutInMs());
    }

    private nextTimeoutInMs() {
        return moment().startOf('hour').add(1, 'hours').valueOf() - moment().valueOf();
    }
}
