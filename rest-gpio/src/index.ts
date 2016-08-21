import bodyParser = require('body-parser');

import * as express from 'express';
import * as _ from 'lodash';
import * as When from 'when';

import { PiGpioController } from './gpio/piGpioController';
import { MockGpioController } from './gpio/mockGpioController';
import { GpioController, GpioState } from './gpio/gpioController';

import { loadConfiguration, saveGpioSchedule } from './configurationManager';
import { Schedule } from './schedule/schedule';
import { ScheduleController } from './scheduleController';

const gpioConfigurations = loadConfiguration();
const gpioControllers = _.map(gpioConfigurations.configs, (config) => {
    const gpioController = new PiGpioController(config);
    //const gpioController = new MockGpioController(config);
    const encodedSchedule = config.encodedSchedule;
    let schedule: Schedule;
    if (encodedSchedule) {
        schedule = new Schedule(encodedSchedule);
    }
    return new ScheduleController(gpioController, schedule);
});
const gpioControllersLookup = _.keyBy(gpioControllers, (controllers) => controllers.getGpioController().bcmPinNumber);

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});
app.use(bodyParser.json());

app.get('/v1/gpio/:pinNumber', function (request, response) {
    const pinNumber = parseInt(request.params.pinNumber);
    findGpioController(pinNumber)
        .then((controller) => controller.readPin())
        .tap((state) => responseWithGpioState(state, response));
});

app.post('/v1/gpio', function (request, response) {
    const body = request.body;

    const bcmPinNumber = body['bcmPinNumber'];
    const newState = body['state'];

    findGpioController(bcmPinNumber)
        .then((controller) => controller.writeToPin(newState))
        .tap((state) => responseWithGpioState(state, response));
});

app.put('/v1/schedule', function (request, response) {
    const body = request.body;

    const bcmPinNumber = body['bcmPinNumber'];
    const timeslots = body['timeslots'];

    const schedule = new Schedule();
    schedule.setTimeslots(timeslots);

    findController(bcmPinNumber)
        .then((controller) => {
            controller.updateSchedule(schedule);
            saveGpioSchedule(bcmPinNumber, schedule.toJSON());
            return controller.getGpioController().readPin();
        })        
        .tap((state) => responseWithGpioState(state, response));
});

app.listen(3000, function () {
    console.log('Service Running');
});

function responseWithGpioState(state: GpioState, response) {
    response.send({
        data: {
            timestamp: state.timestamp.toISOString,
            state: state.state,
            bcmPinNumber: state.bcmPinNumber
        }
    });
}

function findGpioController(pinNumber: number): When.Promise<GpioController> {
    return findController(pinNumber)
        .then((controller) => controller.getGpioController());
}

function findController(pinNumber: number): When.Promise<ScheduleController> {
    if (_.has(gpioControllersLookup, pinNumber)) {
        const controller = gpioControllersLookup[pinNumber];
        return When.resolve(controller);
    }
    return When.reject<ScheduleController>('gpio controller for pin ' + pinNumber + ' not found');
}
