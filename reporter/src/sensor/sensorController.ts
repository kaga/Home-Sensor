import When = require('when');
import _ = require('lodash');

export interface SensorData {
    humidityPercentage?: number;
    temperatureInC?: number;
    tag?: string;
    timestamp: Date;    
}

export interface SensorSource {   
    read(): When.Promise<SensorData>;
}

export class SensorController {
    onSensorUpdate: (data: SensorData) => void;
    sensorSource: SensorSource; 
    reportIntervalInSeconds: number;
    tag: string;
    private intervalReference: any;

    constructor(reportIntervalInSeconds: number, 
                tag: string, 
                source: SensorSource, 
                onSensorUpdate: (data: SensorData) => void) {
        this.onSensorUpdate = onSensorUpdate;
        this.sensorSource = source;
        this.reportIntervalInSeconds = reportIntervalInSeconds;
        this.tag = tag;        
    }

    startReadingSensor = () => {
        this.stopReadingSensor();
        this.intervalReference = setInterval(this.intervalCallback, this.reportIntervalInSeconds * 1000);
        this.intervalCallback();
    }

    stopReadingSensor = () => {
        if (this.intervalReference) {
            clearInterval(this.intervalReference);
        }
    }

    private intervalCallback = () => {
        this.sensorSource.read()
                .then((data) => {                                    
                    data.tag = this.tag;
                    return data;
                })
                .then(this.onSensorUpdate)
                .catch((error) => {
                    console.error(error);
                });   
    }
}

export function createSensorByName(sensorname: string): When.Promise<SensorSource> {
    var supportedSensor = {
        "htu21d": () => {
            var Sensor = require('./Htu21dSensor').Sensor
            return new Sensor();     
        },
        "mock": () => {
            var Sensor = require('./MockSensor').Sensor;
            return new Sensor();
        }
    }
    var createSensor = supportedSensor[sensorname];
    if (_.isFunction(createSensor)) {
        return When.resolve(createSensor()); 
    }
    return When.reject<SensorSource>("No sensor class avaiable for name: " + sensorname);   
}