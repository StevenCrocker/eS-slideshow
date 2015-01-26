/* eS-slideshow v1.0 - Copyright (c) 2015 Steven Crocker (http://www.stevencrocker.com) */
jQuery.fn.eSslideshow = function(options) {
	// INITIALIZATION
	var eSslideshow = this, interval, slidenum = 1, onslide = 1;
	var settings = $.extend({
		speed: 500,	
		interval: 3000,
		delay: 0,
		pauseonhover: true,
		manual: false,
		navigation: true,
		navfactor: 15,
		prev: '&#9668;',
		next: '&#9658;',
		rounding: 20,
		pager: false,
		keyboard: true
	}, options);
	eSslideshow.addClass('eS-slideshow');
	eSslideshow.wrapInner('<div class="eS-slides"></div>');

	// PAGER
	if(settings.pager) { $('<div class="eS-pager"></div>').appendTo(eSslideshow); }
	eSslideshow.find('.eS-slides > *').each(function(){
		var slide = $(this);
		if(slide.is('div')) {
			slide.addClass('eS-slide');
		} else {
			slide.wrap('<div class="eS-slide"></div>');
			slide = slide.parent();
		}
		slide.data('slidenum', slidenum).addClass('eS-slide-'+slidenum);
		if(settings.pager) {
			$('<span class="eS-pager-'+slidenum+'"></span>').data('slidenum', slidenum).on('click', function(){
					var first = eSslideshow.find('.eS-slide:first')
					var slide = eSslideshow.find('.eS-slide-'+$(this).data('slidenum'))
					for(var i = eSslideshow.find('.eS-slide-'+$(this).data('slidenum')).index(); i > 0; i--) {
						eSslideshow.find('.eS-slide:first').appendTo(eSslideshow.find('.eS-slides'));
					}
					if(onslide!=$(this).data('slidenum')) {
						first.removeClass('eS-active').fadeOut(settings.speed);
						slide.addClass('eS-active').fadeIn(settings.speed);
					}
					updateslide();
			}).appendTo(eSslideshow.find('.eS-pager'));
		}
		slidenum++;
	});
	slidenum=1; eSslideshow.find('.eS-pager-1').addClass('eS-active');

	// GENERAL
	eSslideshow.find('.eS-slide:gt(0)').hide();
	$('<div class="eS-keeper"></div>').prependTo(eSslideshow);
	eSslideshow.find('img:first').clone().appendTo(eSslideshow.find('.eS-keeper'));

	// NAVIGATION
	if(settings.navigation) {
		$('<div class="eS-prev"><span>'+settings.prev+'</span></div>').on('click', function(){
			prev();
		}).appendTo(eSslideshow);
		$('<div class="eS-next"><span>'+settings.next+'</span></div>').on('click', function(){
			next();
		}).appendTo(eSslideshow);
	}

	// ACTIVE STATE
	eSslideshow.on('click',function(){
		$(this).addClass('eS-active').focus();
	});
	eSslideshow.on('blur',function(){
		$(this).removeClass('eS-active');
	});
	
	// KEYBOARD
	if(settings.keyboard) {
		eSslideshow.attr('tabindex','-1');
		eSslideshow.on('click',function(){ });
		eSslideshow.on('keydown',function(e){
			var key = e.keyCode || e.which;
			switch(e.which) {
				case 37: prev(); break;
				case 39: next(); break;
			}
		});
	}

	// PAUSEONHOVER
	if(settings.pauseonhover) {
		eSslideshow.hover(function(){
			clearInterval(interval);
		}, function(){
			if(!settings.manual) start();
		});
	}

	// FIX ARROW SIZE BASED ON CONTAINER SIZE
	$(window).on('resize',function(e){
		eSslideshow.find('.eS-prev span, .eS-next span').css({'font-size':eSslideshow.width()/settings.navfactor});
	}).resize();

	// START FUNCTION
	function start() {
		setTimeout(function(){
			interval = setInterval(function(){
				next();
			}, settings.interval);
		}, settings.delay);
	};
	
	// PREV FUNCTION
	function prev() {
		eSslideshow.find('.eS-slide:first').fadeOut(settings.speed).removeClass('eS-active');
		eSslideshow.find('.eS-slide:last').addClass('eS-active').prependTo(eSslideshow.find('.eS-slides')).fadeIn(settings.speed);
		updateslide();
	}

	// NEXT FUNCTION
	function next() {
		eSslideshow.find('.eS-slide:first').fadeOut(settings.speed).removeClass('eS-active').next().fadeIn(settings.speed).addClass('eS-active').end().appendTo(eSslideshow.find('.eS-slides'));
		updateslide();
	}
	
	// UPDATE CURRENT SLIDE
	function updateslide(){
		onslide = eSslideshow.find('.eS-slide.eS-active').data('slidenum');
		eSslideshow.find('.eS-pager span').removeClass('eS-active');
		eSslideshow.find('.eS-pager-'+onslide).addClass('eS-active');
	}

	// FINAL STYLE UPDATES
	eSslideshow.css({
		'-webkit-border-radius': settings.rounding,
		'border-radius': settings.rounding
	});
	eSslideshow.find('.eS-prev').css({
		'-webkit-border-top-left-radius': settings.rounding,
		'border-top-left-radius': settings.rounding,
		'-webkit-border-bottom-left-radius': settings.rounding,
		'border-bottom-left-radius': settings.rounding
	});
	eSslideshow.find('.eS-next').css({
		'-webkit-border-top-right-radius': settings.rounding,
		'border-top-right-radius': settings.rounding,
		'-webkit-border-bottom-right-radius': settings.rounding,
		'border-bottom-right-radius': settings.rounding
	});
	
	// START IF NOT MANUAL
	if(!settings.manual) start();
	return this;
};