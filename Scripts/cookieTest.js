﻿function doNotShow() {
    $.cookie("doNotShow", "yes", { expires: 7 });
}

$(window).load(function () {
    var doNotShow = $.cookie("doNotShow");
    if (doNotShow !== "yes") {
        $("#myModal").modal({
            show: true
        });
    }
});

function storeCookie(cookieName, cookieValues) {
    cookieValueString = cookieValues.join(",");
    $.cookie(cookieName, cookieValueString, {expires: 7});
};

function readCookie(cookieName) {
    var cookieValueString = $.cookie(cookieName);
    return cookieValueString.split(",");
}