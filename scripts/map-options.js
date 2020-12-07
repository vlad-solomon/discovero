// mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZHNvbG9tb24iLCJhIjoiY2s2bmRtcHlyMDlrcjNrcXB2ZW9naXEzbSJ9.DxhYkg_YSDRXynMaZg4VWw'
mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZHNvbG9tb24iLCJhIjoiY2s2Y2x1a2ZmMGMzbjNob21rZ3lrZGs3NiJ9.-7ivvFNATm6tIxS1cZAeXg' //public key for testing

// map light style
var light = 'mapbox://styles/vladsolomon/ck6gcymgl32dp1imzprm4cua0'
// map dark style
var dark =  'mapbox://styles/vladsolomon/ck6tf98787m551imw9zcwn8h9'

var map = new mapboxgl.Map({
	container: "map",
	style: light,
	center: [24.9, 45.9],
	zoom: 6.5,
});

// toggle light and dark mode

$("#dark-mode").click(function(){
  $("#map").toggleClass("dark");
  $(".page-content").toggleClass("dark-mode")
  if($("#map").hasClass("dark")){
    map.setStyle(dark)
  } else{
    map.setStyle(light)
  }
});

function mapResize(){
  if($(window).width() < 900 && $(window).width() > 700){
    map.setZoom(6)
  } else if($(window).width() < 700){
    map.setZoom(4.8)
  } else{
    map.setZoom(6.5)
  }
}

mapResize();

$(window).resize(function(){
  mapResize();
})


// map.scrollZoom.disable();

geojson.features.forEach(function(marker) {

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';
  // set marker id to the title given in the cities.geojson file
  el.setAttribute("id" , marker.properties.title)

  var cityName = marker.properties.title;

  $(el).append("<p class='city-name'>" +cityName+ "</p>")


  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
});
