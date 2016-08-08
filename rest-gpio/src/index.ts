import * as express from 'express';
import * as _ from 'lodash';
import * as When from 'when';

import { PiGpioController } from './gpio/piGpioController';
import { GpioController, GpioState } from './gpio/gpioController';

import { loadConfiguration } from './configurationManager';

const gpioConfigurations = loadConfiguration();
const gpioControllers = _.map(gpioConfigurations, (config) => new PiGpioController(config));
const gpioControllersLookup = _.keyBy(gpioControllers, (controller) => controller.bcmPinNumber);

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

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
    if (_.has(gpioControllersLookup, pinNumber)) {
        const controller = gpioControllersLookup[pinNumber];
        return When.resolve(controller);
    }
    return When.reject<GpioController>('gpio controller for pin ' + pinNumber + ' not found');
}