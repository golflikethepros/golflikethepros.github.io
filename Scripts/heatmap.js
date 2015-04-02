﻿// Adding 500 Data Points
var map, dataToUse, heatmap;
var round = 0;
var heatMapData = GetHeatMapData();
var years = [0];
var rounds = [0];
var hole = 0;
var shot = 0;

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

function initialize() {
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(30.196842, -81.394031),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: false,
        minZoom: 16,
        radius: 1,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    setDataToUse();

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: dataToUse
    });

    heatmap.setMap(map);
}

function setDataToUse() {
    dataToUse = [];
    for (var l = 0; l < years.length; l++) {
        var year = years[l];
        for (var i = 0; i < rounds.length; i++) {
            var round = rounds[i];
            dataToUse = dataToUse.concat(heatMapData[year][round][hole][shot]);
        }
    }
    var innerHtml = "<h4>Current Data:</h4>Year(s):";
    for (l = 0; l < years.length; l++) {
        innerHtml += " " + (years[l] + 2006) + ",";
    }
    innerHtml = innerHtml.substring(0, innerHtml.length - 1);

    innerHtml += "<br/>Round(s):";
    for (i = 0; i < rounds.length; i++) {
        innerHtml += " " + (rounds[i] + 1) + ",";
    }
    innerHtml = innerHtml.substring(0, innerHtml.length - 1);

    innerHtml += "<br/>Hole: " + (hole+1);
    innerHtml += "<br/>Shot: " + (shot+1);
    document.getElementById("current-data").innerHTML = innerHtml;
}

function updateRound(frm) {
    rounds = [];
    for (var i = 0; i < frm.Round.length; i++) {
        if (frm.Round[i].checked) {
            rounds.push(i);
        }
    }
    setDataToUse();
    heatmap.set("data", dataToUse);
}

function updateHoles(value) {
    hole = value;
    shot = 0;
    map.setCenter(centers[value]);
    map.setZoom(17);
    setDataToUse();
    heatmap.set("data", dataToUse);
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
}

function updateShots(value) {
    shot = value;
    setDataToUse();
    heatmap.set("data", dataToUse);
}

google.maps.event.addDomListener(window, "load", initialize);