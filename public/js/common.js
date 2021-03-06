"use strict";

$(document).ready(function() {
	var f = 0;
	var i = 0, buf = '';
	for(i=0; i<location.href.length; i++) {
		if (f==3) {
			console.log(i);
			buf=location.href.slice(i);
			var j=0;
			for(j=0; j<buf.length; j++) {
				if (buf[j]=='/') {
					buf=buf.slice(0,j);
				}
			}
			break;
		} else if (location.href[i]=='/') f++;
	}

	
	$('.click_for_swipe').on('click',function() {
		var ourId = $(this).parents('.courses_header').children('.hidden_from_eyes').attr('id');
		$('#' + ourId).attr( "style", "display: block !important;" )
		var arrowDown = $(this).children('.fa-caret-down');
		var arrowUp =$(this).children('.fa-caret-up')
		if($(this).attr('clicked')=='false') {
			$('#' + ourId).attr( "style", "display: block !important;" )
			$(this).attr("clicked",true);
			arrowUp.attr( "style", "display: inline-block !important;" );
			arrowDown.attr( "style", "display: none !important;" )
		} else {
			$('#' + ourId).attr( "style", "display: none !important;" )
			arrowUp.attr( "style", "display: none !important;" );
			arrowDown.attr( "style", "display: inline-block !important;" )
			$(this).attr("clicked",false);
		}
	})

	if (buf.indexOf('?')!=-1) buf=buf.slice(0,buf.indexOf('?')); 	
	var message = '';
	buf = buf + '_selected'
	console.log('.'+buf)
	var heightToChange=$('.' + buf).css('height');
	heightToChange=parseInt(heightToChange)-1;
	$('.' + buf).css({'backgroundColor':'#6B1453', 'font-weight':'700', 'height' : heightToChange + 'px'})
	var date = new Date();
	var hour = date.getHours();
	if((hour>=0)&&(hour<6)) {
		message = "Доброй ночи";
	} else if ((hour>=6)&&(hour<12)) {
		message = "Доброе утро"
	} else if ((hour>=12)&&(hour<18)) {
		message = "Добрый день"
	} else {
		message = "Добрый вечер"
	}

	name = $('.username_in_tel').text();
	console.log((name).indexOf(' '));
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0'];
	if (name[0] in alphabet) {
		$('.username_in_tel').text(message + ', ' + name + '!');
	} else {
		$('.username_in_tel').text(message + '!');
	}

	//md5 password hash
	$('.log_pass').on('submit', function() {
		var pass = $("input[name$='pass']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		console.log(pass);
		$.ajax({
			url: '/login',
			type: 'POST',
			data: {'log' : $('input[name$="log"]').val(), 'pass': md5_hash_pass},
			success: function(data) {
				if (data == 'suc adm true') {
					window.location.replace('/admin');
				} else
					if (data == 'suc adm false') {
						window.location.replace('/')
					}
			}
		})
		return false;
	})

	$('.log_pass_mobi').on('submit', function() {
		var pass = $("input[name$='pass_mobi']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		console.log(pass);
		$.ajax({
			url: '/login',
			type: 'POST',
			data: {'log' : $('input[name$="log_mobi"]').val(), 'pass': md5_hash_pass},
			success: function(data) {
				if (data == 'suc adm true') {
					window.location.replace('/admin');
				} else
					if (data == 'suc adm false') {
						window.location.replace('/')
					}
			}
		})
		return false;
	})

/*	$('.user-data-change').on('click', function () {
		$(this).parents('form').html('<p>Sobaka</p>');
	})*/
/*
	$('.adm_pass').on('submit', function() {
		var pass = $("input[name$='pass']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		$.ajax({
			url: '/admlogin',
			type: 'POST',
			data: {'log' : $('input[name$="log"]').val(), 'pass': md5_hash_pass},
			success: function(data) {
				if (data == 'sopel') {
					window.location.replace('/admin');
				}
			}
		})
		return false;
	})*/


	$('.prev_month').on('click',function(){
		var month = $(this).attr('data');
		$.ajax({
			url: '/shedule'+month,
			type: 'get',
			success: window.location.replace('/shedule'+month)
		})
	})

	$('.next_month').on('click',function(){
		var month = $(this).attr('data');
		$.ajax({
			url: '/shedule'+month,
			type: 'get',
			success: window.location.replace('/shedule'+ month)
		})
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

	$('.albumschange_form').on('click', '.dibl', function() {
		var engName = $(this).parents('.albumschange_form').children('.danone').val();
		$.ajax({
			url: '/albumschange',
			type: 'POST',
			data: {'album_name' : engName},
			success: function (data) {
				if (data == 'verify') {
					window.location.replace('/albumschange/' + engName);
				}
			}
		})
		return false;
	})

	$('.reg_pass').on('submit', function() {
		var pass = $("input[name$='pass']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		alert($('input[name$="pass"]').val());
		$.ajax({
			url: '/registration',
			type: 'POST',
			data: {'pass': md5_hash_pass, 'mbphn': $('input[name$="mbphn"]').val(), 'email' : $('input[name$="email"]').val()},
			success: function(data) {
					if (data == 'suc') {
						window.location.replace('/login');
					}
				}
		})
		return false;
	})

	$('.reg_pass_mobi').on('submit', function() {
		var pass = $("input[name$='passmobi']").val();
		var md5_hash_pass = $.md5(pass, null, false);
		$.ajax({
			url: '/registration',
			type: 'POST',
			data: {'pass': md5_hash_pass, 'mbphn': $('input[name$="mbphnmobi"]').val(), 'email' : $('input[name$="emailmobi"]').val()},
			success: function(data) {
					if (data == 'suc') {
						window.location.replace('/login');
					}
				}
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
				success: function(data) {
					if (data == 'suc') {
						window.location.replace('/albumschange');
					}
				}
			})
		} else {
			alert('Русское или английское название уже используется.');
		}
		return false;
	})
	$('form').on('click','.del',function() {
		var needImg = $(this).parents('.parTest').children('.sobka');
		var path = needImg.attr('src');
		var lastEl = path.slice(path.lastIndexOf('/')+1, path.lastIndexOf('.'));
		var albumPath = $("#ph_" + lastEl).val();
		$.ajax({
			url: '/albumschange/'+ albumPath,
			type: 'DELETE',
			data: {'photo_num':lastEl, 'count': $("#co").val()}
		})
	});

	$('form').on('click','.del_course',function() {
		var buf = $(this).parents('form').children('input');
		var number = buf.val();
		$.ajax({
			url: '/courseschange',
			type: 'DELETE',
			data: {'number':number},
			success: function(data) {
				if (data == 'suc') window.location.assign('/courseschange');
				location.reload();
				alert('SUC');
			}
		})
	})

	$('.addingBlockForm').on('click','.addCourse',function() {
		var rName = ($(this).parents('.addingBlockForm').children('.rusNameCourse')).val();
		var eName = ($(this).parents('.addingBlockForm').children('.engNameCourse')).val();
		var price = ($(this).parents('.addingBlockForm').children('.priceCourse')).val();
		var briefing = ($(this).parents('.addingBlockForm').children('.briefingCourse')).val();
		$.ajax({
			url: 'courseschange',
			type: 'POST',
			data: {'eng_name':eName,
						 'rus_name':rName,
						 'price': price,
						 'briefing': briefing,
						 'program': ["sobaka", "cloaka"]
			},
			success: function(data) {
				if (data == 'suc') /*window.location.assign('/courseschange');*/
					location.reload();
				alert('SUC');
			}
		})
	})

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

	$('.datachanger').on('click','button',function(){
		var name = $(this).children('.name_change').val();
		var surname = $(this).children('.surname_change').val();
		var mobile = $(this).children('.mobile_change').val();
		var email = $(this).children('.email_change').val();
		$.ajax({
			url: '/changedata',
			type: 'POST',
			data: {
				'name':name,
				'surname':surname,
				'mobile':mobile,
				'email':email
			},
			success: function(data) {
				if (data == 'suc') window.location.assign('/perarea');
				location.reload();
				alert('Данные изменены успешно!');
			}
		})
	})


	//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	false
	});


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
