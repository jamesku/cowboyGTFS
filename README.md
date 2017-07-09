# cowboyGTFS
A GUI/text interface to create and modify GTFS files for small Transit Route Systems

Check out the screenshot for what it looks like: (https://github.com/jamesku/cowboyGTFS/blob/master/screenshot.png)

A javascript/jquery/html solution, this web application utilizes the mapping of Leaflet and Leaflet Routing Machine with support from JSzip, Leaflet Control Geocode, Leaflet Easybuttons and RandomColor.js

Usage is pretty simple! Download the whole thing and open index.html - weblinks to jquery and leaflet go through a cdn and some of the other libraries that might not be reliably hosted are included in the repository.

Here is a good workflow:  
upload any existing GTFS files for your system  
Add or remove all route stops to the Map  
If you start adding routes and need to go back and add or delete stops, click on the button on the leaflet map on the left with the star icon  
Add routes by clicking "Create New Route!"  
Click through all the stops for your new route IN ORDER  
Pull on the routing line to ensure that your bus is going along the correct route  
Once you are finished, click on "Lock Route Path"  
Lock Route Path makes the Route a permanent Geojson object, and can no longer be edited  
If you want to change a route path, click on the tab for that route and then click on "New Route Path"  
"New Route Path" does not mess with the text in the selected tab (besides the stops and the shape), so you will have to edit the other text  
Edit the text files in the route tabs to meet the GTFS standards (see: https://developers.google.com/transit/gtfs/)  
If you want to delete a route entirely, click on "Delete Entire Route"  


I am an amateur coder really, so forgive me if the code is not the greatest!  what I really do is study autonomous and connected vehicles (check out my blog: http://driverless.guru/)

any code contributions are welcomed.

this is distributable under the MIT license
