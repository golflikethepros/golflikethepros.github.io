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