function doNotShow() {
    $.cookie("doNotShow", "yes");
}

$(window).load(function () {
    if ($.cookie("doNotShow") !== "yes") {
        $("#myModal").modal({
            show: true
        });
    }
});