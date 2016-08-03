import nconf = require('nconf');

export function loadConfiguration() {
    nconf.env().argv();
    nconf.file({
        file: 'config.json'
    });

    nconf.defaults({
        'couchdb_host': 'http://localhost',
        'couchdb_port': 5984,
        'couchdb_database_name': 'livingroom_temp_humi',
        'couchdb_design_name': 'livingroom_humidity',
        'couchdb_temperature_view_name': 'temperature',
        'couchdb_humidity_view_name': 'humidity',
        'api_port': 3000
    });

    return {
        couchDb: {
            host: nconf.get('couchdb_host'),
            port: nconf.get('couchdb_port'),
            databaseName: nconf.get('couchdb_database_name'),
            designName: nconf.get('couchdb_design_name'),
            tempuratureViewName: nconf.get('couchdb_temperature_view_name'),
            humidityViewName: nconf.get('couchdb_humidity_view_name')
        },
        apiPort: nconf.get('api_port')
    };
}