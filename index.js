mapboxgl.accessToken = '********************************************************************';
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: [88.30,22.30], // starting position [lng, lat]
zoom: 13 // starting zoom
});

   map.addControl(new mapboxgl.NavigationControl());
   map.addControl(
        new MapboxDirections({
        accessToken: mapboxgl.accessToken
        }),
        'top-left'
        );

        map.addControl(
         new MapboxGeocoder({
         accessToken: mapboxgl.accessToken,
         localGeocoder: coordinatesGeocoder,
         zoom: 4,
         placeholder: '        Search for place',
         mapboxgl: mapboxgl,
         
         reverseGeocode: true
         }),'bottom-right'
         );
         

   
         map.doubleClickZoom.enable();
         map.keyboard.enable();
   var layerList = document.getElementById('menu');
   var inputs = layerList.getElementsByTagName('input');
   
   function switchLayer(layer) {
   var layerId = layer.target.id;
   map.setStyle('mapbox://styles/mapbox/' + layerId);
   }
   
   for (var i = 0; i < inputs.length; i++) {
   inputs[i].onclick = switchLayer;
   }



   var coordinatesGeocoder = function (query) {
      // Match anything which looks like
      // decimal degrees coordinate pair.
      var matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      );
      if (!matches) {
      return null;
      }
       
      function coordinateFeature(lng, lat) {
      return {
      center: [lng, lat],
      geometry: {
      type: 'Point',
      coordinates: [lng, lat]
      },
      place_name: 'Lat: ' + lat + ' Lng: ' + lng,
      place_type: ['coordinate'],
      properties: {},
      type: 'Feature'
      };
      }
       
      var coord1 = Number(matches[1]);
      var coord2 = Number(matches[2]);
      var geocodes = [];
       
      if (coord1 < -90 || coord1 > 90) {
      // must be lng, lat
      geocodes.push(coordinateFeature(coord1, coord2));
      }
       
      if (coord2 < -90 || coord2 > 90) {
      // must be lat, lng
      geocodes.push(coordinateFeature(coord2, coord1));
      }
       
      if (geocodes.length === 0) {
      // else could be either lng, lat or lat, lng
      geocodes.push(coordinateFeature(coord1, coord2));
      geocodes.push(coordinateFeature(coord2, coord1));
      }
       
      return geocodes;
      };





