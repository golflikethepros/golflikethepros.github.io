﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TPCSawgrassShotData.aspx.cs" Inherits="Golf.WebForm2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>TPC Sawgrass Shot Data</title>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=visualization"></script>
    <script src="Scripts/HeatMapDataStorage.js"></script>
    <script src="Scripts/heatmap.js"></script>
    <script src="Scripts/jquery-1.9.1.js"></script>
    <script src="Scripts/snap.js"></script>
    <link type="text/css" rel="stylesheet" href="content/bootstrap.css"/>
    <link type="text/css" rel="stylesheet" href="content/bootstrap-theme.css"/>
    <link type="text/css" rel="stylesheet" href="content/Site.css"/>
    <link type="text/css" rel="stylesheet" href="content/snap.css"/>
</head>
<body>
<div class="snap-drawers">
<div class="snap-content snap-drawer-left">
<h3>TPC Sawgrass</h3>
<hr/>
<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
    <div class="panel panel-default panel-body-style">
        <div class="panel-heading" role="tab" id="headingOne">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Select Year(s)
                </a>
            </h4>
        </div>
        <div id="collapseOne" class="panel-body-style collapse" role="tabpanel" aria-labelledby="headingOne">
            <div class="panel-body">
                <form name="years">
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) " checked>2006 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2007 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2008 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2009 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2010 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2011 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2012 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2013 </span> <br/>
                    <span><input type="Checkbox" name="Year" value="2006" onclick=" updateYears(this.form) ">2014 </span> <br/>
                </form>
            </div>
        </div>
    </div>
    <div class="panel panel-default panel-body-style">
        <div class="panel-heading" role="tab" id="headingTwo">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    Select Round(s)
                </a>
            </h4>
        </div>
        <div id="collapseTwo" class="panel-body-style collapse" role="tabpanel" aria-labelledby="headingTwo">
            <div class="panel-body">
                <form name="rounds">
                    <span><input type="Checkbox" name="Round" value="Round1" onclick=" updateRound(this.form) " checked>Round 1 </span> <br/>
                    <span><input type="Checkbox" name="Round" value="Round2" onclick=" updateRound(this.form) ">Round 2 </span> <br/>
                    <span><input type="Checkbox" name="Round" value="Round3" onclick=" updateRound(this.form) ">Round 3 </span> <br/>
                    <span><input type="Checkbox" name="Round" value="Round4" onclick=" updateRound(this.form) ">Round 4 </span> <br/>
                </form>
            </div>
        </div>
    </div>
    <div class="panel panel-default panel-body-style">
        <div class="panel-heading" role="tab" id="headingThree">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                    Select Hole
                </a>
            </h4>
        </div>
        <div id="collapseThree" class="panel-body-style collapse" role="tabpanel" aria-labelledby="headingThree">
            <div class="panel-body">
                <form role="form">
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(0) " name="optshot" checked/>Hole 1</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(1) " name="optshot"/>Hole 2</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(2) " name="optshot"/>Hole 3</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(3) " name="optshot"/>Hole 4</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(4) " name="optshot"/>Hole 5</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(5) " name="optshot"/>Hole 6</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(6) " name="optshot"/>Hole 7</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(7) " name="optshot"/>Hole 8</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(8) " name="optshot"/>Hole 9</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(9) " name="optshot"/>Hole 10</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(10) " name="optshot"/>Hole 11</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(11) " name="optshot"/>Hole 12</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(12) " name="optshot"/>Hole 13</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(13) " name="optshot"/>Hole 14</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(14) " name="optshot"/>Hole 15</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(15) " name="optshot"/>Hole 16</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(16) " name="optshot"/>Hole 17</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateHoles(17) " name="optshot"/>Hole 18</label>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="panel panel-default panel-body-style">
        <div class="panel-heading" role="tab" id="headingFour">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                    Select Shot
                </a>
            </h4>
        </div>
        <div id="collapseFour" class="panel-body-style collapse" role="tabpanel" aria-labelledby="headingFour">

            <div class="panel-body">
                <form role="form">
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(0) " name="optshot" checked/>Shot 1</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(1) " name="optshot"/>Shot 2</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(2) " name="optshot"/>Shot 3</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(3) " name="optshot"/>Shot 4</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(4) " name="optshot"/>Shot 5</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(5) " name="optshot"/>Shot 6</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(6) " name="optshot"/>Shot 7</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(7) " name="optshot"/>Shot 8</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(8) " name="optshot"/>Shot 9</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(9) " name="optshot"/>Shot 10</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(10) " name="optshot"/>Shot 11</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(11) " name="optshot"/>Shot 12</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(12) " name="optshot"/>Shot 13</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(13) " name="optshot"/>Shot 14</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" onclick=" updateShots(14) " name="optshot"/>Shot 15</label>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="panel panel-default panel-body-style">
        <div class="panel-heading" role="tab" id="headingFive">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                    Other Options
                </a>
            </h4>
        </div>
        <div id="collapseFive" class="panel-body-style collapse" role="tabpanel" aria-labelledby="headingFive">
            <div class="panel-body">
                <br/>
                <a class="btn btn-default" id="close-settings" onclick=" closeSettings() ">Close Settings Window</a>
            </div>
        </div>
    </div>
</div>

<br/>

<br/>

<br/>

</div>
<div class="snap-content snap-drawer-right"></div>
</div>
<div id="content" class="snap-content" data-snap-ignore="true">
    <div id="toolbar">
        <a href="#" id="settings-button" onclick=" openLeft() " title="Click here to open/close settings menu">
            <span class="glyphicon glyphicon-cog"></span> </a>
        <h1>TPC Sawgrass Shot Data</h1>
    </div>
    <div id="current-data"><h4>Current Data:</h4>Year(s): 2006<br/>Round(s): 1<br/>Hole: 1<br/>Shot: 1<br/>
    </div>
    <div id="map-canvas"></div>
</div>
<script type="text/javascript">
    var snapper = new Snap({
        element: document.getElementById("content"),
        hyperextensible: false,
        disable: "right"
    });
    var opened = false;

    function openLeft() {
        if (opened) {
            snapper.close();
        } else {
            snapper.open('left');
        }
        opened = !opened;
    }

    function closeSettings() {
        snapper.close();
    }
</script>

<script src="Scripts/jquery-1.9.1.min.js"></script>
<script src="Scripts/bootstrap.min.js"></script>
</body>
</html>
