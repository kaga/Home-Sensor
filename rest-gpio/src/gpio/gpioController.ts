import { Promise } from 'when';
import * as _ from 'lodash';

export interface GpioState {
    timestamp: Date;
    bcmPinNumber: number;
    state: boolean;
}

export interface GpioController {
    bcmPinNumber: number;

    readPin(): Promise<GpioState>;
    writeToPin(newState: boolean): Promise<GpioState>;
}

export interface GpioConfiguration {
    bcmPinNumber: number;
    state: boolean;
    activeLow?: boolean;
    description?: string;
    apiPathAlias?: string;
    encodedSchedule?: number;
}

export function validateGpioConfigurations(configurations: GpioConfiguration[]): GpioConfiguration[] {
    return _.filter(configurations, (config) => {
        const validActiveLow = _.has(config, 'activeLow') ? _.isBoolean(config.activeLow) : true;
        const validDescription = _.has(config, 'description') ? _.isString(config.description) : true;
        const validApiPathAlias = _.has(config, 'apiPathAlias') ? _.isString(config.apiPathAlias) : true;
        const validGpioConfig = (_.isNumber(config.bcmPinNumber) && _.isBoolean(config.state));
        return validActiveLow && validDescription && validApiPathAlias && validGpioConfig;
    });
}
