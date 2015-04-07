// Adding 500 Data Points
var map, polygons;
var rounds, years, hole, shot, scores;

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
    promise.then(function() {
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
}

function setupMap(map) {
    for (var i = 0; i < polygons.length; i++) {
        var polygon = new google.maps.Polygon(polygons[i]);
        polygon.setMap(map);
    }
};


function onDataFetched(response) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        polygons = extractPolygons(response.rows);
        setupMap(map);
    }
}

function extractPolygons(rows) {
    var polygons = [];
    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            var polygonPoints = [
            new google.maps.LatLng(row[0], row[1]),
            new google.maps.LatLng(row[2], row[3]),
            new google.maps.LatLng(row[4], row[5]),
            new google.maps.LatLng(row[6], row[7])
            ];
            var score = row[8];
            var color = colors[Math.floor(score)];
                polygons.push({
                    paths: polygonPoints,
                    strokeColor: "000000",
                    strokeOpacity: .75,
                    strokeWeight: 1,
                    fillColor: color,
                    fillOpacity: .5
                });
        }
    }
    return polygons;
}

function buildQuery() {
    var query = "select col0, col1, col2, col3, col4, col5, col6, col7, col8 from 1y-4RAe-ep4sZ-_iD8HKOpFnKJq00ZD1rVVofUmSu";
    return query;
};

function setDataToUse() {
    polygons = [];
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildQuery() });
        request.execute(function(response) {
            onDataFetched(response);
        });
}

google.maps.event.addDomListener(window, 'load', loadApi);