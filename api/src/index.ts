import express = require('express');
import bodyParser = require('body-parser');

import { SensorDatabase } from './sensorStorage/sensorDatabase';
import { createSensorGroupLevel } from './sensorStorage/sensorGroupLevel';
import { loadConfiguration } from './configurationManager';

// TODO: create database if not already 
const configuration = loadConfiguration();
console.log('Application Config: ' + JSON.stringify(configuration), null, 4);

const storage = new SensorDatabase(configuration.couchDb);
const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});
app.use(bodyParser.json());

/*
    parameters 
    filterBy: String // 'Year, Month, Day, Hour, Minute, Second',
    limit: Number // '0, 1, 2, 3'
*/
app.get('/v1/sensor/history/temperature', function (request, response) {
    const query = request.query;
    const filterBy = createSensorGroupLevel(query.filterBy);
    const limit = query.limit;

    storage.getTemperatureHistory(filterBy, limit)
        .tap((data) => responseWithData(response, data))
        .catch((error) => responseWithServerError(response, error));
    // TODO:Close db connection
});

app.get('/v1/sensor/history/humidity', function (request, response) {
    const query = request.query;
    const filterBy = createSensorGroupLevel(query.filterBy);
    const limit = query.limit;

    storage.getHumidityHistory(filterBy, limit)
        .tap((data) => responseWithData(response, data))
        .catch((error) => responseWithServerError(response, error));
});

app.put('/v1/sensor/:id', function (request, response) {
    const id = request.params.id;
    const body = request.body;

    storage.saveSensorData(id, body)
        .tap((data) => responseWithData(response, data))
        .catch((error) => responseWithServerError(response, error));
});

function responseWithData(response, data: any) {
    console.log(data);
    response.json({
        data: data
    });
}

function responseWithServerError(response, error) {
    console.error(error);
    response.status(500).json({
        error: error
    });
}

app.listen(configuration.apiPort, function () {
    console.log('Service Running');
});