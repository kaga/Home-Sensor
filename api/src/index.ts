import express = require('express');
import _ = require('lodash');
import bodyParser = require('body-parser')

import { SensorDatabase, SensorDatabaseConfiguration } from './sensorStorage/sensorDatabase';
import { createSensorGroupLevel } from './sensorStorage/sensorGroupLevel';
import { loadConfiguration } from './configurationManager';

//TODO: create database if not already 
var configuration = loadConfiguration();
console.log("Application Config: " + JSON.stringify(configuration), null, 4);

var storage = new SensorDatabase(configuration.couchDb);
var app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
app.use(bodyParser.json());

/*
    parameters 
    filterBy: String // "Year, Month, Day, Hour, Minute, Second",
    limit: Number // "0, 1, 2, 3"
*/
app.get('/v1/sensor/history/temperature', function(request, response) {
    var query = request.query;
    var filterBy = createSensorGroupLevel(query.filterBy);
    var limit = query.limit;

    storage.getTemperatureHistory(filterBy, limit)
        .tap((data) => {
            response.send({
                data: data
            });
        })
        .catch((error) => {
            response.status(500).json({ error: error });
        })
        //Close db connection
});

app.get('/v1/sensor/history/humidity', function(request, response) {
    var query = request.query;
    var filterBy = createSensorGroupLevel(query.filterBy);
    var limit = query.limit;
        
    storage.getHumidityHistory(filterBy, limit)
        .tap((data) => {
            response.send({
                data: data
            })
        })
        .catch((error) => {
            response.status(500).json({ error: error });
        })
});

app.put('/v1/sensor/:id', function(request, response) {
    let id = request.params.id;
    let body = request.body;
    
    storage.saveSensorData(id, body)
        .tap((data) => {
            console.log(data);            
            response.send({ data: data})
        }) 
        .catch((error) => {
            console.error(error);
            response.status(500).json({ error: error });
        })
});

app.listen(configuration.apiPort, function () {
	console.log("Service Running");
});