import { assert } from 'chai';
import { validateGpioConfigurations } from './gpioController';

describe('validate configuration', function () {
    it('should return valid configuration', function () {
        const result = validateGpioConfigurations([
            {
                'bcmPinNumber': 4,
                'state': true,
                'activeLow': false,
                'description': 'The pin that switch the relay module on/off'
            }
        ]);
        assert.equal(result.length, 1);
    });

    it('should be valid without optional configuration', function () {
        const result = validateGpioConfigurations([
            {
                'bcmPinNumber': 4,
                'state': true
            }
        ]);
        assert.equal(result.length, 1);
    });
});
