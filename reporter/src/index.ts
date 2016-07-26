//import uuid = require('uuid');
import { loadConfiguration } from './configurationManager';
import { SensorController, createSensorByName } from './sensor/sensorController';

var config = loadConfiguration();

//_.isObject(config.reportApi)

createSensorByName(config.sensor.source)
    .tap((sensor) => {
        var controller = new SensorController(config.sensor.reportInterval, config.sensor.tag, sensor, onReceivedData);
        controller.startReadingSensor();
    });

function onReceivedData(data) {
    console.log(data);
}

function uploadRoomdata(tempurature, humidity) {
    /*try {
        request.put({
            url: 'http://room1pi.local:5984/livingroom_temp_humi/' +  uuid.v4(),
            json: {
                temperatureInC: tempurature,
                humidityPercentage: humidity,
                timestamp: new Date().toISOString()
            }
        })
    } catch(error) {

    }*/
}

