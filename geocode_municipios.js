const GoogleWizard = require("./googleWizard.js")
const municipiosText = require("./municipios.json");
const googleWizard = new GoogleWizard();
const fs = require('fs');

//load municipio data(csv to json, require directly)
var municipios = municipiosText.municipios;


function assignLocation(municipio){
	var location = municipio["Municipio"] + "," + municipio["departamento"] + "," + "Guatemala";
	googleWizard.geocode(location).then(location=> { municipio.location = location;});

}

for(var municipio of municipios){
	assignLocation(municipio);
}

setTimeout(function(){
	console.log(municipios);

	var geojson = {
				  "type": "FeatureCollection",
				  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
				  "features": []
				};

	for(var municipio of municipios){
		geojson.features.push({
				  	  "type": "Feature",
				      "geometry": {
				        "type": "Point",
				        "coordinates": [municipio.location.lng,municipio.location.lat]
				      },
				      "properties": {
				        "municipio": municipio.Municipio,
				        "departamento": municipio.departamento,
				        "deportados": municipio.total,
				        "menores": municipio.menores_m + municipio.menores_f
				      }
				})
	}

	var data = JSON.stringify(geojson);
	fs.writeFileSync(`geocoded_municipios.json`,data);


},15000);


