import { Component, OnInit } from '@angular/core';
import { SensorHistoryCardComponent } from './sensor-history-card/sensor-history-card.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [SensorHistoryCardComponent]
})
export class AppComponent implements OnInit {
    sensorHistories = [1];

    ngOnInit() {
    }

}
