import cradle = require('cradle');
import _ = require('lodash');
import moment = require('moment');
import When = require('when');

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

    saveSensorData = (data: SensorData) => {
        //var db = this.getDatabase();
    }

    getTemperatureHistory = () => {
        return this.getHistory(this.configuration.tempuratureViewName);
    }

    getHumidityHistory() {
        return this.getHistory(this.configuration.humidityViewName);
    }

    private getHistory = (viewName) => {
        var db = this.getDatabase();
        var viewPath = this.configuration.designName + '/' + viewName;
        var options = {
            group: true,
            group_level: 4,
            limit: 24,
            descending: true
        }

        return When.promise<SensorHistoryData[]>((resolve, reject) => {
            db.view(viewPath, options, function (err, res) {
                if (res) {
                    var result: SensorHistoryData[] = [];
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
