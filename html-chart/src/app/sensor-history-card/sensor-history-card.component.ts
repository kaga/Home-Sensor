import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { SensorHistoryService, SensorRecord, SensorHistoryRequestOption } from '../SensorHistoryService';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as When from 'when';
import * as Chart from 'chart.js';


@Component({
    moduleId: module.id,
    selector: 'app-sensor-history-card',
    templateUrl: 'sensor-history-card.component.html',
    styleUrls: ['sensor-history-card.component.css'],
    providers: [SensorHistoryService],
    directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES]
})

export class SensorHistoryCardComponent implements OnInit {
    @ViewChild('sensorHistoryCanvas') sensorHistoryCanvas: ElementRef;
    zone: NgZone;
    sensorHistorySetting: SensorHistoryRequestOption = {
        filterBy: 'hour',
        limit: 24
    };
    title: string = '';
    private chart: any;

    ngOnInit() {
        this.updateSensor();
    }

    ngAfterViewInit() {
       
    }

    constructor(private sensorHistoryService: SensorHistoryService) {
        this.zone = new NgZone({ enableLongStackTrace: false });
    }

    onHistoryGroupByButtonDown(name: string) {
        this.sensorHistorySetting.filterBy = name;
        this.updateSensor();
    }

    updateSensor() {
        When.all([
            this.sensorHistoryService.getHumidityHistory(this.sensorHistorySetting),
            this.sensorHistoryService.getTemperatureHistory(this.sensorHistorySetting)
        ])
            .spread((humidityHistroy, temperatureHistory) => {
                this.zone.run(() => {
                    this.updateChart('temperatureChart', 'temperature', humidityHistroy.data.reverse(), temperatureHistory.data.reverse());
                });
            })
            .catch((error) => {
                debugger;
            });
    }

    updateChart(canvasClass: string, titl: string, humidityHistroy: [SensorRecord], temperatureHistory: [SensorRecord]) {
        let labels = _.map(humidityHistroy, (row) => moment(row.timestamp));
        let context: any = this.sensorHistoryCanvas.nativeElement;
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = Chart.Line(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    this.createDataSet(SensorHistoryType.Humidity, humidityHistroy),
                    this.createDataSet(SensorHistoryType.Temperature, temperatureHistory)
                ]
            },
            options: {
                tooltips: {
                    enabled: true                    
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        ticks: {
                            autoSkip: true,
                            fontSize: 14,
                            maxRotation: 45
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            autoSkip: true,
                            beginAtZero: true,
                            fontSize: 14,
                        }
                    }]
                }
            }
        });
    }

    createDataSet(sensorType: SensorHistoryType, sensorData: [SensorRecord]): any {
        let values = _.map(sensorData, (row) => row.value.toPrecision(3));

        let settings: any = {}
        switch (sensorType) {
            case SensorHistoryType.Humidity:
                return {
                    label: 'humidity',
                    data: values,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#03A9F4',
                    borderColor: '#0288D1',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#0288D1',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#0288D1',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 10,
                    spanGaps: false,
                }
            case SensorHistoryType.Temperature:
                return {
                    label: 'temperature',
                    data: values,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 10,
                    spanGaps: false,
                }
        }
        return settings;
    }
}

enum SensorHistoryType {
    Temperature = 0,
    Humidity = 1
}


