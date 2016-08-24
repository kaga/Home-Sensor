import { GpioController, GpioState, GpioConfiguration } from './gpioController';
import { Promise, resolve } from 'when';

export class MockGpioController implements GpioController {
    bcmPinNumber: number = 0;
    state: boolean = false;

    constructor(config?: GpioConfiguration) {
        if (config) {
            this.bcmPinNumber = config.bcmPinNumber;
            this.writeToPin(config.state);
        }
    }

    readPin(): Promise<GpioState> {
        return resolve({
            timestamp: new Date(),
            bcmPinNumber: this.bcmPinNumber,
            state: this.state
        })
            .tap((state) => console.log(JSON.stringify(state, null, 4)));
    }

    writeToPin(newState: boolean): Promise<GpioState> {
        this.state = newState;
        return this.readPin();
    }
}