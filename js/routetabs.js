var thisRoute = null;
//add a tab when the new route button is clicked
$(document).ready(function() {
    $('body').on('click', '#create_me', function() {
        //run the map functionality
        newRouteLeaflet(null);
        newtab();
    });
    $('body').on('click', '#lock_route_path', function() {
        //run the map functionality
        lockRoute();
    });

    $('body').on('click', '#delete_entire_route', function() {
        //run the map functionality
        if (confirm("Are you sure you want to delete all route data?")) {
            deleteThisRoute();
        }
    });

    $('body').on('click', '#new_route_path', function() {
        //run the map functionality
        delete routeLinesObj[thisRoute];
        var txt = $("#" + thisRoute + "stops");
        txt.val("stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,stop_url,location_type,parent_station\n");
        txt = $("#" + thisRoute + "shape");
        txt.val("shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled\n");
        routeLines.clearLayers();
        newRouteLeaflet(thisRoute);
    });

    $('.nav-tabs').on('click', 'li > a', function(event) {
        event.preventDefault(); //stop browser to take action for clicked anchor

        //get displaying tab content jQuery selector
        var active_tab_selector = $('.nav-tabs > li.active > a').attr('href');

        //find actived navigation and remove 'active' css
        var actived_nav = $('.nav-tabs > li.active');
        actived_nav.removeClass('active');

        //add 'active' css into clicked navigation
        $(this).parents('li').addClass('active');

        //set the globalvariable so we have an easy way to know what route we are messing with at any given time
        thisRoute = $(this).parents('li').text();

        if ($(this).attr('href') != "#tab1") {
            showLeafletRoutes(thisRoute);
        }
        //hide displaying tab content
        $(active_tab_selector).removeClass('active');
        $(active_tab_selector).addClass('hide');

        //show target tab content
        var target_tab_selector = $(this).attr('href');

        $(target_tab_selector).removeClass('hide');
        $(target_tab_selector).addClass('active');
    });
});

function loadRoutesFunction(routeShortName) {
    thisRoute = routeShortName;
    newtab();
}

function newtab() {
    var index = $('.nav-tabs li').length + 1;
    $('.nav-tabs').append('<li id="tabId' + thisRoute + '"><a href="#tab' + index + '">' + thisRoute + '</a></li>');
    $('.ui-page').append('<section id="tab' + index +
        '" class="tab-content hide">Route<br>route_id,route_short_name,route_long_name,route_desc,route_type,route_color<br><textarea id="' + thisRoute +
        'route" name="' + thisRoute + 'route">route_id,route_short_name,route_long_name,route_desc,route_type,route_color\nXX,' + thisRoute +
        ',XX,,,</textarea>Stops<br>stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,stop_url,location_type,parent_station<br><textarea id="' + thisRoute +
        'stops" name="' + thisRoute + 'stops">stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,stop_url,location_type,parent_station\n</textarea>Frequency<br>trip_id,start_time,end_time,headway_secs<br><textarea id="' + thisRoute +
        'frequency" name="' + thisRoute + 'frequency">trip_id,start_time,end_time,headway_secs\n</textarea>Trips<br>route_id,service_id,trip_id,trip_headsign,trip_short_name,direction_id,block_id,shape_id<br><textarea id="' + thisRoute +
        'trips" name="' + thisRoute + 'trips">route_id,service_id,trip_id,trip_headsign,trip_short_name,direction_id,block_id,shape_id\n</textarea>Stop Times<br>trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type<br><textarea id="' + thisRoute +
        'stoptimes" name="' + thisRoute + 'stoptimes">trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type\n</textarea>Shape<br>shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled<br><textarea id="' + thisRoute +
        'shape" name="' + thisRoute + 'shape">shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled\n</textarea>');
    $("#popupLogin").popup("close");
    $('a[href="#tab' + index + '"]').click();
    showLeafletRoutes(thisRoute);
}

$("#homeclick").click(function() {
    refreshAll();
    addAllRoutesToMap();
});

function deleteThisRoute() {
    var active_tab_selector = $('.nav-tabs > li.active > a').attr('href');
    var list_tab_selector = $('#tabId' + thisRoute);
    $(active_tab_selector).remove();
    $(list_tab_selector).remove();

    delete routeLinesObj[thisRoute];
    var index = masterRoutesArray.indexOf(thisRoute);
    if (index > -1) {
        masterRoutesArray.splice(index, 1);
    }
}
