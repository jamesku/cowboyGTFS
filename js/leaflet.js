var addingRoutes = false;
var map = L.map('mapid', {
    layers: [],
    center: [30.291807, -97.677080],
    zoom: 13
});

var routeControlMasterObject = {};
var thisRoute = "";
var stopNumber = 0;
var fakeRouteControlObj = {};
var thisRouteLine = [];

map.on('baselayerchange', function(baselayer) {
    baselayer.layer.getLayers()[0].bringToBack();
});

// create the tile layer with correct attribution
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {
    minZoom: 8,
    maxZoom: 20,
    attribution: osmAttrib
});

// start the map in South-East England
map.setView(new L.LatLng(30.291807, -97.677080), 13);
map.addLayer(osm);

//featureGroup for stops
var stopLayer = new L.featureGroup().addTo(map);
stopLayer.addTo(map);

//add geocoder to allow click on location
L.Control.geocoder().addTo(map);


function lockRoute() {
    addtoMasterRoutesArray(thisRoute);
    routeControlMasterObject[thisRoute].remove(map);
    createGEOJSON(thisRoute, thisRouteLine);
    updateShapeText(thisRoute, thisRouteLine);
}
/**********************
Easy Buttons
*/

var stopsMode = L.easyButton({
    states: [{
        icon: '<span class="star">&starf;</span>',
        onClick: function() {
            addingRoutes = false;
        },
        title: 'add stops'
    }]
});

stopsMode.addTo(map);



function newRouteLeaflet(defaultName) {
    addingRoutes = true;
    var routeControl = addRouteControl();
    var routeArray = [];
    routeArray = routeControl.getWaypoints();
    if (routeArray[0].latLng === null) {
        stopNumber = 1;
        if (confirm("Pick the home stop to get started! If you havent defined all the stops in the route, go back to stops mode and mark them first")) { // clearRoutes();
            if (defaultName) {
                routeName = defaultName;
            } else {
                routeName = prompt("Please enter the new Route Name", "");
                routeName = routeName.replace(/\s+/g, '');
                routeName = routeName.replace(/\//g, '');

            }
            // fakeRouteControlObj[routeName] = (addFakeRouteControl(routeName));
            // fakeRouteControlObj[routeName].addTo(map);
            routeControlMasterObject[routeName] = routeControl;
            thisRoute = routeName;
            routeControlMasterObject[routeName].addTo(map).on('routeselected', function(e) {
                var route = e.route;
                thisRouteLine = [];
                for (var i = 0; i < route.coordinates.length; i++) {
                    thisRouteLine.push([route.coordinates[i].lng, route.coordinates[i].lat]);
                }
            });
        }
    }
}

var greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [13, 20],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [20, 20]
});


/**************************
handling routes
*/

function addRouteControl() {

    var routeControl = L.Routing.control({
        waypoints: [],
        show: false,
        createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
                draggable: true,
                icon: greyIcon
            });
        },
        routeLine: function(route) {
            var line = L.Routing.line(route);
            line.eachLayer(function(l) {
                l.on('click', function(e) {
                    thisRoute = this.routeName;
                    alert(thisRoute);
                });
            });
            return line;
        },
    });

    return routeControl;

}

function removeRouteControl() {
    routeControl.remove(map);
}


/*******************************
handling stops that exist (delete them or add them to a route)
*/

var layerobj = {};
//controller = L.control.layers(null, layerobj, {position: 'topleft'}).addTo(map);

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

stopLayer.on('click', function(event) {
    var latlng = event.latlng;
    var clickedMarker = event.layer;
    var stopName = clickedMarker.options.title;
    var container = L.DomUtil.create('div');

    if (!addingRoutes){

            deleteBtn = createButton('delete', container);

        L.popup()
            .setContent(container)
            .setLatLng(event.latlng)
            .openOn(map);

        L.DomEvent.on(deleteBtn, 'click', function(e) {
            console.log(stopsArray);
            var stopNameIndex;
            for (var i = 0; i < stopsArray.length; i++) {
                if (i === 0) {
                    stopNameIndex = jQuery.inArray("stop_name", stopsArray[0]);
                } else if (stopsArray[i][stopNameIndex] === stopName) {
                    stopLayer.removeLayer(clickedMarker);
                    stopsArray.splice(i, 1);
                }
            }
            console.log(stopsArray);
            setStopsTextArea();
            map.closePopup();
        });
    } else {
            addStopBtn = createButton('Add Stop to Route', container);

        L.popup()
            .setContent(container)
            .setLatLng(event.latlng)
            .openOn(map);

        L.DomEvent.on(addStopBtn, 'click', function(event) {
            if (stopNumber === 1) {
                routeControlMasterObject[thisRoute].spliceWaypoints(0, 1, latlng);
                alert("Great! now select the second stop!");
            }

            if (stopNumber === 2) {
                routeControlMasterObject[thisRoute].spliceWaypoints(routeControlMasterObject[thisRoute].getWaypoints().length - 1, 1, latlng);
                alert("Great! second stop established, now select the thrid stop and the fourth and so on, until you click back on the original stop to close the circuit - if the line goes off of the route, drag the line to correct it!");
            }

            if (stopNumber > 2) {
                routeControlMasterObject[thisRoute].spliceWaypoints(routeControlMasterObject[thisRoute].getWaypoints().length, 0, latlng);
            }
            addStopToRoute(stopName);
            stopNumber++;

            // routeControlMasterObject[thisRoute].spliceWaypoints(routeControlMasterObject[thisRoute].getWaypoints().length-1, 1, L.latLng(51.705, -0.19));

            var routeArray = [];
            routeArray = routeControlMasterObject[thisRoute].getWaypoints();
            //alert (JSON.stringify(routeArray));


            map.closePopup();
        });


    }
});

// Handle Stops When the Map Is Clicked
map.on('click', function(e) {
    if (!addingRoutes) {
        var container = L.DomUtil.create('div'),
            addStopBtn = createButton('Add Stop', container);
        L.popup()
            .setContent(container)
            .setLatLng(e.latlng)
            .openOn(map);

        L.DomEvent.on(addStopBtn, 'click', function() {
            console.log(stopsArray);
            stopname = prompt("Please enter the stop name", "");
            var marker = L.marker([e.latlng.lat, e.latlng.lng], {
                title: stopname,
                zIndexOffset: 1000
            });
            stopLayer.addLayer(marker);
            layerobj[stopname] = stopLayer;
            if (!stopsArray[0]) {
                stopsArray.push(['stop_id', 'stop_code', 'stop_name', 'stop_desc', 'stop_lat', 'stop_lon', 'stop_url', 'location_type', 'parent_station']);
            }
            var stopLatIndex = jQuery.inArray("stop_lat", stopsArray[0]);
            var stopLngIndex = jQuery.inArray("stop_lon", stopsArray[0]);
            var stopNameIndex = jQuery.inArray("stop_name", stopsArray[0]);
            var thisStop = [];
            for (var i = 0; i < stopsArray[0].length; i++) {
                thisStop.push("");
            }
            thisStop[stopLngIndex] = e.latlng.lng;
            thisStop[stopLatIndex] = e.latlng.lat;
            thisStop[stopNameIndex] = stopname;
            stopsArray.push(thisStop);
            map.closePopup();
            setStopsTextArea();
        });
    } else {
        L.popup()
            .setContent("Click on a Stop or click on the star button to add more stops")
            .setLatLng(e.latlng)
            .openOn(map);
    }
});


function loadStopFunction(stopname, e) {
    var marker = L.marker([e.latlng.lat, e.latlng.lng], {
        title: stopname,
        zIndexOffset: 1000
    });
    stopLayer.addLayer(marker);
    layerobj[stopname] = stopLayer;
    map.closePopup();
}

var routeLines = L.featureGroup().addTo(map);
var routeLinesObj = {};

function paintLinesOnMap(geojsonFeature, shapetxt) {
    console.log(geojsonFeature);
    console.log(shapetxt);
    routeLinesObj[shapetxt] = L.geoJSON(geojsonFeature, {
        style: function(feature) {
            return {
                color: randomColor(),
                "weight": 6
            };
        }
    }).bindPopup(function(layer) {
        return layer.feature.properties.description;
    });
    console.log(routeLinesObj[shapetxt]);
    // routeLines.addData(routeLinesObj[shapetxt]);
    routeLinesObj[shapetxt].addTo(routeLines);
}

function showLeafletRoutes(thisRoute) {
    routeLines.clearLayers();
    if (routeLinesObj[thisRoute]) {
        (routeLinesObj[thisRoute]).addTo(routeLines);
    }
}

function addAllRoutesToMap() {
    masterRoutesArray.forEach(function(element) {
        if (routeLinesObj[element]) {
            (routeLinesObj[element]).addTo(routeLines);
        }
    });
}

//Load stops from GTFS files
