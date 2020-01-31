//Start by installing the Node.js client library for the Google maps API Web Services
//And the polyline library from Mapbox to decode the google maps polyline string
//npm i @google/maps
//npm i polyline

const fs = require('fs');
const polyline = require('polyline');
const googleMapsClient = require('@google/maps').createClient({
  key: 'YOUR API KEY'
});


function getDirectionsGeojson(origin, destination, stops) {
	
	var config = {
	  	"origin": origin,
	  	"destination": destination
	 };

	//Get directions
	googleMapsClient.directions(config,
	  	function(err, response) {
		  	if (!err) {
			  	//get polyline from response
			    var polylineString = response.json.routes[0].overview_polyline.points;
			    var points = polyline.decode(polylineString);
			    //kicks out route as lat long pairs
			    console.log(points);

			    //create empty geojson linestring
			    var geojson = {
				  "type": "FeatureCollection",
				  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
				  "features": [
				  	{
				  	  "type": "Feature",
				      "geometry": {
				        "type": "LineString",
				        "coordinates": []
				      },
				      "properties": {
				        "origin": origin,
				        "destination": destination
				      }
				}
				  ]
				};

				//add points to geojson
				for(var point of points){
					geojson.features[0].geometry.coordinates.push([point[1],point[0]]);
				}

			    var data = JSON.stringify(geojson);
			    fs.writeFileSync(`test.json`,data);
	  		}
	});

}

//getDirectionsGeojson('Quetzaltenango, Guatemala', 'Nogales, AZ')
