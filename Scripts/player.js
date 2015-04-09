// Adding 500 Data Points
var map;

var currentPlayerInfo = [];

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
        getAllPlayerNames();
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

function setupMap(newMarkers) {
    for (var i = 0; i < newMarkers.length; i++) {
        newMarkers[i].setMap(map);
        google.maps.event.addListener(newMarkers[i], 'click', showMarkerInfo);
    }
};


function onDataFetched(response, i) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        var spot = extractMarkers(response.rows);
        setupMap(currentPlayerInfo[spot]["markers"]);
    }
}

function removeOldMarkers(markerList) {
    for (var i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
        google.maps.event.clearListeners(markerList[i], 'click');
    }
}

function findSpot(num, yr, rnd) {
    for (var i = 0; i < currentPlayerInfo.length; i++) {
        if (currentPlayerInfo[i]["playerNumber"] == num) {
            if (currentPlayerInfo[i]["year"] == yr) {
                if (currentPlayerInfo[i]["round"] == rnd) {
                    return i;
                }
            }
        }
    }
    return 0;
}

function extractMarkers(rows) {
    var spot = -1;
    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            var markerPoint = new google.maps.LatLng(row[0], row[1]);

            var thisHoleScore = row[2];
            var playerFirst = row[3];
            var playerLast = row[4];
            if (spot === -1) {
                spot = findSpot(row[5], row[6], row[7]);
            }
            var marker = new google.maps.Marker({
                position: markerPoint,
                title: playerFirst + " " + playerLast,
                map: map,
                icon: markerUrls[spot]
            });
            marker.set("name", playerFirst + " " + playerLast);
            marker.set("score", thisHoleScore);
            marker.set("year", currentPlayerInfo[spot]["year"]);
            marker.set("round", currentPlayerInfo[spot]["round"]);
            currentPlayerInfo[spot]["markers"].push(marker);
        }
    }
    return spot;
}

function buildQuery(i) {
    var query = "select col0, col1, col2, col3, col4, col5, col6, col7 from 1f6gpPxDPBkRCvuFinDgE2v8q1BEaVAesyXlhy34v";
    query += " where col5 = " + currentPlayerInfo[i]["playerNumber"];
    query += " and col6 = " + currentPlayerInfo[i]["year"];
    query += " and col7 = " + currentPlayerInfo[i]["round"];

    return query;
};

/*
 * May end up calling this PER player added instead of for all players, probably makes more sense 
 * because we will be making extra calls if not.
 */
var currentPlayerNumber = 0;

function addNewData() {
    var request = gapi.client.fusiontables.query.sqlGet({ sql: buildQuery(currentPlayerNumber) });
    request.execute(function (response) {
        onDataFetched(response);
    });
    currentPlayerNumber++;
}

function resetData() {
    for (var i = 0; i < currentPlayerInfo.length; i++) {
        removeOldMarkers(i);
    }
    currentPlayerNumber = 0;
}

function removePlayer(index) {
    removeOldMarkers(index);
}

function setDataToUse() {
    for (var i = 0; i < currentPlayerInfo.length; i++) {
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildQuery(i) });
        request.execute(function (response) {
            onDataFetched(response);
        });
    }
}

function getAllData(response) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        createInputs(response.rows);
    }
}

function createInputs(rows) {
    for (var i = 0; i < rows.length; ++i) {
        var row = rows[i];
        if (row[0]) {
            for (var j = 1; j < 6; j++) {
                var option = document.createElement("option");
                option.text = row[1] + ", " + row[0];
                option.value = row[2];
                document.getElementById("player" + j).appendChild(option);
            }
        }
    }
}

function addYear(frmNum, rows) {
    var year = document.getElementById("year" + frmNum);
    year.innerHTML = "<option value=\"-1\">Select Year</option>";
    if (!row.length) {
        return;
    }
    for (var a = 0; a < rows.length; a++) {
        var row = rows[a];
        if (row[0]) {
            var yearOpt = document.createElement("option");
            yearOpt.text = row[0];
            yearOpt.value = row[0];
            year.appendChild(yearOpt);
        }
    }
}

function updateYear(frmNum, playerNum) {
    var request = gapi.client.fusiontables.query.sqlGet({ sql: "select col6 from 1f6gpPxDPBkRCvuFinDgE2v8q1BEaVAesyXlhy34v where col5 = "+ playerNum + " group by col6" });
    request.execute(function (response) {
        addYear(frmNum, response.rows);
    });
}

function addRound(frmNum, rows) {
    var round = document.getElementById("rd" + frmNum);
    round.innerHTML = "<option value=\"-1\">Select Round</option>";
    for (var a = 0; a < rows.length; a++) {
        var row = rows[a];
        if (row[0]) {
            var roundOpt = document.createElement("option");
            roundOpt.text = "Round " + row[0];
            roundOpt.value = row[0];
            round.appendChild(roundOpt);
        }
    }
}

function updateRound(frmNum, year) {
    var playerNum = document.getElementById("player" + frmNum).value;
    var request = gapi.client.fusiontables.query.sqlGet({ sql: "select col7 from 1f6gpPxDPBkRCvuFinDgE2v8q1BEaVAesyXlhy34v where col5 = " + playerNum + " and col6 = " + year + " group by col7" });
    request.execute(function (response) {
        addRound(frmNum, response.rows);
    });
}

function getAllPlayerNames() {
    var request = gapi.client.fusiontables.query.sqlGet({ sql: "select col3, col4, col5 from 1f6gpPxDPBkRCvuFinDgE2v8q1BEaVAesyXlhy34v group by col3, col4, col5 order by col4" });
    request.execute(function (response) {
        getAllData(response);
    });
}

function doPlayerStuff() {
    currentPlayerInfo = [];
    for (var i = 1; i < 6; i++) {
        var player = parseInt(document.getElementById("player" + i).value);
        var year = parseInt(document.getElementById("year" + i).value);
        var round = parseInt(document.getElementById("rd" + i).value);
        if (player === -1 || year === -1 || round === -1) {
            continue;
        }
        currentPlayerInfo.push({
            "playerNumber": player,
            "year": year,
            "round": round,
            "markers": []
        });
    }
    setDataToUse();
}

google.maps.event.addDomListener(window, 'load', loadApi);