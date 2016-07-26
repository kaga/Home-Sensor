var assert = require('chai').assert;
import _ = require('lodash');
import sinon = require('sinon');

import { SensorController, createSensorByName } from './sensorController';
import { SensorSource, SensorData } from './sensorController';
import { Sensor } from './mockSensor';

describe("SensorController", function() {
     var controller: SensorController;

    beforeEach(function() {
    })

    afterEach(function() {
        controller.stopReadingSensor();
        controller = null;
    })

    it("should call back at specific interval", function(done) {
        var mockSensor = new Sensor();
        var callback = sinon.spy();
        controller = new SensorController(1, "livingroom", mockSensor, callback);
        assert.isNotOk(callback.called, "Check state"); 
        controller.startReadingSensor();

        _.defer(function() {
              assert.isOk(callback.calledOnce, "Should invoke the callback immediately");
              done();              
        });
    });

    it("should include tag in the response", function() {
        var mockSensor = new Sensor();
        controller = new SensorController(1, "livingroom", mockSensor, (data) => {
            assert.ok(_.isNumber(data.humidityPercentage));
            assert.ok(_.isNumber(data.temperatureInC));
            assert.ok(_.isString(data.tag));
            assert.ok(_.isDate(data.timestamp));                        
        }); 
        controller.startReadingSensor();            
    });
});

describe("Sensor Factory", function() {
    it('should create mock sensor', function() {
        return createSensorByName('mock');
    });

    //Only available on raspberry pi \_(ツ)_/¯
    /*it('should create htu21d sensor', function() {
        return createSensorByName('htu21d');
    });*/

    it('should throw error on unrecognized names', function(done) {
        createSensorByName('foo')
            .catch(() => {
                done();
            });
    });
});

