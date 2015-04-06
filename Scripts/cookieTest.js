function doNotShow() {
    document.cookie("doNotShow", "yes");
}

$(window).load(function () {
    var doNotShow = document.cookie("doNotShow");
    if (doNotShow !== "yes") {
        $("#myModal").modal({
            show: true
        });
    }
});