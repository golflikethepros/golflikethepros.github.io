// Adding 500 Data Points
var map, dataToUse, heatmap;
var rounds, years, hole, shot, scores;
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
    setInitialValues();
    var map = createMap();
    setDataToUse();
    setCurrentScores(0);
    setupMap(map);
}

function setupMap(map) {
    if (dataToUse.length > 0) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: dataToUse,
            radius: 10,
            maxIntensity: 2
        });
        heatmap.setMap(map);
    }
};


function onDataFetched(response) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        dataToUse = extractLocations(response.rows);
        setupMap(map);
        setCurrentDataHtml();
    }
}

function extractLocations(rows) {
    var locations = [];
    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            var lat = row[0];
            var lng = row[1];
            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                var latLng = new google.maps.LatLng(lat, lng);
                locations.push(latLng);
            }
        }
    }
    return locations;
}

function buildQuery() {
    var query = "select col4, col5 from 1TFWBEKj6Xf-M5xeCcgNgl3SkTvb_lhVPy9riUzXO where";
    query += " col0 in (";
    for (var i = 0; i < years.length; i++) {
        query += "'" + (years[i] + 2006) + "',";
    }
    query = query.substring(0, query.length - 1);
    query += ") and";
    query += " col1 in (";
    for (var j = 0; j < rounds.length; j++) {
        query += (rounds[j] + 1) + ",";
    }
    query = query.substring(0, query.length - 1);
    query += ") ";
    query += "and col2 = " + (hole+1);
    query += " and col3 = " + (shot+1);
    query += " and col6 >= " + (scores[0]+1) + " and " + "col6 <= " + (scores[scores.length - 1]+1);
    return query;
};

function setDataToUse() {
    dataToUse = [];
    if (validData()) {
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildQuery() });
        request.execute(function(response) {
            onDataFetched(response);
        });
    }
}
google.maps.event.addDomListener(window, 'load', loadApi);