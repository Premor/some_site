$(document).ready(function() {


	//md5 password hash
	$('.log_pass').on('submit', function() {
		var pass = $("input[name$='pass']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		$.ajax({
			url: '/login',
			type: 'POST',
			data: {'log' : $('input[name$="log"]').val(), 'pass': md5_hash_pass},
			success: function(data) {
				if (data == 'suc') {
					window.location.replace('/');
				}
			}
		})
		return false;
	})

	$('.adm_pass').on('submit', function() {
		var pass = $("input[name$='pass']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		$.ajax({
			url: '/admlogin',
			type: 'POST',
			data: {'log' : $('input[name$="log"]').val(), 'pass': md5_hash_pass},
			success: function(data) {
				if (data == 'sopel') {
					window.location.replace('/');
				}
			}
		})
		return false;
	})

	$('.albumschange_form').on('click','.delbut',function() {
		var engName = $(this).parents('.albumschange_form').children('.danone').val();
		$.ajax({
			url: '/albumschange',
			type: 'DELETE',
			data: {'name' : engName},
			success: function (data) {
				if (data == 'pisos') {
					window.location.replace('/albumschange');
				} else if (data == 'pidaras') {
					alert ('Error : 228 (Вас убьют и сварят в кислоте)')
					window.location.replace('/albumschange');
				}
			}
		})
		return false;
	})

	$('.reg_pass').on('submit', function() {
		var pass = $("input[name$='pass']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		$.ajax({
			url: '/registration',
			type: 'POST',
			data: {'pass': md5_hash_pass, 'mbphn': $('input[name$="mbphn"]').val(), 'email' : $('input[name$="email"]').val()}
		})
		return false;
	})



	$('.adder').on('submit', function() {
		var formData = new FormData($(this).get(0));
		var list = JSON.parse(formData.getAll('chiposa'));
		var alBool = true;
		formData.delete('chiposa');
		for (var i=0; i < list.english.length; i++) {
			if ((list.english[i] == formData.getAll('new_album_en'))||(list.russian[i] == formData.getAll('new_album_ru'))) {
				alBool = false;
				break;
			}
		}
		if (alBool) {
			$.ajax({
				url: '/albumschange',
      	type: 'POST',
				processData: false,
				contentType: false,
				data: formData,
				complete: location.reload(true)
			})
		} else {
			alert('Русское или английское название уже используется.');
		}
		return false;
	})

	$('form').on('click','.del',function() {
		var needImg = $(this).parents('.parTest').children('.sobka');
		var lastEl = needImg.attr('src').slice(needImg.attr('src').length-1);
		var albumPath = $("#ph_" + lastEl).val();
		$.ajax({
			url: '/albumschange/'+ albumPath,
			type: 'DELETE',
			data: {'photo_num':lastEl, 'count': $("#co").val()}
		})
	});

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
