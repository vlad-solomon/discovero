let lastX;
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
