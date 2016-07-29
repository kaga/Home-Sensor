import { assert } from 'chai';
import _ = require('lodash');
import { SensorGroupLevel, createSensorGroupLevel } from './sensorGroupLevel';

describe('SensorGroupLevel', () => {
    it('should transform valid string value to enum', () => {
        assert.equal(createSensorGroupLevel('Year') , SensorGroupLevel.Year);
        assert.equal(createSensorGroupLevel('Month') , SensorGroupLevel.Month);
        assert.equal(createSensorGroupLevel('Day') , SensorGroupLevel.Day);
        assert.equal(createSensorGroupLevel('Hour') , SensorGroupLevel.Hour);
        assert.equal(createSensorGroupLevel('Minute') , SensorGroupLevel.Minute);
        assert.equal(createSensorGroupLevel('Second') , SensorGroupLevel.Second);

        assert.equal(createSensorGroupLevel('year') , SensorGroupLevel.Year, "case-insensitive match");
        assert.equal(createSensorGroupLevel('YEAR') , SensorGroupLevel.Year, "case-insensitive match");
        assert.equal(createSensorGroupLevel() , SensorGroupLevel.Unknown, "Empty input");
        assert.equal(createSensorGroupLevel(undefined) , SensorGroupLevel.Unknown);
        assert.equal(createSensorGroupLevel(null), SensorGroupLevel.Unknown);        
    });
});