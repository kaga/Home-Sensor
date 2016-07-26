var assert = require('chai').assert;
import _ = require('lodash');
import { Sensor } from './mockSensor';

describe('Mock Sensor', () => {
    it('should read data', () => {
        var sensor = new Sensor();
        return sensor.read()
            .then((data) => {
                assert.ok(_.isNumber(data.humidityPercentage));
                assert.ok(_.isNumber(data.temperatureInC))
                assert.ok(_.isDate(data.timestamp));
            })
    });
});