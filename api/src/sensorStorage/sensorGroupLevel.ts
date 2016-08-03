import _ = require('lodash');

export enum SensorGroupLevel {
    Year = 1,
    Month = 2,
    Day = 3,
    Hour = 4,
    Minute = 5,
    Second = 6,
    Unknown = 0
}

export function createSensorGroupLevel(filterBy: String = ''): SensorGroupLevel {
    const map = {
        'year': SensorGroupLevel.Year,
        'month': SensorGroupLevel.Month,
        'day': SensorGroupLevel.Day,
        'hour': SensorGroupLevel.Hour,
        'minute': SensorGroupLevel.Minute,
        'second': SensorGroupLevel.Second
    };

    const key = _.isString(filterBy) ? filterBy.toLowerCase() : '';
    return _.has(map, key) ? map[key] : SensorGroupLevel.Unknown;
} 