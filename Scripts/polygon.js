// Adding 500 Data Points
var map, polygons = [];
var hole = 0;
var gradients = {
    3: new Rainbow(),
    4: new Rainbow(),
    5: new Rainbow()
};
var pars = [
    4,
    5,
    3,
    4,
    4,
    4,
    4,
    3,
    5,
    4,
    5,
    4,
    3,
    4,
    4,
    5,
    3,
    4
];
var colors = ["#0001E5", "#0071E0", "#00DBD9", "#00D669", "#02D200", "#69CD00", "#C35E00", "#BF0003"];

var centers = [
    new google.maps.LatLng(30.202304, -81.395295),
    new google.maps.LatLng(30.201720, -81.396194),
    new google.maps.LatLng(30.199716, -81.397454),
    new google.maps.LatLng(30.197231, -81.398200),
    new google.maps.LatLng(30.195037, -81.396186),
    new google.maps.LatLng(30.193380, -81.397668),
    new google.maps.LatLng(30.192231, -81.397023),
    new google.maps.LatLng(30.192359, -81.392582),
    new google.maps.LatLng(30.195313, -81.394050),
    new google.maps.LatLng(30.199874, -81.389663),
    new google.maps.LatLng(30.199324, -81.389044),
    new google.maps.LatLng(30.199078, -81.387457),
    new google.maps.LatLng(30.200295, -81.386604),
    new google.maps.LatLng(30.196990, -81.387453),
    new google.maps.LatLng(30.196843, -81.390159),
    new google.maps.LatLng(30.195806, -81.391035),
    new google.maps.LatLng(30.194632, -81.390829),
    new google.maps.LatLng(30.197012, -81.392888)
];

function loadApi() {
    gapi.client.setApiKey('AIzaSyCdYpl52Jry_L7mZR8ryuLn2kvGdzGzZIM');
    var promise = gapi.client.load('fusiontables', 'v1');
    promise.then(function () {
        
        gradients[3].setSpectrum('blue', 'white', 'red');
        gradients[3].setNumberRange(4, 10);
        gradients[4].setSpectrum('blue', 'white', 'red');
        gradients[4].setNumberRange(2, 10);
        gradients[5].setSpectrum('blue', 'white', 'red');
        gradients[5].setNumberRange(0, 10);

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
    var contentString = "<b>Average Score:</b> " + (10-this.get("Score"));
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

function setupMap() {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(map);
        google.maps.event.addListener(polygons[i], 'click', showAverageScore);
        
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

var latSum = 0;
var longSum = 0;
var latCount = 0;
var longCount = 0;

function extractPolygons(rows) {
    unsetOldPolygons();
    latSum = 0;
    longSum = 0;
    latCount = 0;
    longCount = 0;
    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            var polygonPoints = [
            new google.maps.LatLng(row[0], row[1]),
            new google.maps.LatLng(row[2], row[3]),
            new google.maps.LatLng(row[4], row[5]),
            new google.maps.LatLng(row[6], row[7])
            ];

            latSum += row[0] + row[2] + row[4] + row[6];
            latCount += 4;
            latSum += row[1] + row[3] + row[5] + row[7];
            latCount += 4;

            var score = 10 - (10 / row[8]);
            var color = "#" + gradients[pars[hole]].colourAt(score);
            var polygon = new google.maps.Polygon({
                paths: polygonPoints,
                strokeColor: "000000",
                strokeOpacity: .5,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: .5
            });
            polygon.set("Score", score);
            polygons.push(polygon);


        }
    }
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