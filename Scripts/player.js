﻿// Adding 500 Data Points

var currentPlayerInfo = [];

var markerUrls = [
    "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
];

function loadPlayer() {
    getAllPlayerNames();
    var famousPlayers = [
        {
            "playerNumber": 24502,
            "year": 2004,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 1381,
            "year": 2005,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 6004,
            "year": 2006,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 1810,
            "year": 2007,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 21209,
            "year": 2008,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 21528,
            "year": 2009,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 23135,
            "year": 2010,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 24357,
            "year": 2011,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 23108,
            "year": 2012,
            "round": 4,
            "markers": []
        },
        {
            "playerNumber": 8793,
            "year": 2013,
            "round": 4,
            "markers": []
        },

    ];
    var randomSpot = Math.floor(Math.random() * 10);
    
    currentPlayerInfo[0] = famousPlayers[randomSpot];
    initializePlayer();
}
function hideInfoWindow() {
    if (infoWindow) {
        infoWindow.close();
    }
}
function initializePlayer() {
    setPlayerDataToUse();
    for (var i = 0; i < currentPlayerInfo; i++) {
        setupMapPlayer(currentPlayerInfo[i]["markers"]);
    }
    infoWindow = new google.maps.InfoWindow();
}

var infoWindow;

function showMarkerInfo(event) {
    var contentString = "<b>Info:</b>" +
        "<br/><b>Player Name:</b>" + this.get("name") +
        "<br/><b>Hole Score:</b>" + this.get("score") +
        "<br/><b>Year:</b>" + this.get("year") + 
        "<br/><b>Round:</b>" + this.get("round");

    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

function removeAllPlayerMarkers() {
    for (var i = 0; i < currentPlayerInfo.length; i++) {
        
    }
}

function setupMapPlayer(newMarkers) {
    for (var i = 0; i < newMarkers.length; i++) {
        newMarkers[i].setMap(map);
        google.maps.event.addListener(newMarkers[i], 'click', showMarkerInfo);
    }
};


function onDataFetchedPlayer(response, i) {
    if (response.error) {
        alert('Unable to fetch data. ' + response.error.message +
            ' (' + response.error.code + ')');
    } else {
        var spot = extractMarkers(response.rows);
        setupMapPlayer(currentPlayerInfo[spot]["markers"]);
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

function buildPlayerQuery(i) {
    var query = "select col0, col1, col2, col3, col4, col5, col6, col7 from 1f6gpPxDPBkRCvuFinDgE2v8q1BEaVAesyXlhy34v";
    query += " where col5 = " + currentPlayerInfo[i]["playerNumber"];
    query += " and col6 = " + currentPlayerInfo[i]["year"];
    query += " and col7 = " + currentPlayerInfo[i]["round"];

    return query;
};

function resetPlayerData() {
    for (var i = 0; i < currentPlayerInfo.length; i++) {
        removeOldMarkers(currentPlayerInfo[i]["markers"]);
    }
}


function setPlayerDataToUse() {
    for (var i = 0; i < currentPlayerInfo.length; i++) {
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildPlayerQuery(i) });
        request.execute(function (response) {
            onDataFetchedPlayer(response);
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
    if (!rows) {
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

function updateRoundPlayer(frmNum, year) {
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
    resetPlayerData();
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
    setPlayerDataToUse();
}
