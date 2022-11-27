import { d, db, cl } from "./helpers.js";
import { DATA } from "./fetch.js";
import { loadLandmark } from "./drag.js";

const { cities } = DATA;

$(".cta-button").click(function () {
	$(".buttons-wrapper").css("transform", "none");
	$("#map").css("pointer-events", "auto");
	$(".hero-section #logo").siblings().addClass("fly-in-disappear");

	setTimeout(function () {
		$(".hero-section #logo").siblings().remove();
		$("#map, #logo").css("z-index", "1");
	}, 1000);

	$(".marker").each(function (i) {
		setTimeout(function () {
			$(".marker").eq(i).css("opacity", "1");
		}, 200 * i);
	});
});

function computeMargin() {
	let modalHeight = $(".modal").height();
	let infoHeight = $(".info-section").outerHeight();

	$(".landmarks-section")
		.find(".landmark-card:first-of-type")
		.css("margin-top", modalHeight / 2 - infoHeight / 2);
	$(".landmarks-section")
		.find(".landmark-card:last-of-type")
		.css("margin-bottom", modalHeight / 2 - infoHeight / 2);
}

$(window).resize(computeMargin);

let cityInfo;

function showCity(selectedCity) {
	cityInfo = cities.find((city) => city.name === selectedCity);
	const { name: title, info, landmarks } = cityInfo;

	landmarks.map((landmark) => {
		return (landmark.url = landmark.name.toLowerCase().replace(/\s/g, "_"));
	});

	const cityModal = String.raw`
		<div class="info-section">
			<img class="back" src="assets/img/back.svg" alt="back">
			<span>${title}</span>
			${info
				.map((paragraph) => {
					return String.raw`<p>${paragraph}</p>`;
				})
				.join("")}
		</div>
		<div class="landmarks-section">
			${landmarks
				.map((landmark) => {
					return String.raw`
						<div class="landmark-card" data-landmark="${landmark.name}" style="background-image:url(${db}/e_blur:1000,c_fill,h_400,w_auto/${landmark.url}/${landmark.url}0.jpg);">
							<span>${landmark.name}</span>
							<img class="card-background cld-responsive" data-src="${db}/c_fill,h_400,w_auto/${landmark.url}/${landmark.url}0.jpg" alt="${landmark.name}">
						</div>`;
				})
				.join("")}
		</div>`;

	$(".modal").removeClass("skeleton").html(cityModal);
	computeMargin();
	cl.responsive();
}

d.on("click", ".marker", function () {
	const selectedCity = $(this).attr("id");

	$(".mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right").addClass("hidden");
	$(".buttons-wrapper").removeAttr("style").css("pointer-events", "none");
	$("#logo").css("transform", "translateY(-150px)");
	$("#map").css("pointer-events", "none");

	$(".marker").css({
		"pointer-events": "none",
		opacity: "0",
	});

	$(".page-content").append(String.raw`
		<div class="modal skeleton" >
			<div class="info-section">
				<span></span>
				<p><span></span><span></span><span></span><span></span></p>
				<p><span></span><span></span><span></span><span></span></p>
				<p><span></span><span></span><span></span><span></span></p>
				<p><span></span><span></span><span></span><span></span></p>
			</div>
			<div class="landmarks-section">
				<div class="landmark-card"><span></span></div>
				<div class="landmark-card"><span></span></div>
				<div class="landmark-card"><span></span></div>
				<div class="landmark-card"><span></span></div>
			</div>
		</div>`);
	computeMargin();
	$(".modal").addClass("fly-in-appear active");

	showCity(selectedCity);
});

d.on("click", ".landmark-card", function () {
	const selectedLandmark = $(this).data("landmark");
	const landmarkInfo = cityInfo.landmarks.find((landmark) => landmark.name === selectedLandmark);
	const { info, name: title, url } = landmarkInfo;

	let landmarkModal = String.raw`
		<div class="landmark-info">
			<img class="close-landmark" src="assets/img/back.svg" alt="back">
			<div class="info">
				<span>${title}</span>
				${info
					.map((paragraph) => {
						return String.raw`<p>${paragraph}</p>`;
					})
					.join("")}
			</div>
			<div class="drag" style="background-image: url(${db}/e_blur:1000/${url}/${url}0.jpg)">
				<div class="load-3d" data-landmark="${url}" style="transition:none">
					<span></span>
					<img src="assets/img/model.svg" id="load-3d-icon">
				</div>
				<img src="${db}/${url}/${url}0.jpg" alt="${title}">
			</div>
		</div>`;

	$(".modal.active").removeClass("fly-in-appear").addClass("fly-in-disappear").css("pointer-events", "none");
	$(".landmark-info-wrapper").css("z-index", "1").append(landmarkModal);
	$(".landmark-info").addClass("fly-in-appear active");
});

d.on("click", ".back", function () {
	$(".mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right").removeClass("hidden");
	$("#logo , .buttons-wrapper").css("transform", "none");
	$("#map").css("pointer-events", "auto");
	$(".landmark-card").css("opacity", "0");
	$(".marker").css("opacity", "1");
	if ($(".modal").hasClass("fly-in-appear")) {
		$(".modal.active").removeClass("fly-in-appear").addClass("fly-in-disappear");
		$(".landmark-card").css("opacity", "0");
		setTimeout(function () {
			$(".buttons-wrapper").css("pointer-events", "auto");
			$(".modal").removeClass("fly-in-disappear active");
			$(".landmarks-section").scrollTop(0);
			$(".modal").remove();
		}, 1000);
	} else {
	}
	setTimeout(function () {
		$(".marker").css("pointer-events", "auto");
	}, 1000);
});

d.on("click", ".close-landmark", function () {
	$(".landmark-info.active").removeClass("fly-in-appear active").addClass("fly-in-disappear");
	$(".modal.active").removeClass("fly-in-disappear").addClass("fly-in-appear");
	setTimeout(function () {
		$(".landmark-info-wrapper").css("z-index", "-1");
		$(".landmark-info").removeClass("fly-in-disappear");
		$(".modal.active").css("pointer-events", "auto");
		$(".landmark-info").remove();
	}, 1000);
});

d.on("click", ".load-3d", function () {
	let selectedLandmark = $(this).attr("data-landmark");
	$(".load-3d span").text("0%");
	$("#load-3d-icon").remove();
	$(".drag")
		.addClass("preloading")
		.children("img")
		.first()
		.fadeOut(400, function () {
			$(this).remove();
		});

	$(this).addClass("loading");
	$(this).append("<div class='progress'></div>");

	loadLandmark(selectedLandmark);
});

let theme = "light";

d.on("click", "#toggle-theme", function () {
	theme = theme === "light" ? "dark" : "light";
	map.setStyle(mapThemes[theme]);
	$(".page-content, #map, .buttons-wrapper").toggleClass("dark-mode");
});

const creditsModal = String.raw`
	<div class="modal modal-credits">
		<div class="credits">
			<img src="assets/img/back.svg" alt="back" id="close-credits">
 			<span>About Discovero</span>
			<p>Romania is a southeastern European country known for the forested region of Transylvania, ringed by the Carpathian Mountains. Discovero is a website meant for discovering the country of Romania. Pick a city, pick a landmark and start exploring.</p>
			<p>Made possible with the help of Mapbox, Wikipedia, Cloudinary, Google Earth and Google Earth Studio.</p>
			<p>If you want to support me, this project or my other ideas, <a href="https://www.buymeacoffee.com/vladsolomon" target="_blank">buy me a coffee.</a></p>
			<span class="footer">Designed & developed by <a href="https://vlad-solomon.github.io/" target="_blank">Vlad Solomon</a></span>
		</div>
	</div>`;

d.on("click", "#toggle-credits", function () {
	$(".buttons-wrapper").removeAttr("style").css("pointer-events", "none");
	$(".page-content").append(creditsModal);
	$(".modal").addClass("fly-in-appear active");
	$("#map, .marker").css("pointer-events", "none");
});

d.on("click", "#close-credits", function () {
	$(".buttons-wrapper").css("transform", "none");
	$(".modal-credits").removeClass("fly-in-appear").addClass("fly-in-disappear");
	setTimeout(function () {
		$(".modal-credits").remove();
		$(".buttons-wrapper, #map, .marker").css("pointer-events", "auto");
	}, 1000);
});
