import cradle = require('cradle');
import moment = require('moment');
import When = require('when');

import { SensorGroupLevel } from './sensorGroupLevel';

export interface SensorDatabaseConfiguration {
    host: string;
    port: number;
    databaseName: string;
    designName: string;
    tempuratureViewName: string;
    humidityViewName: string;
}

export interface SensorData {
    humidityPercentage?: number;
    temperatureInC?: number;
    timestamp: string;
}

export interface SensorHistoryData {
    timestamp: string;
    value: number;
}

export class SensorDatabase {
    private connection: cradle.Connection;
    private configuration: SensorDatabaseConfiguration;

    constructor(configuration: SensorDatabaseConfiguration) {
        this.configuration = configuration;
        this.connection = new (cradle.Connection)(configuration.host, configuration.port, {
            cache: true,
            raw: false,
            forceSave: true
        });
    }

    saveSensorData = (id: string, data: SensorData) => {
        const db = this.getDatabase();
        return When.promise<any>((resolve, reject) => {
            db.save(id, data, (err, res) => {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

    getTemperatureHistory = (filterBy: SensorGroupLevel, limit: number) => {
        return this.getHistory(filterBy, limit, this.configuration.tempuratureViewName);
    }

    getHumidityHistory = (filterBy: SensorGroupLevel, limit: number) => {
        return this.getHistory(filterBy, limit, this.configuration.humidityViewName);
    }

    private getHistory = (filterBy: SensorGroupLevel, limit: number, viewName: string) => {
        const db = this.getDatabase();
        const viewPath = this.configuration.designName + '/' + viewName;
        const options = {
            group: true,
            group_level: filterBy,
            limit: limit,
            descending: true
        };

        return When.promise<SensorHistoryData[]>((resolve, reject) => {
            db.view(viewPath, options, function (err, res) {
                if (res) {
                    const result: SensorHistoryData[] = [];
                    res.forEach((key, value) => {
                        let date = moment.utc(key);
                        result.push({
                            timestamp: date.toISOString(),
                            value: value
                        });
                    });
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    private getDatabase() {
        return this.connection.database(this.configuration.databaseName);
    }
}
