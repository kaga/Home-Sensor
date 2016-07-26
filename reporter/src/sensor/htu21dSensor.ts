import { SensorSource, SensorData } from './sensorController';
import When = require('when');
var i2c_htu21d = require('htu21d-i2c');

export class Sensor implements SensorSource {
    //private htu21df: any;

    constructor() {
        // If using a Raspberry Pi, do not specify the i2c device name.       
    }

    read = (): When.Promise<SensorData> => {
        return When.promise<SensorData>((resolve, reject) => {
            var  htu21df = new i2c_htu21d();
            htu21df.readHumidity(function (humidity) {
                htu21df.readTemperature(function (temperature) {
                    resolve({
                        humidityPercentage: humidity,
                        temperatureInC: temperature,
                        timestamp: new Date()
                    });
                });
            });
        });
    }
}
