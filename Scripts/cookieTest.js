function doNotShow() {

}

$(window).load(function () {
    var doNotShow = $.cookie("doNotShow");
    if (doNotShow !== "yes") {
        $("#myModal").modal({
            show: true
        });
    }
});