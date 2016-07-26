import express = require('express');
import _ = require('lodash');

import { SensorDatabase, SensorDatabaseConfiguration } from './sensorDatabase';
import { loadConfiguration } from './configurationManager';

//TODO: create database if not already 

var configuration = loadConfiguration();


var app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

/*
    parameters 
    filterBy: String // "Year, Month, Day, Hour, Minute, Second",
    limit: Number // "0, 1, 2, 3"
*/

app.get('/v1/sensor/history/temperature', function(request, response) {
    var query = request.query;
    if (_.isString(query.filterBy) && _.isNumber(query.limit)) {
        
    } else {
        
    }
    var storage = new SensorDatabase(configuration.couchDb);
    storage.getTemperatureHistory()
        .tap((data) => {
            response.send({
                data: data
            });
        });
        //Close db connection
});

app.get('/v1/sensor/history/humidity', function(request, response) {
    var storage = new SensorDatabase(configuration.couchDb);
    storage.getHumidityHistory()
        .tap((data) => {
            response.send({
                data: data
            })
        });
});

/*
    return current temperature & humidit
app.get('/v1/sensor', function(req, res) {

});

app.post('/v1/sensor', function(req, res) {

})
*/

app.listen(configuration.apiPort, function () {
	console.log("Service Running");
});

