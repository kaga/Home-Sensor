import nconf = require('nconf');
import _ = require('lodash');

interface Configuration {
    reportApi?: {
        host: string;
        path: string;
    };
    sensor: {
        reportInterval: number,
        tag: string;
        source: string;
    };
}

/*
     'htu21d' or 'mock'
*/
export function loadConfiguration(): Configuration {
    nconf.env().argv();
    nconf.file({
        file: 'config.json'
    });

    nconf.defaults({
        'report_api': false,
        'report_api_host': 'http://localhost',
        'report_api_path': '/v1/sensor',
        'report_interval_seconds': 60,
        'sensor_source': 'htu21d',
        'tag': 'unknown'
    });

    let config: Configuration = {
        sensor: {
            reportInterval: nconf.get('report_interval_seconds'),
            tag: nconf.get('tag'),
            source: nconf.get('sensor_source')
        }
    };
    let host = nconf.get('report_api_host');
    let path = nconf.get('report_api_path');

    if ((nconf.get('report_api') === 'true' || nconf.get('report_api') === true) && _.isString(host) && _.isString(path)) {
        config.reportApi = {
            host: host,
            path: path
        };
    }
    return config;
}
