import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from './environment';

export interface SensorRecord {
    'timestamp': string;
    'value': number;
} 

export interface SensorHistoryResponse {
    data?: [SensorRecord];
}

export interface SensorHistoryRequestOption {
    filterBy: string;
    limit: number;
}

@Injectable()
export class SensorHistoryService {
    constructor(private http: Http) {}

    getTemperatureHistory(options: SensorHistoryRequestOption): Promise<SensorHistoryResponse> {
        return this.getSensorHistory(options, '/v1/sensor/history/temperature');
    }

    getHumidityHistory(options: SensorHistoryRequestOption): Promise<SensorHistoryResponse> {
        return this.getSensorHistory(options, '/v1/sensor/history/humidity'); 
    }

    private getSensorHistory(options: SensorHistoryRequestOption, path: string): Promise<SensorHistoryResponse> {
        let parameters = new URLSearchParams();
        parameters.append('filterBy', options.filterBy);
        parameters.append('limit', options.limit.toString());
        let host = this.getHost();
        return this.http.get(host + path, {        
            search: parameters
        }).toPromise()
        .then((response: Response) => {
            let body: SensorHistoryResponse = response.json() || {};            
            return body;
        });
    }

    private getHost(): string {
        let host = environment.apiHost;
        if (!host) {
            host = 'http://' + window.location.hostname + ':3000';
        }
        return host;
    }
}
