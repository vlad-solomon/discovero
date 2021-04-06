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

let isDark, backIcon, logoIcon, toggleIcon, creditsIcon, modelIcon, mapTheme;

function checkTheme() {
	backIcon = isDark
		? "assets/img/back dark-theme.svg"
		: "assets/img/back light-theme.svg";
	logoIcon = isDark
		? "assets/img/logo dark-theme.svg"
		: "assets/img/logo light-theme.svg";
	toggleIcon = isDark
		? "assets/img/toggle dark-theme.svg"
		: "assets/img/toggle light-theme.svg";
	creditsIcon = isDark
		? "assets/img/credits dark-theme.svg"
		: "assets/img/credits light-theme.svg";
	modelIcon = isDark
		? "assets/img/load-model dark-theme.svg"
		: "assets/img/load-model light-theme.svg";
	mapTheme = isDark ? darkTheme : lightTheme;
}

checkTheme();

$("#toggle-theme").click(function () {
	isDark = !isDark;
	checkTheme();

	map.setStyle(mapTheme);
	$("#toggle-theme img").attr("src", toggleIcon);
	$("#toggle-credits img").attr("src", creditsIcon);
	$("#logo").attr("src", logoIcon);
	$("#map").toggleClass("dark-mode");
	$(".page-content").toggleClass("dark-mode");
	$(".buttons-wrapper").toggleClass("dark-mode");
});

function calcMargin() {
	var modalHeight = $(".modal").height();
	var infoHeight = $(".info-section").outerHeight();

	$(".landmarks-section")
		.find(".landmark-card:first-of-type")
		.css("margin-top", modalHeight / 2 - infoHeight / 2);
	$(".landmarks-section")
		.find(".landmark-card:last-of-type")
		.css("margin-bottom", modalHeight / 2 - infoHeight / 2);
}

$(window).resize(function () {
	calcMargin();
});

const pageContent = $(".page-content");
const db = "https://res.cloudinary.com/dbkhowucg/image/upload/v1616846631";

const cityModal = `
	<div class="modal">
		<div class="info-section">
			<img class="back" src="${backIcon}" alt="back">
		</div>
		<div class="landmarks-section"></div>
	</div>
`;

const landmarkModal = `
	<div class="landmark-info">
		<img class="close-landmark" src="${backIcon}" alt="back">
		<div class="info"></div>
		<div class="drag">
			<div class="load-3d">
				<span></span>
				<img src="${modelIcon}" id="load-3d-icon">
			</div>
		</div>
	</div>
`;

const creditsModal = `
	<div class="modal modal-credits">
		<div class="credits">
			<img src="${backIcon}" alt="back" id="close-credits">
 			<span>About Discovero</span>
			<p>Romania is a southeastern European country known for the forested region of Transylvania, ringed by the Carpathian Mountains. Discovero is a website meant for discovering the country of Romania. Pick a city, pick a landmark and start exploring.</p>
			<p>Made possible with the help of Mapbox, Wikipedia, Cloudinary, PreloadJS, Google Earth and Google Earth Studio.</p>
			<p>If you want to support me, this project or my other ideas, <a href="https://www.buymeacoffee.com/vladsolomon" target="_blank">buy me a coffee.</a></p>
			<span class="footer">Designed & developed by <a href="https://github.com/vlad-solomon" target="_blank">Vlad Solomon</a></span>
		</div>
	</div>`;

$("#toggle-credits").click(function () {
	$(".buttons-wrapper").removeAttr("style").css("pointer-events", "none");
	pageContent.append(creditsModal);
	$(".modal").addClass("fly-in-appear active");
	$("#map").css("pointer-events", "none");
	$(".marker").css("pointer-events", "none");

	if (pageContent.hasClass("dark-mode")) {
		$("#close-credits").attr("src", backIcon);
	}
});

$(document).on("click", "#close-credits", function () {
	$(".buttons-wrapper").css("transform", "none");
	$(".modal-credits")
		.removeClass("fly-in-appear")
		.addClass("fly-in-disappear");
	setTimeout(function () {
		$(".modal-credits").remove();
		$(".buttons-wrapper").css("pointer-events", "auto");
		$("#map").css("pointer-events", "auto");
		$(".marker").css("pointer-events", "auto");
	}, 1000);
});

$(document).on("click", ".marker", function () {
	let selectedCity = $(this).attr("id");

	$(".mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right").addClass(
		"hidden"
	);
	$(".buttons-wrapper").removeAttr("style").css("pointer-events", "none");
	$("#logo").css("transform", "translateY(-150px)");
	$("#map").css("pointer-events", "none");

	$(".marker").css({
		"pointer-events": "none",
		opacity: "0",
	});

	pageContent.append(cityModal);
	$(".modal").addClass("fly-in-appear active");

	if (pageContent.hasClass("dark-mode")) {
		$(".back").attr("src", backIcon);
	}

	$.ajax({
		type: "GET",
		url: `assets/cities/${selectedCity}.json`,
		dataType: "json",
		success: function (city) {
			let cl = cloudinary.Cloudinary.new();

			const infoSection = $(".modal .info-section");
			const landmarksSection = $(".modal .landmarks-section");

			let cityName = `<span>${city.name}</span>`;
			infoSection.append(cityName);

			for (i = 0; i < city.info.length; i++) {
				let cityInfo = `<p>${city.info[i]}</p>`;
				infoSection.append(cityInfo);
			}

			for (i = 0; i < city.landmarks.length; i++) {
				let landmarkName = city.landmarks[i].name;
				let landmarkUrl = (city.landmarks[
					i
				].url = landmarkName.toLowerCase().replace(/\s/g, "_"));

				let initialCardLandmark = `${db}/${landmarkUrl}/${landmarkUrl}0.jpg`;
				let optimizedCardLandmark = initialCardLandmark.replace(
					"upload",
					"upload/c_fill,h_400,w_auto"
				);
				let blurredCardLandmark = initialCardLandmark.replace(
					"upload",
					"upload/e_blur:1000,c_fill,h_400,w_auto"
				);

				let landmarkCard = `
					<div class="landmark-card" style="background-image:url(${blurredCardLandmark})">
						<span>${landmarkName}</span>
						<img class="card-background cld-responsive" data-src="${optimizedCardLandmark}" alt="card-bg">
					</div>
				`;

				landmarksSection.append(landmarkCard);

				cl.responsive();

				if (pageContent.hasClass("dark-mode")) {
					$(".landmarks-section").css("filter", "brightness(0.8)");
				}
			}

			calcMargin();

			$(".modal")
				.find(".landmark-card")
				.each(function (i) {
					setTimeout(function () {
						$(".modal")
							.find(".landmark-card")
							.eq(i)
							.css("opacity", "1");
					}, 200 * i);
				});

			$(".landmark-card").click(function () {
				$(".modal.active")
					.removeClass("fly-in-appear")
					.addClass("fly-in-disappear")
					.css("pointer-events", "none");
				$(".landmark-info-wrapper")
					.css("z-index", "1")
					.append(landmarkModal);
				$(".landmark-info").addClass("fly-in-appear active");

				if (pageContent.hasClass("dark-mode")) {
					$(".close-landmark").attr("src", backIcon);
					$("#load-3d-icon").attr("src", modelIcon);
				}

				let selectedLandmarkIndex = $(this).index();
				const landmarkInfoSection = $(".landmark-info .info");
				const landmarkImageSection = $(".landmark-info .drag");

				let selectedLandmarkName = `<span>${city.landmarks[selectedLandmarkIndex].name}</span>`;
				landmarkInfoSection.append(selectedLandmarkName);

				for (
					i = 0;
					i < city.landmarks[selectedLandmarkIndex].info.length;
					i++
				) {
					let selectedLandmarkInfo = `<p>${city.landmarks[selectedLandmarkIndex].info[i]}`;
					landmarkInfoSection.append(selectedLandmarkInfo);
				}

				let landmarkUrl = city.landmarks[selectedLandmarkIndex].url;

				let initialImage = `${db}/${landmarkUrl}/${landmarkUrl}0.jpg`;
				let blurredInitialImage = initialImage.replace(
					"upload",
					"upload/e_blur:1000"
				);

				landmarkImageSection.css(
					"background-image",
					`url(${blurredInitialImage})`
				);
				landmarkImageSection.append(
					`<img src="${initialImage}" alt="initial-image">`
				);

				if (pageContent.hasClass("dark-mode")) {
					$(".drag").css("filter", "brightness(0.8)");
				}

				$(".load-3d").click(function () {
					$(".load-3d span").text("0%");
					$("#load-3d-icon").remove();
					landmarkImageSection.addClass("preloading");
					landmarkImageSection
						.children("img")
						.eq(0)
						.fadeOut(400, function () {
							$(this).remove();
						});

					$(this).addClass("loading");
					$(this).append("<div class='progress'></div>");

					let queue = new createjs.LoadQueue(true);
					queue.on("fileload", handleFileComplete);

					for (i = 0; i < 60; i++) {
						let frame = `${db}/${landmarkUrl}/${landmarkUrl}${i}.jpg`;
						queue.loadFile(frame);
					}

					$(".close-landmark").click(function () {
						queue.removeAll();
					});
				});

				function handleFileComplete(event) {
					let loadedFile = event.result;
					landmarkImageSection.append(loadedFile);

					let increment = 1.6666;
					let updatedProgress = (
						landmarkImageSection.children("img").length * increment
					).toFixed(0);

					$(".load-3d span").text(`${updatedProgress}%`);
					$(".load-3d .progress").css("width", `${updatedProgress}%`);

					for (i = 0; i < 60; i++) {
						landmarkImageSection
							.children("img")
							.eq(i)
							.addClass("frame");
					}

					if (landmarkImageSection.children().length > 60) {
						$(".load-3d").remove();
						landmarkImageSection
							.children("img")
							.eq(0)
							.css("display", "block");
						landmarkImageSection.removeClass("preloading");
						landmarkImageSection.addClass("ready");
					}
				}

				let lastX = null;
				let currentFrame = 0;
				let minFrame, maxFrame;

				landmarkImageSection.on({
					mousedown: function () {
						if (landmarkImageSection.hasClass("ready")) {
							landmarkImageSection.css("cursor", "grabbing");
							minFrame = 0;
							maxFrame =
								landmarkImageSection.children().length - 1;

							landmarkImageSection.mousemove(function (e) {
								let isMovingRight =
									e.pageX > lastX
										? true
										: e.pageX < lastX
										? false
										: "none";
								lastX = e.pageX;

								checkDirection(isMovingRight);
								showSelectedFrame();
							});
						}
					},
					touchmove: function (e) {
						if (landmarkImageSection.hasClass("ready")) {
							minFrame = 0;
							maxFrame =
								landmarkImageSection.children().length - 1;
							let isMovingRight =
								e.changedTouches[0].pageX > lastX
									? true
									: e.changedTouches[0].pageX < lastX
									? false
									: "none";
							lastX = e.changedTouches[0].pageX;

							checkDirection(isMovingRight);
							showSelectedFrame();
						}
					},
					mouseup: function () {
						cleanDragHandlers();
					},
					mouseleave: function () {
						cleanDragHandlers();
					},
				});

				function checkDirection(condition) {
					if (condition) {
						currentFrame = currentFrame + 1;
					} else {
						currentFrame = currentFrame - 1;
					}

					if (currentFrame < minFrame) {
						currentFrame = maxFrame;
					}
					if (currentFrame > maxFrame) {
						currentFrame = minFrame;
					}
				}

				function showSelectedFrame() {
					landmarkImageSection.children("img").removeAttr("style");
					landmarkImageSection
						.children("img")
						.eq(currentFrame)
						.css("display", "block");
				}

				function cleanDragHandlers() {
					document.getSelection().removeAllRanges();
					if (landmarkImageSection.hasClass("ready")) {
						landmarkImageSection.css("cursor", "grab");
					}
					landmarkImageSection.unbind("mousemove");
				}
			});
		},
	});
});

pageContent.on("click", ".back", function () {
	$(".mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right").removeClass(
		"hidden"
	);
	$("#logo , .buttons-wrapper").css("transform", "none");
	$("#map").css("pointer-events", "auto");
	$(".landmark-card").css("opacity", "0");
	$(".marker").css("opacity", "1");
	if ($(".modal").hasClass("fly-in-appear")) {
		$(".modal.active")
			.removeClass("fly-in-appear")
			.addClass("fly-in-disappear");
		$(".landmark-card").css("opactiy", "0");
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

pageContent.on("click", ".close-landmark", function () {
	$(".landmark-info.active")
		.removeClass("fly-in-appear active")
		.addClass("fly-in-disappear");
	$(".modal.active")
		.removeClass("fly-in-disappear")
		.addClass("fly-in-appear");
	setTimeout(function () {
		$(".landmark-info-wrapper").css("z-index", "-1");
		$(".landmark-info").removeClass("fly-in-disappear");
		$(".modal.active").css("pointer-events", "auto");
		$(".landmark-info").remove();
	}, 1000);
});
