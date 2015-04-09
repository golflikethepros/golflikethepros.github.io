// Adding 500 Data Points
var polygons = [];
var shotGridHole = 0;
var abovePar = new Rainbow();
var belowPar = new Rainbow();

function loadShotGrid() {
    abovePar.setSpectrum('white', 'red');
    belowPar.setSpectrum('blue', 'white');
    initializeGrid();
}

function initializeGrid() {
    setGridDataToUse();
    setupGridMap(map);
    infoWindow = new google.maps.InfoWindow();
}


function showAverageScore(event) {
    var score = (10-this.get("score"));
    score = +score.toFixed(2);
    var contentString = "<b>Average Score:</b> " + score;
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

function setupGridMap() {
    for (var i = 0; i < polygons.length; i++) {
        if (polygons[i].get("score") >= (10-pars[shotGridHole])) {
            polygons[i].setOptions({
                fillColor: "#" + abovePar.colourAt(polygons[i].get("score"))
            });
        } else {
            polygons[i].setOptions({
                fillColor: "#" + belowPar.colourAt(polygons[i].get("score"))
            });
        }
        polygons[i].setMap(map);
        google.maps.event.addListener(polygons[i], 'click', showAverageScore);
    }
    if (polygons.length > 0) {
        map.setZoom(19);
        map.panTo(bounds.getCenter());
    }
//    if (latSum == 0) {
//        map.setCenter(new google.maps.LatLng(30.196842, -81.394031));
//    } else {
//        var lat = latSum / latCount;
//        var long = longSum / longCount;
//        map.setCenter(new google.maps.LatLng(lat, long));
//    }
};

function onGridDataFetched(response) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        extractPolygons(response.rows);
        setupGridMap();
    }
}

function unsetOldPolygons() {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
        google.maps.event.clearListeners(polygons[i], 'click');
    }
    polygons = [];
}


function extractPolygons(rows) {
    unsetOldPolygons();
    bounds = new google.maps.LatLngBounds();
    var maxAvg = -5000;
    var minAvg = 5000;
    if (!rows) {
        return;
    }
    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            var polygonPoints = [
            new google.maps.LatLng(row[0], row[1]),
            new google.maps.LatLng(row[2], row[3]),
            new google.maps.LatLng(row[4], row[5]),
            new google.maps.LatLng(row[6], row[7])
            ];

            for (var j = 0; j < polygonPoints.length; j++) {
                bounds.extend(polygonPoints[j]);
            }

            var score = 10 - (10 / row[8]);
            minAvg = score < minAvg ? score : minAvg;
            maxAvg = score > maxAvg ? score : maxAvg;

            var polygon = new google.maps.Polygon({
                paths: polygonPoints,
                strokeColor: "#000000",
                strokeOpacity: .5,
                strokeWeight: 1,
                fillColor: "#000000",
                fillOpacity: .5
            });

            polygon.set("score", score);
            polygons.push(polygon);
        }
    }
        abovePar.setNumberRange((10-pars[shotGridHole]), maxAvg);
        belowPar.setNumberRange(minAvg, (10-pars[shotGridHole]));
}

function buildGridQuery() {
    var query = "select col0, col1, col2, col3, col4, col5, col6, col7, col8 from 1jLt5HI9FJmFoN9_DqQdQ4HoYPdw_eepDppWyBu34";
    query += " where col9 = " + (shotGridHole+1);
    return query;
};

function setGridDataToUse() {
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildGridQuery() });
        request.execute(function(response) {
            onGridDataFetched(response);
        });
}

function updateShotGridHoles(holeNum) {
    shotGridHole = holeNum;
    setGridDataToUse();
    setupGridMap();
}

google.maps.event.addDomListener(window, 'load', loadApi);