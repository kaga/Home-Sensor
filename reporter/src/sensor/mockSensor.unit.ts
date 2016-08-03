import { assert } from 'chai';
import _ = require('lodash');
import { Sensor } from './mockSensor';

describe('Mock Sensor', () => {
    it('should read data', () => {
        let sensor = new Sensor();
        return sensor.read()
            .then((data) => {
                assert.ok(_.isNumber(data.humidityPercentage));
                assert.ok(_.isNumber(data.temperatureInC));
                assert.ok(_.isDate(data.timestamp));
            });
    });
});