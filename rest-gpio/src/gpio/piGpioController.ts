import { Gpio } from 'onoff';
import { GpioController, GpioState, GpioConfiguration  } from './gpioController';
import * as When from 'when';
import * as _ from 'lodash';

export class PiGpioController implements GpioController {
    bcmPinNumber: number;
    private gpio: Gpio;
    private config: GpioConfiguration;

    constructor(config: GpioConfiguration) {
        const pin = new Gpio(config.bcmPinNumber, 'out');
        if (_.isBoolean(config.activeLow)) {
            pin['setActiveLow'](config.activeLow);
        }
        this.gpio = pin;
        this.config = config;
        this.bcmPinNumber = config.bcmPinNumber;
        this.writeToPin(config.state);
    }

    readPin(): When.Promise<GpioState> {
        const state = this.gpio.readSync() ? true : false;
        return When.resolve({
            timestamp: new Date(),
            bcmPinNumber: this.bcmPinNumber,
            state: state
        });
    }

    writeToPin(newState: boolean): When.Promise<GpioState> {
        this.gpio.writeSync(newState ? 1 : 0);
        return this.readPin();
    }
}
