$(document).ready(function() {


	//md5 password hash
	/*var pass = $("input[name$='pass']").val();
	var md5_hash_pass = $.md5(pass, null, true);
	$.post(
		"/login",
		md5_hash_pass,
		rightOrWrong
	)

	function rightOrWrong(data) {
		if (data) {

		}
		else {

		}
	}*/
/*
	function getZapros() {
		var xhr = new XMLHttpRequest();
		var params = 'data=' + encodeURIComponent(list[i]);
		xhr.open("GET", '/photos/' + params, true);
		xhr.onreadystatechange = ...;
		xhr.send();
	};*/
/*
$(".album_form").submit(function() {
	$.ajax({
		type: "GET",
		url: "pozner",
		data: {name: list[i]}
	});
	return false;
});*/
	
	/*$("form#sob").submit(function() {
		$.ajax({
			type: "GET",
			url: "/photos",
			data: $("form#sob").serialize()
		})
		alert($("form#sob").serialize())
	})
*/

	$('.owl-carousel').owlCarousel({
		loop: true,
		//nav: true,
		autoplay:true,
    autoplayTimeout:6000,
    autoplayHoverPause:true,
		navText: ["<i class=\"fa fa-angle-left\" aria-hidden=\"true\"></i>","<i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i>"],
		nav: true,
		responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
	});

	//Таймер обратного отсчета
	//Документация: http://keith-wood.name/countdown.html
	//<div class="countdown" date-time="2015-01-07"></div>
	var austDay = new Date($(".countdown").attr("date-time"));
	$(".countdown").countdown({until: austDay, format: 'yowdHMS'});

	//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox();

	//Навигация по Landing Page
	//$(".top_mnu") - это верхняя панель со ссылками.
	//Ссылки вида <a href="#contacts">Контакты</a>
	$(".top_mnu").navigation();

	//Добавляет классы дочерним блокам .block для анимации
	//Документация: http://imakewebthings.com/jquery-waypoints/
	$(".block").waypoint(function(direction) {
		if (direction === "down") {
			$(".class").addClass("active");
		} else if (direction === "up") {
			$(".class").removeClass("deactive");
		};
	}, {offset: 100});

	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$("a.scroll").click(function() {
		$.scrollTo($(".div"), 800, {
			offset: -90
		});
	});
	//Кнопка "Наверх"
	//Документация:
	//http://api.jquery.com/scrolltop/
	//http://api.jquery.com/animate/
	$("#top").click(function () {
		$("body, html").animate({
			scrollTop: 0
		}, 800);
		return false;
	});

});
