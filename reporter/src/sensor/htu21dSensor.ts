import { SensorSource, SensorData } from './sensorController';
import When = require('when');
var i2c_htu21d = require('htu21d-i2c');

export class Sensor implements SensorSource {
    // If using a Raspberry Pi, do not specify the i2c device name.
    private htu21df = new i2c_htu21d();

    read = (): When.Promise<SensorData> => {
        return When.all([this.readHumidity(), this.readTemperature()])
            .spread((humidityPercentage, temperatureInC) => {
                return {
                    humidityPercentage: humidityPercentage,
                    temperatureInC: temperatureInC,
                    timestamp: new Date()
                }
            });
    }

    readHumidity = () => {
        return When.promise<number>((resolve, reject) => {
            this.htu21df.readHumidity(resolve);
        });
    }

    readTemperature = () => {
        return When.promise<number>((resolve, reject) => {
            this.htu21df.readTemperature(resolve);
        });
    }
}
