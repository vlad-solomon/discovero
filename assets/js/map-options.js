const PRIVATE_API_KEY =
	"pk.eyJ1IjoidmxhZHNvbG9tb24iLCJhIjoiY2s2bmRtcHlyMDlrcjNrcXB2ZW9naXEzbSJ9.DxhYkg_YSDRXynMaZg4VWw";
mapboxgl.accessToken = PRIVATE_API_KEY;

const lightTheme = "mapbox://styles/vladsolomon/ck6gcymgl32dp1imzprm4cua0";
const darkTheme = "mapbox://styles/vladsolomon/ck6tf98787m551imw9zcwn8h9";

let map = new mapboxgl.Map({
	container: "map",
	style: lightTheme,
	center: [24.9, 45.9],
	zoom: 6.5,
	maxBounds: [
		[16.41, 42.45],
		[34.1, 49.33],
	],
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

function mapResize() {
	if ($(window).width() < 900 && $(window).width() > 700) {
		map.setZoom(6);
	} else if ($(window).width() < 700) {
		map.setZoom(4.8);
	} else {
		map.setZoom(6.5);
	}
}

mapResize();

$(window).resize(function () {
	mapResize();
});

$.ajax({
	type: "GET",
	url: "assets/js/cities.geojson",
	dataType: "json",
	success: function (geojson) {
		geojson.features.forEach(function (marker) {
			let cityName = marker.properties.title;
			const mapMarker = document.createElement("div");

			mapMarker.className = "marker";
			mapMarker.setAttribute("id", marker.properties.title);

			$(mapMarker).append(`<p class="city-name">${cityName}</p>`);

			new mapboxgl.Marker(mapMarker)
				.setLngLat(marker.geometry.coordinates)
				.addTo(map);
		});
	},
});
