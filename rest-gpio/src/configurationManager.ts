
import * as nconf from 'nconf';
import { validateGpioConfigurations } from './gpio/gpioController';

export function loadConfiguration() {
    nconf.file({
        file: 'config.json'
    });

    const gpioConfigs = nconf.get('gpios');
    console.log('reading gpio configs');
    console.log(JSON.stringify(gpioConfigs, null, 4));

    return validateGpioConfigurations(gpioConfigs);
}