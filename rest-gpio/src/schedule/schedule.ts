import * as _ from 'lodash';

export class Schedule {
    timeslots: boolean[];

    constructor(encodedTimeslot: number = 0) {
        if (encodedTimeslot < 0) {
            throw new Error('encodedTimeslot cannot be negative values');
        }

        const timeslotBinary = encodedTimeslot.toString(2);
        if (timeslotBinary.length > 24) {
            throw new Error('exceeded maximum value for encodedTimeslot');
        }

        const timeslots = _.map(_.range(0, 24), () => false);
        _.forEach(timeslotBinary.split('').reverse(), (value, index) => {
            timeslots[index] = (parseInt(value, 10) === 1);
        });

        this.timeslots = timeslots;
    }

    includeHour(hour: number) {
        this.validateHourRange(hour);
        this.timeslots[hour] = true;
    }

    setTimeslots(timeslots: boolean[]) {
        if (timeslots.length !== 24) {
            throw new Error('timeslot should be 24 in length');
        }
        _.forEach(timeslots, (value, index) => {
            if (value === true) {
                this.includeHour(index);
            } else {
                this.excludeHour(index);
            }
        });
    }

    excludeHour(hour: number) {
        this.validateHourRange(hour);
        this.timeslots[hour] = false;
    }

    isWithinTimeslot(time: Date): boolean {
        return this.timeslots[time.getHours()] ? true : false;
    }

    toJSON(): number {
        const encodedBinary = _.map(this.timeslots.reverse(), (value) => value ? '1' : '0').join('');
        return parseInt(encodedBinary, 2);
    }

    private validateHourRange(hour: number) {
        if (hour < 0 || hour > 23) {
            throw new Error('value should between 0-23');
        }
    }
}
