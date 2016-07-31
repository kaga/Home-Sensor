import { Component, OnInit, NgZone } from '@angular/core';
import { SensorHistoryService, SensorRecord, SensorHistoryRequestOption } from '../SensorHistoryService';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

import * as _ from 'lodash';
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
    zone: NgZone;
    sensorHistorySetting: SensorHistoryRequestOption = {
        filterBy: 'hour',
        limit: 24
    };

    ngOnInit() {
        this.updateSensor();
    }

    constructor(private sensorHistoryService: SensorHistoryService) {
        this.zone = new NgZone({ enableLongStackTrace: false });
    }

    onHistoryGroupByButtonDown(name: string) {
        this.sensorHistorySetting.filterBy = name;
        this.updateSensor();
    }

    updateSensor() {
        this.sensorHistoryService.getTemperatureHistory(this.sensorHistorySetting)
            .then((response) => {
                this.zone.run(() => {
                    this.updateChart('temperatureChart', 'temperature', response.data);
                });
            });
    }

    updateChart(canvasClass, title, rows: [SensorRecord]) {
        let labels = _.map(rows, function (row) {
            return row.timestamp;
        }).reverse();
        let values = _.map(rows, function (row) {
            return row['value'];
        }).reverse();
        let ctx: any = document.getElementById(canvasClass);
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
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
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}
