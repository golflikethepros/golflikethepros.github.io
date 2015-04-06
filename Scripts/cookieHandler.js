function doNotShow() {
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
    var cookieValueString = cookieValues.join(",");
    $.cookie(cookieName, cookieValueString, {expires: 7});
};

function readCookie(cookieName) {
    var cookieValueString = $.cookie(cookieName);
    if (cookieValueString) {
        var returnArray = [];
        var parts = cookieValueString.split(",");
        for (var i = 0; i < parts.length; i++) {
            returnArray[i] = parseInt(parts[i], 10);
        }
        return returnArray;
    }
    return [];
}