var agent = require('superagent');
/*
interface SensorHistoryRequest {
    host: string;
    port: string;
    path: string;
    query: {
        filterBy: string; // "Year, Month, Day, Hour, Minute, Second",
        limit: number; // "0, 1, 2, 3"
    }
}



function performRequest(request: SensorHistoryRequest) {

    agent.get('http://room1pi.local:5984/livingroom_temp_humi/_design/livingroom_humidity/_view/' + title)
    .query({
        group: true,
        group_level: 4,
        limit: 24,
        descending: true
    })
    .set('Connection', 'close')
    .set('Content-Type', 'application/json')
    .end(function (err, res) {
        //debugger;
        if (res.ok) {
            var body = JSON.parse(res.text);
            console.log(body);
            updateChart(canvasClass, title, body.rows);
        }
    })
}
*/