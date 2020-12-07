$(document).ready(function(){

	// TODO media queries for 9:16 phones
	// TODO add comments
	// TODO close modals when clicking off them
	// TODO enable dark/light mode based on time

	$("#dark-mode").click(function(){
		if($(".page-content").hasClass("dark-mode")){
			$("#dark-mode").attr("src" , "img/dark-mode light.svg");
			$(".back , .close-landmark").attr("src" , "img/back-light.svg");
			$("#logo").attr("src" , "img/logo-light.svg")
			$(".card-background , .threesixty").css("filter" , "grayscale(1)")
		} else{
			$("#dark-mode").attr("src" , "img/dark-mode.svg");
			$(".back , .close-landmark").attr("src" , "img/back.svg");
			$("#logo").attr("src" , "img/logo.svg")
			$(".card-background , .threesixty").css("filter" , "grayscale(0)")
		}
	});

	// marker micro interactions

	$(".marker").hover(function(){
		$(this).siblings(".marker").addClass("marker-shrink")
	}, function(){
		$(this).siblings(".marker").removeClass("marker-shrink")
	});

	// change curson to grabbing while
	// the landmark is rotated

	$(".drag").mousedown(function(){
		$(this).css("cursor" , "grabbing")
	});

	$(".drag").mouseup(function(){
		$(this).css("cursor" , "grab")
	});

	// display city modal

	$.each(cities, function(index, cityId){
		var cityMarker = "#" + cityId;
		var cityModal = cityMarker + "-modal"
		$(cityMarker).click(function(){
			$(".marker").css({
				"pointer-events" : "none",
				"opacity" : "0"
			})
			$(cityModal).addClass("fly-in-appear active");
			$(cityModal).find(".landmark-card").each(function(i){
				setTimeout(function(){
					$(cityModal).find(".landmark-card").eq(i).css("opacity" , "1")
				}, 250 * i);
			});
			$("#logo , #dark-mode").css("transform" , "translateY(-150px)");
			$("#map").css("pointer-events" , "none");
		});
	})

	// display landmark modal

	$.each(landmarks, function(index, cardId){
		var landmarkCard = "#" + cardId;
		var landmarkModal = landmarkCard + "-info";
		$(landmarkCard).click(function(){
			$(landmarkModal).addClass("fly-in-appear active")
			$(".modal.active").removeClass("fly-in-appear").addClass("fly-in-disappear").css("pointer-events" , "none");
			$(".landmark-info-wrapper").css("z-index" , "1");
			if($(".landmark-info").hasClass("active")){
				$(".active").find(".threesixty").threeSixty({
					dragDirection: "horizontal"
				});
			} else{
			}
		});
	});

	// remove hero after cta-button is clicked

	$(".cta-button").click(function(){
		$("#map").css("pointer-events" , "auto")
		$(".hero-section #logo").siblings().addClass("fly-in-disappear");
		setTimeout(function(){
			$(".hero-section #logo").siblings().remove();
			$("#map, #logo").css("z-index" , "1");
		}, 1000);
		$(".marker").each(function(i){
			setTimeout(function(){
				$(".marker").eq(i).css("opacity" , "1")
			}, 200 * i)
		})
	});

	$(".close-landmark").click(function(){
		$(".landmark-info.active").removeClass("fly-in-appear active").addClass("fly-in-disappear");
		setTimeout(function(){
			$(".landmark-info-wrapper").css("z-index" , "-1");
			$(".landmark-info").removeClass("fly-in-disappear")
			$(".threesixty").destroy();
		}, 1000)
		$(".modal.active").removeClass("fly-in-disappear").addClass("fly-in-appear").css("pointer-events" , "auto")
	});

	// hide modal when back is clicked

	$(".back").click(function(){
		$("#logo , #dark-mode").css("transform" , "none");
		$("#map").css("pointer-events" , "auto");
		$(".landmark-card").css("opacity" , "0");
		$(".marker").css("opacity" , "1")
		if($(".modal").hasClass("fly-in-appear")){
			$(".modal.active").removeClass("fly-in-appear").addClass("fly-in-disappear");
			// $(".landmark-card").css("opactiy" , "0")
			setTimeout(function(){
				$(".modal").removeClass("fly-in-disappear active")
				$(".landmarks-section").scrollTop(0);
			}, 1000)
		} else{
		}
		setTimeout(function(){
			$(".marker").css("pointer-events" , "auto")
		}, 1000)
	});

	// set margin-top and margin-bottom
	// for first and last landmarks-cards
	// depending on window size

	function calcMargin(){
		var modalHeight = $(".modal").height();
		var infoHeight = $(".info-section").outerHeight();

		$(".landmarks-section").find(".landmark-card:first-of-type").css("margin-top" , modalHeight / 2 - infoHeight / 2)
		$(".landmarks-section").find(".landmark-card:last-of-type").css("margin-bottom" , modalHeight / 2 - infoHeight / 2)

	}
	// kickstart function

	calcMargin();

	// calculate margin everytime the window
	// is resized

	$(window).resize(function(){
		calcMargin();
	})
});