import { d } from "./helpers.js";
import { DATA } from "./fetch.js";
const { geo } = DATA;

mapboxgl.accessToken = "pk.eyJ1IjoidmxhZHNvbG9tb24iLCJhIjoiY2s2bmRtcHlyMDlrcjNrcXB2ZW9naXEzbSJ9.DxhYkg_YSDRXynMaZg4VWw";

export const mapThemes = {
	light: "mapbox://styles/vladsolomon/ck6gcymgl32dp1imzprm4cua0",
	dark: "mapbox://styles/vladsolomon/ck6tf98787m551imw9zcwn8h9",
};

const mapOptions = {
	container: "map",
	style: mapThemes.light,
	center: [24.9, 45.9],
	zoom: 6.5,
	maxBounds: [
		[16.41, 42.45],
		[34.1, 49.33],
	],
};

let theme = "light";

d.on("click", "#toggle-theme", function () {
	theme = theme === "light" ? "dark" : "light";
	map.setStyle(mapThemes[theme]);
	$(".page-content, #map, .buttons-wrapper").toggleClass("dark-mode");
});

const map = new mapboxgl.Map(mapOptions);

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

$(window).resize(mapResize);

function showMap() {
	$(".hero-section").removeClass("map-is-loading");
	$(".overlay #spinner").fadeOut(200);
	$("#map").removeClass("loading");
	setTimeout(() => {
		$(".overlay").fadeOut(500, function () {
			$(this).remove();
		});
	}, 1000);
}

function showMarkers() {
	geo.features.forEach((city) => {
		const marker = document.createElement("div");
		marker.innerHTML = String.raw`
			<div class="marker" id="${city.properties.title}">
				<p class="city-name">${city.properties.title}</p>
			</div>`;
		new mapboxgl.Marker(marker).setLngLat(city.geometry.coordinates).addTo(map);
	});
	map.on("load", showMap);
}

showMarkers();
