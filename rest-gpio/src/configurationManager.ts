import * as nconf from 'nconf';
import { validateGpioConfigurations } from './gpio/gpioController';

const fileName = 'config.json';

export function loadConfiguration() {
    nconf.file({
        file: fileName
    });

    const gpioConfigs = nconf.get('gpio');
    const mockGpio = nconf.get('mock_gpio');

    console.log('reading gpio configs, useMock:' + mockGpio);
    console.log(JSON.stringify(gpioConfigs, null, 4));

    return {
        useMock: mockGpio,
        configs: validateGpioConfigurations(gpioConfigs)
    };
}

export function saveGpioSchedule(bcmPinNumber: number, encodedSchedule: number) {
    nconf.file({
        file: fileName
    });

    const key = 'gpio:' + bcmPinNumber + ':encodedSchedule';
    nconf.set(key, encodedSchedule);
    nconf.save(function (error) {
        if (error) {
            console.error('error:' + error);
        } else {
            console.log('saved schedule ' + key + ', value: ' + encodedSchedule);
        }
    });
}