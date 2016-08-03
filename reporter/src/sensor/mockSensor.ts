import { SensorSource, SensorData } from './sensorController';
import when = require('when');

export class Sensor implements SensorSource {
    read(): When.Promise<SensorData> {
        return when.resolve({
            humidityPercentage: 50,
            temperatureInC: 23,
            timestamp: new Date()
        });
    }
}
