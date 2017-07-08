// Some Global Variables to put the Text Files into Arrays
var stopsArray = [];
var routesArray = [];
var tripsArray = [];
var calendarArray = [];
var stopsArray = [];
var stopTimesArray = [];
var frequenciesArray = [];
var shapesArray = [];
var namesTripIdCheater = [];
var namesStopIdCheater = [];
var namesShapeIdCheater = [];

//this is one master array to keep a list of the routes, helpful for looping through
//when compiling the front page
var masterRoutesArray = [];
function addtoMasterRoutesArray(name){
  if (!masterRoutesArray.includes(name)){
    masterRoutesArray.push(name);
  }
}

//Functionality to make Text Files
var textFile = null;
makeTextFile = function (text) {
  var data = new Blob([text], {type: 'text/plain'});
  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }
  textFile = window.URL.createObjectURL(data);
  return textFile;
};

//assign values of textareas (using javascript, could use jquery)
var create = document.getElementById('downloadGTFS'),
  agencydata = document.getElementById('agencydata'),
  calendardata = document.getElementById('calendardata'),
  stopsdata = document.getElementById('stopsdata'),
  stoptimesdata = document.getElementById('stoptimesdata'),
  frequenciesdata = document.getElementById('frequenciesdata'),
  tripsdata = document.getElementById('tripsdata'),
  routesdata = document.getElementById('routesdata'),
  shapesdata = document.getElementById('shapesdata');

//add event listeners for loading and downloading GTFS
window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
      loadZipFile(file);
			})
    //on our download button we send the completed GTFS
    create.addEventListener('click', function () {
      var link = document.getElementById('downloadlink');
      link.href = makeZipFile(agencydata.value, calendardata.value, stopsdata.value,
        stoptimesdata.value,frequenciesdata.value, tripsdata.value, routesdata.value, shapesdata.value);
      link.style.display = 'block';
    }, false);
    };

//take the values of the textareas, convert them to text files, add them to the zip and then return them for download
function makeZipFile(agencydata,calendardata,stopsdata,stoptimesdata,frequenciesdata,tripsdata,routesdata,shapesdata){
  var zip = new JSZip();
  zip.file("agency.txt", agencydata);
  zip.file("calendar.txt", calendardata);
  zip.file("stops.txt",stopsdata);
  zip.file("stop_times.txt",stoptimesdata);
  zip.file("frequencies.txt",frequenciesdata);
  zip.file("trips.txt",tripsdata);
  zip.file("routes.txt",routesdata);
  zip.file("shapes.txt",shapesdata);
  zip.generateAsync({type:"base64"}).then(function (base64) {
      location.href="data:application/zip;base64," + base64;
      return location.href;
  });
}
var checkarray = [];
//function to load GTFS files
function loadZipFile(file){
  var latlng = {};
  var e = {latlng};
JSZip.loadAsync(file).then(function (zip) {
  //load Routes First
  zip.files["routes.txt"].async('string').then(function (fileData) {
    var lines = fileData.split('\n');
    //loop through each line, the top line of each GTFS file should be a header row and should
    //inform us about the rest of the file - not all GTFS headers are created equal! some values are optional
    for(var i = 0; i < lines.length; i++){
      var array = lines[i].split(',');
      if (i === 0){
        if (!routesArray[0]){
          //if routes array doesnt already have any values, start pushing them in
          routesArray.push(array);
        }
        // find some index values
        var routeShortNameIndex = jQuery.inArray( "route_short_name", array );
        var routeLongNameIndex = jQuery.inArray( "route_long_name", array );
        }
      else {
        //make sure the values actually have a value (if short name doesnt work, use the long one)
        var routeShortName = array[routeShortNameIndex];
        if(!routeShortName){
          routeShortName = array[routeLongNameIndex]
        }
        if(routeShortName){
          masterRoutesArray.push(routeShortName.replace(/\s+/g, '').replace(/\//g, ''));
          //add all the routes to the routesArray and load the necessary tabs
          routesArray.push(array);
          loadRoutesFunction(routeShortName.replace(/\s+/g, '').replace(/\//g, ''));
        }
      }
    }
  });


  //load Trips next
  zip.files["trips.txt"].async('string').then(function (fileData) {
    var lines = fileData.split('\n');
    //here we want to mess with he routesArray because we have to cross reference route_id
    var routeIdIndex = jQuery.inArray( "route_id", routesArray[0]);
    var routeShortNameIndex = jQuery.inArray( "route_short_name", routesArray[0]);
    var routeLongNameIndex = jQuery.inArray( "route_long_name", routesArray[0]);

    routesArray.forEach(function(element){
      var thisRouteID = element[routeIdIndex];
      var routeShortName = element[routeShortNameIndex];
      if(!routeShortName){
        routeShortName = element[routeLongNameIndex];
      }
      for(var i = 0; i < lines.length; i++) {
        var array = lines[i].split(',');
        if (i === 0) {
          if (!tripsArray[0]){
            tripsArray.push(array);
          }

          var tempstring = array.join();
          tempstring = tempstring.replace(/[\n\r]/g, '');
          array = tempstring.split(',');
          var tripRouteId = jQuery.inArray( "route_id", array );
          var tripTripId = jQuery.inArray( "trip_id", array );
          var shapeId = jQuery.inArray("shape_id", array );

        }
        else {
          if (thisRouteID === array[tripRouteId]){
            routeShortName = routeShortName.replace(/\s+/g, '');
            routeShortName = routeShortName.replace(/\//g, '');
            var txt = $("#"+routeShortName+"trips");
            txt.val(txt.val() + array.join(','));
            // console.log(array[tripTripId]);
            var miniCheater = [routeShortName,array[tripTripId]];

            namesTripIdCheater.push(miniCheater);

            var miniCheater2 = ([routeShortName,array[shapeId]]).join();
            if (!namesShapeIdCheater.includes(miniCheater2)){
              namesShapeIdCheater.push(miniCheater2);
            }
          }
          tripsArray.push(array);
        }
      }
    });
  });

  zip.files["stop_times.txt"].async('string').then(function (fileData) {
    var lines = fileData.split('\n');
    namesTripIdCheater.forEach( function(element){
      for(var i = 0; i < lines.length; i++) {
        var array = lines[i].split(',');
        if (i === 0) {
          if (!stopTimesArray[0]){
            stopTimesArray.push(array);
          }
          var stopTimesTripId = jQuery.inArray( "trip_id", array );
          var stopTimesStopId = jQuery.inArray( "stop_id", array );
        }
        else {
          if (element[1] === array[stopTimesTripId]){
            var txt = $("#"+element[0]+"stoptimes");
            txt.val(txt.val() + array.join(','));
            var cheater = element[0]+','+array[stopTimesStopId];
            //remove duplicates
            if (!namesStopIdCheater.includes(cheater)){
              namesStopIdCheater.push(cheater);
            }
          }
          stopTimesArray.push(array);
        }
      }
    });
  });

  zip.files["stops.txt"].async('string').then(function (fileData) {
    var lines = fileData.split('\n');
    var duplicateFilter = [];
    for(var i = 0; i < lines.length; i++){
      var array = lines[i].split(',')
      if (i === 0){
        if (!stopsArray[0]){
          stopsArray.push(array);
        }
      var stopLatIndex = jQuery.inArray( "stop_lat", array );
      var stopLngIndex = jQuery.inArray( "stop_lon", array );
      var stopNameIndex = jQuery.inArray( "stop_name", array );
      var stopIdIndex = jQuery.inArray( "stop_id", array );
    }
    else {
      var stopName = array[stopNameIndex];
      e.latlng.lat = array[stopLatIndex];
      e.latlng.lng = array[stopLngIndex];
      stopsArray.push(array);
      loadStopFunction(stopName,e);
      map.setView(new L.LatLng(e.latlng.lat,e.latlng.lng),13);
      namesStopIdCheater.forEach(function(element){
        tempArray = element.split(',');
        if(tempArray[1] === array[stopIdIndex]){
          if (!duplicateFilter.includes(element)){
            duplicateFilter.push(element);
            var txt = $("#"+tempArray[0]+"stops");
            txt.val(txt.val() + array.join(','));
        }
      }
      });
      //need to add a safety here where mixed up arrays are handled.
      }
    }
     setStopsTextArea();
  });

  zip.files["frequencies.txt"].async('string').then(function (fileData) {
    var lines = fileData.split('\n');
    namesTripIdCheater.forEach( function(element){
      for(var i = 0; i < lines.length; i++) {
        var array = lines[i].split(',');
        if (i === 0) {
          if (!frequenciesArray[0]){
            frequenciesArray.push(array);
          }
          var frequenciesTripId = jQuery.inArray( "trip_id", array );
        }
        else {
          if (element[1] === array[frequenciesTripId]){
            var txt = $("#"+element[0]+"frequency");
            txt.val(txt.val() + array.join(','));
          }
          frequenciesArray.push(array);
        }
      }
    });
  });

  zip.files["shapes.txt"].async('string').then(function (fileData) {
    var sortShapesArray = [];
    var routeName;
    var lines = fileData.split('\n');

    var tempstring = lines[0];
    tempstring = tempstring.replace(/[\n\r]/g, '');
    var headerArray = tempstring.split(',');

    if (!shapesArray[0]){
      shapesArray.push(headerArray);
    }

    var shapesId = jQuery.inArray( "shape_id", headerArray );

    for(var i = 1; i < lines.length; i++) {
      var array = lines[i].split(',');
        sortShapesArray.push(array);
      };

    var shapePS = jQuery.inArray( "shape_pt_sequence", headerArray );

    sortShapesArray= sortShapesArray.sort(sortFunction);
    function sortFunction(a, b) {
        if (parseInt(a[shapePS]) === parseInt(b[shapePS])) {
            return 0;
        }
        else {
            return (parseInt(a[shapePS]) < parseInt(b[shapePS])) ? -1 : 1;
        }
    }

  //all good above here

    for(var i = 0; i < sortShapesArray.length; i++) {

      var array = sortShapesArray[i];

      namesShapeIdCheater.forEach(function(string){
        var element = string.split(',');
        var cheaterRouteId = element[1].toString();
        cheaterRouteId = cheaterRouteId.replace(/[\n\r]/g, '').trim();
        var thisRouteId = array[shapesId].toString();
        thisRouteId = thisRouteId.replace(/[\n\r]/g, '').trim();

        if (cheaterRouteId === thisRouteId){
             var txt = $("#"+element[0]+"shape");
             txt.val(txt.val() + array.join());
           }
      });
      shapesArray.push(array);
    };

    namesShapeIdCheater.forEach(function(string){
      var element = string.split(',');
      var txt = $('#'+element[0]+'shape').val().split("\n")
      txt = txt.filter(function(entry) { return entry.trim() != ''; });

      var shape_pt_lon = jQuery.inArray( "shape_pt_lon", headerArray );
      var shape_pt_lat = jQuery.inArray( "shape_pt_lat", headerArray );

      var thesePoints = [];

      for(i=1; i<txt.length; i++){
        var tempArray = txt[i].split(',');
          var latlng = [tempArray[shape_pt_lon], tempArray[shape_pt_lat]];
          thesePoints.push(latlng);
          }
         createGEOJSON(element[0], thesePoints);
    });
});


  Object.keys(zip.files).forEach(function (filename) {
    zip.files[filename].async('string').then(function (fileData) {
      switch(filename) {
    case "agency.txt":
        $(document.getElementById('agencydata')).text(fileData);
        break;
    case "calendar.txt":
        $(document.getElementById('calendardata')).text(fileData);
        break;
    case "routes.txt":
      break;
    default:
        break;
      }
    })
  })
});
};

function setStopsTextArea(){
  var txt = $("#stopsdata");
  txt.val('');
  for(i=0; i<stopsArray.length; i++){
  txt.val(txt.val() + stopsArray[i].join(','));
  }
}

function addStopToRoute(stopName){
  var txt = $('#'+thisRoute+'stops');
  var stopNameIndex = jQuery.inArray( "stop_name", stopsArray[0] );
  for(i=0; i<stopsArray.length; i++){
    if (stopsArray[i][stopNameIndex] === stopName) {
      txt.val(txt.val() + stopsArray[i].join(',')+"\n");
    }
}
}
function refreshAll(){
  var allstoptxt = $('#stopsdata').val('');
  var allroutetxt = $('#routesdata').val('');
  var allfrequencytxt = $('#frequenciesdata').val('');
  var alltripstxt = $('#tripsdata').val('');
  var allstoptimestxt = $('#stoptimesdata').val('');
  var allshapes = $('#shapesdata').val('');
  var duplicateFilter = [];

  masterRoutesArray.forEach(function(element){

    var stoptxt = $('#'+element+'stops').val().split("\n");
    stoptxt = stoptxt.filter(function(entry) { return entry.trim() != ''; });
    var routetxt = $('#'+element+'route').val().split('\n');
    routetxt = routetxt.filter(function(entry) { return entry.trim() != ''; });
    var frequencytxt = $('#'+element+'frequency').val().split('\n');
    frequencytxt = frequencytxt.filter(function(entry) { return entry.trim() != ''; });
    var tripstxt = $('#'+element+'trips').val().split('\n');
    tripstxt = tripstxt.filter(function(entry) { return entry.trim() != ''; });
    var stoptimestxt = $('#'+element+'stoptimes').val().split('\n');
    stoptimestxt = stoptimestxt.filter(function(entry) { return entry.trim() != ''; });
    var shapestxt = $('#'+element+'shape').val().split('\n');
    shapestxt = shapestxt.filter(function(entry) { return entry.trim() != ''; });


    refreshLoop(stoptxt, allstoptxt);
    refreshLoop(routetxt, allroutetxt);
    refreshLoop(frequencytxt, allfrequencytxt);
    refreshLoop(tripstxt, alltripstxt);
    refreshLoop(stoptimestxt, allstoptimestxt);
    refreshLoop(shapestxt, allshapes);

    function refreshLoop(txt, alltxt){
      for(i=0; i<txt.length; i++){
        if (alltxt.val() === ''){
          alltxt.val(alltxt.val() + txt[i]);
        }
        if (i > 0){
          if (!duplicateFilter.includes(txt[i])){
            duplicateFilter.push(txt[i]);
            alltxt.val(alltxt.val() + "\n" + txt[i]);
          }
        }
      }
    }

  });
}


function createGEOJSON(shapetxt, latlngs){
    var geojsonFeature = {
      "type": "Feature",
      "properties": {
          "name": shapetxt,
          "popupContent": shapetxt
      },
      "geometry": {
          "type": "LineString",
          "coordinates": latlngs
      }
    }

    paintLinesOnMap(geojsonFeature, shapetxt);

  };
