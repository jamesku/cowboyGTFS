
console.log("hello");
var stopsArray = new Array();
var routesArray = new Array();

var agency ={
agency_id:"",
agency_name:"",
agency_url:"",
agency_timezone:"",
agency_phone:"",
agency_lang:""
};

var calendardates = {
  service_id:"",
  monday:"",
  tuesday:"",
  wednesday:"",
  thursday:"",
  friday:"",
  saturday:"",
  sunday:"",
  start_date:"",
  end_date:""
};
var calendardatesArray = [];

var frequencies = {
  trip_id:"",
  start_time:"",
  end_time:"",
  headway_secs:""
};

var frequenciesArray = [];

var routes ={
route_id:"",route_short_name:"",route_long_name:"",route_desc:"",route_type:""
};


var shapes ={
  shape_id:"",shape_pt_lat:"",shape_pt_lon:"",shape_pt_sequence:"",shape_dist_traveled:""
};
var shapesArray = [];

var stops ={
  stop_id:"",stop_name:"",stop_desc:"",stop_lat:"",stop_lon:"",stop_url:"",location_type:"",parent_station:""
};


var stop_times = {
  trip_id:"",arrival_time:"",departure_time:"",stop_id:"",stop_sequence:"",pickup_type:"",drop_off_type:""
};
var stop_times=[];

var trips = {
  route_id:"",service_id:"",trip_id:"",trip_headsign:"",block_id:""
};
var trips=[];
