import uuid = require('node-uuid');
import request = require('request');
import _ = require('lodash');
import { IncomingMessage } from 'http';

import { loadConfiguration } from './configurationManager';
import { SensorController, createSensorByName, SensorData } from './sensor/sensorController';

var config = loadConfiguration();

console.info('configuration: ' + JSON.stringify(config, null, 4));
//_.isObject(config.reportApi)

createSensorByName(config.sensor.source)
    .tap((sensor) => {
        var controller = new SensorController(config.sensor.reportInterval, config.sensor.tag, sensor, onReceivedData);
        controller.startReadingSensor();
    });

function onReceivedData(data: SensorData) {
    console.log(data);

    var reportApi = config.reportApi;
    if (_.isObject(reportApi)) {
        var host = reportApi.host;
        var path = reportApi.path;
        
        request.put({
            url: host + path + '/' + uuid.v4(),
            json: {
                temperatureInC: data.temperatureInC,
                humidityPercentage: data.humidityPercentage,
                timestamp: data.timestamp.toISOString()
            }
        }, function(error: any, response: IncomingMessage, body: any) {
            if (error) {
                console.error(error);
            } 
            if (body) {
                console.log(body);
            }
        });
    } else {
        console.info('report to api is disabled');
    }
}

