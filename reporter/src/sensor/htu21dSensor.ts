import { SensorSource, SensorData } from './sensorController';
import When = require('when');
var i2c_htu21d = require('htu21d-i2c');

export class Sensor implements SensorSource {
    htu21df: any;

    constructor() {
        // If using a Raspberry Pi, do not specify the i2c device name.
        this.htu21df = new i2c_htu21d();       
    }

    read = (): When.Promise<SensorData> => {
        var htu21df = this.htu21df;
        return When.promise<SensorData>((resolve, reject) => {        
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
