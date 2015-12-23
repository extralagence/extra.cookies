/****************
 *
 *
 *
 * EXTRA COOKIES 1.0
 * Documentation and examples on http://cookies.extralagence.com
 *
 *
 *
 ****************/
(function ($) {
	'use strict';
	/*global console, jQuery, $, window, TweenMax, TimelineMax, Quad */
	var $window = window.$window || $(window);

	$.fn.extraCookies = function (options) {

		var opt = $.extend({
			$inner: null,
			$button: null,
			cookieName: 'extra_cookies_accepted',
			cookieValue: 'accepted',
			expirationDays: 60,
			position: 'bottom', // bottom || top
			waitingBeforeCheck: 1000 // In ms
		}, options);

		this.each(function () {

			/*********************************** SETUP VARS ***********************************/
			var $this = $(this),
				$inner = opt.$inner || $this.find(' > .inner'),
				$button = opt.$button || $this.find('.extra-cookies-button'),
				position = 'bottom',
				timeline = null,
				shown = false;

			if (opt.position == 'top') {
				position = 'top';
				$this.addClass('top');
			} else {
				$this.addClass('bottom');
			}


			function checkCookies() {
				if (!hasAcceptCookies()) {
					show();
				} else {
					console.log('cookie already accepted');
				}
			}

			function hasAcceptCookies() {
				return getCookie() == opt.cookieValue;
			}
			function getCookie() {
				var name = opt.cookieName + "=",
					cookies = document.cookie.split(';');
				for(var i = 0; i < cookies.length; i++) {
					var current = cookies[i];
					while (current.charAt(0)==' ') current = current.substring(1);
					if (current.indexOf(name) == 0) return current.substring(name.length, current.length);
				}

				return '';
			}


			function acceptCookies() {
				var date = new Date(),
					expires;
				date.setTime(date.getTime() + (opt.expirationDays * 24 * 60 * 60 * 1000));
				expires = 'expires=' + date.toUTCString();
				document.cookie = opt.cookieName + '='+opt.cookieValue+'; ' + expires;

				hide();
			}


			function show() {
				if (!shown) {
					shown = true;
					if (timeline) {
						timeline.kill();
					}
					timeline = new TimelineMax();
					timeline.set($this, {display: 'block'});
					timeline.set($this, {height: $inner.outerHeight()});
					timeline.from($inner, 0.3, {y: (position == 'bottom') ? '+=100%' : '-=100%'});
					timeline.set($inner, {position: 'static'});
					timeline.set($this, {clearProps: 'height'});

					console.log('show cookies');
				}
			}

			function hide() {
				if (shown) {
					shown = false;
					if (timeline) {
						timeline.kill();
					}
					timeline = new TimelineMax();
					timeline.to($inner, 0.3, {y: (position == 'bottom') ? '+=100%' : '-=100%'});
					timeline.set($this, {display: 'none'});

					console.log('hide cookies');
				}
			}

			console.log($button);
			$button.on('click', function (event) {
				event.preventDefault();
				console.log('clickclick');
				acceptCookies();
			});

			/*********************************** INITIALIZE ***********************************/
			$window.load(function () {
				setTimeout(checkCookies, opt.waitingBeforeCheck)
			});

		});

		return this;
	};
}(jQuery));