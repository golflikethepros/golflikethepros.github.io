// Adding 500 Data Points
var map, polygons = [];
var hole = 0;
var gradient = new Rainbow();

function loadApi() {
    gapi.client.setApiKey('AIzaSyCdYpl52Jry_L7mZR8ryuLn2kvGdzGzZIM');
    var promise = gapi.client.load('fusiontables', 'v1');
    promise.then(function () {
        
        gradient.setSpectrum('blue', 'white', 'red');
        initialize();
    });
}

function createMap() {
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(30.196842, -81.394031),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: false,
        minZoom: 16,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    return map;
}

function initialize() {
    var map = createMap();
    setDataToUse();
    setupMap(map);
    infoWindow = new google.maps.InfoWindow();
}
var infoWindow;

function showAverageScore(event) {
    var contentString = "<b>Average Score:</b> " + (10-this.get("score"));
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

function setupMap() {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setOptions({
            fillColor: gradient.getColourAt(polygons[i].get("score"))
        });
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


function onDataFetched(response) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        extractPolygons(response.rows);
        setupMap();
    }
}

function unsetOldPolygons() {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
        google.maps.event.clearListeners(polygons[i], 'click');
    }
    polygons = [];
}

var bounds = new google.maps.LatLngBounds();


function extractPolygons(rows) {
    unsetOldPolygons();
    bounds = new google.maps.LatLngBounds();
    var minAvg = 5000;
    var maxAvg = -5000;
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
    gradient.setNumberRange(minAvg, maxAvg);
}

function buildQuery() {
    var query = "select col0, col1, col2, col3, col4, col5, col6, col7, col8 from 1jLt5HI9FJmFoN9_DqQdQ4HoYPdw_eepDppWyBu34";
    query += " where col9 = " + (hole+1);
    return query;
};

function setDataToUse() {
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildQuery() });
        request.execute(function(response) {
            onDataFetched(response);
        });
}

function updateHoles(holeNum) {
    hole = holeNum;
    setDataToUse();
    setupMap();
}


google.maps.event.addDomListener(window, 'load', loadApi);