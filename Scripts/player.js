// Adding 500 Data Points
var map, markers = [];

var year = 2006;
var numberOfPlayers = 1;
var playerNumbers = [8793];

var markerUrls = [
    "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
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

var colors = new Rainbow();

function loadApi() {
    gapi.client.setApiKey('AIzaSyCdYpl52Jry_L7mZR8ryuLn2kvGdzGzZIM');
    var promise = gapi.client.load('fusiontables', 'v1');
    promise.then(function () {
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
function showMarkerInfo(event) {
    var contentString = "<b>Info:</b>" +
                        "<br/><b>Player Name:</b>" + this.get("name") +
                        "<br/><b>Hole Score:</b>" + this.get("score") +
                        "<br/><b>Year:</b>" + this.get("year");

    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

function setupMap() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        google.maps.event.addListener(markers[i], 'click', showMarkerInfo);
    }
    if (markers.length > 0) {
        map.setZoom(19);
        map.panTo(bounds.getCenter());
    }
};


function onDataFetched(response) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        extractMarkers(response.rows);
        setupMap();
    }
}

function removeOldMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        google.maps.event.clearListeners(markers[i], 'click');
    }
    markers = [];
}


function findPlayerNumber(num) {
    return playerNumbers.indexOf(num);
}

var bounds = new google.maps.LatLngBounds();

function extractMarkers(rows) {
    removeOldMarkers();
    bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            var markerPoint = new google.maps.LatLng(row[0], row[1]);

            bounds.extend(markerPoint);

            var thisHoleScore = row[2];
            var playerFirst = row[3];
            var playerLast = row[4];
            var playerNumber = findPlayerNumber(row[5]);
            var marker = new google.maps.Marker({
                position: markerPoint,
                title: playerFirst + " " + playerLast,
                map: map,
                icon: markerUrls[playerNumber]
            });
            marker.set("name",playerFirst + " " + playerLast)
            marker.set("score", thisHoleScore);
            marker.set("year", year);

            markers.add(marker);
        }
    }
}

function buildQuery() {
    var query = "select col0, col1, col2, col3, col4 from 1FMYNB5kuE8mRvGNZ-6_5TEVM3K0p6-TnwX2f1hW5";
    query += " where col5 in (";
    for (var i = 0; i < playerNumbers.length; i++) {
        query += playerNumbers[i] + ",";
    }
    query = query.substring(0, query.length - 1);
    query += ") and col6 = " + year; 
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