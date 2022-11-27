import { d, db } from "./helpers.js";

let lastX = 0;
let currentFrame = 0;
let minFrame, maxFrame;

d.on("mousedown", ".drag.ready", function () {
	$(".drag.ready").css("cursor", "grabbing");
	minFrame = 0;
	maxFrame = $(".drag.ready").children("img").length - 1;

	d.on("mousemove", ".drag.ready", function (e) {
		let isMovingRight = e.pageX > lastX ? true : e.pageX < lastX ? false : "none";
		lastX = e.pageX;

		checkDirection(isMovingRight);
		showSelectedFrame();
	});
});

d.on("touchmove", ".drag.ready", function (e) {
	minFrame = 0;
	maxFrame = $(".drag.ready").children("img").length - 1;
	let isMovingRight = e.changedTouches[0].pageX > lastX ? true : e.changedTouches[0].pageX < lastX ? false : "none";
	lastX = e.changedTouches[0].pageX;

	checkDirection(isMovingRight);
	showSelectedFrame();
});

d.on("mouseup mouseleave", ".drag.ready", cleanDragHandlers);

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
	$(".drag.ready").children("img").removeAttr("style");
	$(".drag.ready").children("img").eq(currentFrame).css("display", "block");
}

function cleanDragHandlers() {
	d.off("mousemove", ".drag.ready");
	document.getSelection().removeAllRanges();
	$(".drag.ready").css("cursor", "grab");
}

export function loadLandmark(landmark) {
	lastX = 0;
	currentFrame = 0;
	let frames = [];
	for (let i = 0; i <= 60; i++) {
		let frame = new Image();
		frame.setAttribute("alt", `${landmark}-${i}`);
		frame.classList.add("frame");
		let url = `${db}/${landmark}/${landmark}${i}.jpg`;

		frame.load(url);
		frames.push({ frame });
		$(".drag").append(frame);
	}
	let progressInterval = setInterval(() => {
		let array = [];
		for (let k = 0; k < frames.length; k++) {
			array.push(frames[k].frame.completedPercentage);
		}
		let sum = array.reduce((partialSum, a) => partialSum + a, 0);
		let progress = Math.round(sum / array.length) + "%";

		$(".load-3d span").text(progress);
		$(".load-3d .progress").width(progress);

		if (progress === "100%") {
			clearInterval(progressInterval);
			$(".load-3d")
				.css("transition", "none")
				.fadeOut(400, function () {
					$(this).remove();
				});
			$(".drag .frame").first().fadeIn(400);
			$(".drag").removeClass("preloading").addClass("ready");
		}
	}, 500);
}
