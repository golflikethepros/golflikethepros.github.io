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

function setInitialValues() {
    if (readCookie("years").length === 0) {
        years = [0];
    } else {
        years = readCookie("years");
    }
    if (readCookie("rounds").length === 0) {
        rounds = [0];
    } else {
        rounds = readCookie("rounds");
    }
    if (readCookie("hole").length === 0) {
        hole = 0;
    } else {
        hole = readCookie("hole")[0];
    }
    if (readCookie("scores").length === 0) {
        setCurrentScores(hole);
        updateScores(document.getElementById("scores"));
    } else {
        scores = readCookie("scores");
    }
    if (readCookie("shot").length === 0) {
        shot = 0;
    } else {
        shot = readCookie("shot")[0];
    }
    setButtonsForValues();
}

function setButtonsForValues() {
    var scoreForm = document.getElementById("scores");
    for (var i = 0; i < scoreForm.Score.length; i++) {
        if (scores.indexOf(i) > -1) {
            scoreForm.Score[i].checked = true;
        } else {
            scoreForm.Score[i].checked = false;
        }
    }

    var yearForm = document.getElementById("years");
    for (i = 0; i < yearForm.Year.length; i++) {
        if (years.indexOf(i) > -1) {
            yearForm.Year[i].checked = true;
        } else {
            yearForm.Year[i].checked = false;
        }
    }

    var roundForm = document.getElementById("rounds");
    for (i = 0; i < roundForm.Round.length; i++) {
        if (rounds.indexOf(i) > -1) {
            roundForm.Round[i].checked = true;
        } else {
            roundForm.Round[i].checked = false;
        }
    }

    document.getElementById("hole" + (hole + 1)).checked = true;
    document.getElementById("shot" + (shot + 1)).checked = true;
}

function validData() {
    return shot != null && hole != null && scores.length > 0 && years.length > 0 && rounds.length > 0;
}

function setDataToUse() {
    dataToUse = [];
    if (validData()) {
        var request = gapi.client.fusiontables.query.sqlGet({ sql: buildQuery() });
        request.execute(function(response) {
            onDataFetched(response);
        });
    }
}

function setCurrentDataHtml() {
    var innerHtml = "<h4>Current Data:</h4>Year(s):";
    for (var l = 0; l < years.length; l++) {
        innerHtml += " " + (years[l] + 2006) + ",";
    }
    innerHtml = innerHtml.substring(0, innerHtml.length - 1);

    innerHtml += "<br/>Round(s):";
    for (var i = 0; i < rounds.length; i++) {
        innerHtml += " " + (rounds[i] + 1) + ",";
    }
    innerHtml = innerHtml.substring(0, innerHtml.length - 1);

    innerHtml += "<br/>Hole: " + (hole + 1);
    innerHtml += "<br/>Shot: " + (shot + 1);

    innerHtml += "<br/>Scores(s):";
    for (i = 0; i < scores.length; i++) {
        innerHtml += " " + (scores[i] + 1) + ",";
    }
    innerHtml = innerHtml.substring(0, innerHtml.length - 1);

    innerHtml += "<br/>Data Points: " + dataToUse.length;
    document.getElementById("current-data").innerHTML = innerHtml;
}

function updateRound(frm, reset) {
    if (reset == null) {
        allRoundsSelected = null;
    }
    rounds = [];
    for (var i = 0; i < frm.Round.length; i++) {
        if (frm.Round[i].checked) {
            rounds.push(i);
        }
    }
    setDataToUse();
    heatmap.set("data", dataToUse);
    storeCookie("rounds", rounds);
}

var allYearsSelected;
function selectAllYears() {
    if (allYearsSelected == null) {
        allYearsSelected = false;
    }
    var yearForm = document.getElementById("years");
    for (var i = 0; i < yearForm.Year.length; i++) {
        if (!allYearsSelected) {
            yearForm.Year[i].checked = true;
        } else {
            yearForm.Year[i].checked = false;
        }
    }
    allYearsSelected = !allYearsSelected;
    updateYears(yearForm, false);
}

var allScoresSelected;
function selectAllScores() {
    if (allScoresSelected == null) {
        allScoresSelected = false;
    }
    var scoreForm = document.getElementById("scores");
    for (var i = 0; i < scoreForm.Score.length; i++) {
        if (!allScoresSelected) {
            scoreForm.Score[i].checked = true;
        } else {
            scoreForm.Score[i].checked = false;
        }
    }
    allScoresSelected = !allScoresSelected;
    updateScores(scoreForm, false);
}

var allRoundsSelected;
function selectAllRounds() {
    if (allRoundsSelected == null) {
        allRoundsSelected = false;
    }
    var roundForm = document.getElementById("rounds");
    for (var i = 0; i < roundForm.Round.length; i++) {
        if (!allRoundsSelected) {
            roundForm.Round[i].checked = true;
        } else {
            roundForm.Round[i].checked = false;
        }
    }
    allRoundsSelected = !allRoundsSelected;
    updateRound(roundForm, false);
}

function updateScores(frm, reset) {
    if (reset == null) {
        allScoresSelected = null;
    }
    scores = [];
    for (var i = 0; i < frm.Score.length; i++) {
        if (frm.Score[i].checked) {
            scores.push(i);
        }
    }
    setDataToUse();
    if (heatmap) {
        heatmap.set("data", dataToUse);
    }
    storeCookie("scores", scores);
}

function setCurrentScores(hole) {
    var currentPar = pars[hole];
    var scoreForm = document.getElementById("scores");
    for (var i = 0; i < scoreForm.Score.length; i++) {
        if (i < currentPar) {
            scoreForm.Score[i].checked = true;
        } else {
            scoreForm.Score[i].checked = false;
        }
    }

}

function updateHoles(value) {
    hole = value;
    shot = 0;
    map.setCenter(centers[value]);
    map.setZoom(17);
    setCurrentScores(value);
    setDataToUse();
    heatmap.set("data", dataToUse);

    storeCookie("hole", [hole]);
}

function updateYears(frm) {
    years = [];
    for (var i = 0; i < frm.Year.length; i++) {
        if (frm.Year[i].checked) {
            years.push(i);
        }
    }
    setDataToUse();
    heatmap.set("data", dataToUse);
    storeCookie("years", years);
}

function updateShots(value) {
    shot = value;
    setDataToUse();
    heatmap.set("data", dataToUse);

    storeCookie("shot", [shot]);
}

google.maps.event.addDomListener(window, 'load', loadApi);