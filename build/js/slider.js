(function () {
	'use strict';


	if (!!window.JSSliderItem)
		return;

	window.JSSliderItem = function (params) {
		/*
		array to php
			'id' => 'slider_' . $obName, // string or int // REQ
			'loop' => true, // bool
			'nav' => true, // bool
			'pagination' => true, // bool
			'paginationNum' => true, // bool
			'paginationFirstZero' => true, // bool
			'autoHeight' => true, // bool
			'slideToClickedSlide' => true, // bool
			'autoplay' => true, // bool
			'centeredSlides' => true, // bool
			'history' => true, // bool
			'hash' => true, // bool
			'delay' => 300, // string number or int
			'speed' => 300, // string number or int
			'threshold' => 5, // string number or int
			'initialSlide' => 5, // string number or int
			'pauseHover' => true, // bool
			'paginationType' => 'bullets' // string 'progressbar' | 'bullets' | 'fraction' | 'custom'
			'margin' => 30, // array [576 => 30] or string num '10' or int 30
			'bp' => [ 0 => 1.2, 576 => 1.5, 768 => 1.8, 992 => 2, 1200 => 2, 1400 => 3, 1920 => 3, 2560 => 4 ], // array
			'grid' => [ 768 => 2, 992 => 2, 1200 => 2, 1400 => 2, 1920 => 2, 2560 => 2 ], // array
			'enabled' => [ 768 => true, 1400 => false ], // array
			'allowTouchMove' => [ 768 => true, 1400 => false ], // array
			'direction' => 'horizontal', // string 'horizontal' | 'vertical',
			'slidesPerView' => 'auto', // string [number or 'auto'] or int
			'thumbs' => [
				'margin' => 30, // array [576 => 30] or string num '10' or int 30
				'direction' => 'horizontal', // string 'horizontal' | 'vertical',
				'loop' => true, // bool
				'nav' => true, // bool
				'freeMode' => true, // bool
				'slidesPerView' => 'auto', // string [number or 'auto'] or int
				'bp' => [ 0 => 1.2, 576 => 1.5, 768 => 1.8, 992 => 2, 1200 => 2, 1400 => 3, 1920 => 3, 2560 => 4 ], // array
			],
		*/


		if (typeof params === 'object') {
			this.initSwiper = null;
			this.initSwiperThumb = null;
			this.id = params.id || '';
			this.video = typeof params.video === 'boolean' ? params.video : false;
			this.loop = typeof params.loop === 'boolean' ? params.loop : false;
			this.autoHeight = typeof params.autoHeight === 'boolean' ? params.autoHeight : false;
			this.slideToClickedSlide = typeof params.slideToClickedSlide === 'boolean' ? params.slideToClickedSlide : false;
			this.margin = 0;
			this.speed = +params.speed || 500;
			this.threshold = +params.threshold || 5;
			this.initialSlide = +params.initialSlide || 0;
			this.pauseOnMouseEnter = typeof params.pauseHover === 'boolean' ? params.pauseHover : true;
			this.direction = typeof params.direction === 'string' && params.direction || 'horizontal';
			this.centeredSlides = typeof params.centeredSlides === 'boolean' ? params.centeredSlides : false;
			this.progress = typeof params.progress === 'boolean' ? params.progress : false;
			this.breakpoints = {};
			// this.effect = 'slide';
			// this.coverflowEffect = false;
			this.thumbs = null;

			if (params.margin !== 'undefined' && params.margin !== undefined && params.margin !== null)
				if (typeof params.margin === 'object')
					this.margin = +params.margin[Object.keys(params.margin)[0]];
				else
					this.margin = +params.margin;

			if (params.bp !== 'undefined' && params.bp !== undefined && params.bp !== null)
				if (Object.keys(params.bp).length > 0)
					Object.keys(params.bp).forEach(resolution => {
						this.breakpoints[resolution] = {
							slidesPerView: (params.bp[resolution] !== 'auto' ? +params.bp[resolution] : params.bp[resolution])
						};

						if (params.enabled !== 'undefined' && params.enabled !== undefined && params.enabled !== null && typeof params.enabled !== 'string')
							if (typeof params.enabled[resolution] === 'boolean')
								this.breakpoints[resolution].enabled = params.enabled[resolution];

						if (params.allowTouchMove !== 'undefined' && params.allowTouchMove !== undefined && params.allowTouchMove !== null && typeof params.allowTouchMove !== 'string')
							if (typeof params.allowTouchMove[resolution] === 'boolean')
								this.breakpoints[resolution].allowTouchMove = params.allowTouchMove[resolution];

						if (params.margin !== 'undefined' && params.margin !== undefined && params.margin !== null && typeof params.margin !== 'string')
							if (params.margin[resolution] !== undefined && params.margin[resolution] !== null)
								this.breakpoints[resolution].spaceBetween = +params.margin[resolution];

						if (params.grid !== 'undefined' && params.grid !== undefined && params.grid !== null && typeof params.grid !== 'string')
							if (params.grid[resolution] !== undefined && params.grid[resolution] !== null)
								this.breakpoints[resolution].grid = {
									rows: +params.grid[resolution],
									fill: "row"
								}
					});

			this.slidesPerView = params.slidesPerView || (
				typeof params.bp !== 'undefined' && Object.keys(params.bp).length > 0 ? +params.bp[Object.keys(params.bp)[0]] : 1
			);

			// if (params.effect !== undefined && params.effect !== null) {
			// 	if (params.effect === 'coverflow') {
			// 		this.effect = 'coverflow'
			// 		this.coverflowEffect = {
			// 			rotate: 0,
			// 			stretch: '40%',
			// 			depth: 100,
			// 			modifier: 1,
			// 			scale: "0.85",
			// 			slideShadows: false,
			// 		}
			// 	}
			// }

			if (!!params.thumbs) {

				this.thumbs = {
					id: document.querySelector('[data-slider-thumbs="' + this.id + '"]'),
					loop: (typeof params.thumbs.loop === 'boolean' ? params.thumbs.loop : (typeof params.loop === 'boolean' ? params.loop : false)),
					freeMode: (typeof params.thumbs.freeMode === 'boolean' ? params.thumbs.freeMode : true),
					breakpoints: {}
				};

				if (this.thumbs.id !== undefined && this.thumbs.id !== null) {

					if (params.thumbs.margin !== 'undefined' && params.thumbs.margin !== undefined && params.thumbs.margin !== null)
						if (typeof params.thumbs.margin === 'object')
							this.thumbs.margin = +params.thumbs.margin[Object.keys(params.thumbs.margin)[0]];
						else
							this.thumbs.margin = +params.thumbs.margin;

					if (params.thumbs.bp !== 'undefined' && params.thumbs.bp !== undefined && params.thumbs.bp !== null)
						if (Object.keys(params.thumbs.bp).length > 0)
							Object.keys(params.thumbs.bp).forEach(resolution => {

								this.thumbs.breakpoints[resolution] = {
									slidesPerView: (params.thumbs.bp[resolution] !== 'auto' ? +params.thumbs.bp[resolution] : params.thumbs.bp[resolution])
								};

								if (params.thumbs.margin !== 'undefined' && params.thumbs.margin !== undefined && params.thumbs.margin !== null && typeof params.thumbs.margin !== 'string')
									if (params.thumbs.margin[resolution] !== undefined && params.thumbs.margin[resolution] !== null)
										this.thumbs.breakpoints[resolution].spaceBetween = +params.thumbs.margin[resolution];
							});


					this.thumbs.direction = typeof params.thumbs.direction === 'string' && params.thumbs.direction || (
						typeof params.direction === 'string' && params.direction || 'horizontal'
					);

					if (!!params.thumbs.nav)
						this.thumbs.navigation = {
							enabled: true,
							disabledClass: 'disabled',
							lockClass: 'lock',
							nextEl: '#btn-thumbs-next-' + this.id,
							prevEl: '#btn-thumbs-prev-' + this.id,
						}
					else this.thumbs.navigation = false;

					this.thumbs.slidesPerView = params.thumbs.slidesPerView || (
						typeof params.thumbs.bp !== 'undefined' && Object.keys(params.thumbs.bp).length > 0 ? +params.thumbs.bp[Object.keys(params.thumbs.bp)[0]] : 1
					);

				}
			}

			// hash url
			if (!!params.hash)
				this.hashNavigation = {
					watchState: true,
					replaceState: false,
				};
			else this.hashNavigation = false;

			// history
			if (!!params.history)
				this.history = {
					root: params.historyRoot || '',
					key: params.historyKey || '',
					keepQuery: false,
					replaceState: true,
				};
			else this.history = false;

			// autoplay + delay slider
			if (!!params.autoplay)
				this.autoplay = {
					delay: !!params.delay ? Number(params.delay) : 5000,
					pauseOnMouseEnter: this.pauseOnMouseEnter,
				};
			else this.autoplay = false;

			// grid params
			if (params.grid !== 'undefined' && params.grid !== undefined && params.grid !== null) {
				this.thumbs = null;
				this.loop = false;
				this.autoHeight = false;
			}

			// bug fix need loop false
			if (this.slidesPerView === 'auto')
				this.loop = false;

			// id check 
			if (!!this.id) {
				// navigation prev next
				if (!!params.nav)
					this.navigation = {
						enabled: true,
						disabledClass: 'disabled',
						lockClass: 'lock',
						nextEl: '#btn-next-' + this.id,
						prevEl: '#btn-prev-' + this.id,
					};
				else this.navigation = false;

				// pagination slider
				if (!!params.pagination) {
					// pagination number
					if (!!params.paginationNum)
						this.paginationNum = function (current, classname) {
							let number = current + 1;
							if (params.paginationFirstZero)
								number = String(number).padStart(2, '0');

							return '<span class="' + classname + '"><span>' + number + '</span></span>';
						};
					else this.paginationNum = false;

					this.paginationType = params.paginationType || 'bullets';
					this.renderCustom = function (swiper, current, total) {
						let number = current;
						if (params.paginationFirstZero) {
							number = String(number).padStart(2, '0');
							total = String(total).padStart(2, '0');
						}
						return '<span class="swiper-pagination__current">' + number + '</span> / <span class="swiper-pagination__total">' + total + '</span>';
					}


					this.pagination = {
						el: '#pagination-' + this.id,
						bulletActiveClass: 'active',
						clickable: true,
						hiddenClass: 'hidden',
						lockClass: 'lock',
						type: this.paginationType,
						renderBullet: this.paginationNum,
						renderCustom: this.renderCustom
					};
				}
				else this.pagination = false;


				if (typeof Swiper != 'undefined')
					document.addEventListener('DOMContentLoaded', this.init.bind(this));
			}
			else
				console.log('id slider not found. Indicate the slider id');
		}
	};

	window.JSSliderItem.prototype = {
		init: function () {
			setTimeout(() => {

				if (this.thumbs !== 'undefined' && this.thumbs !== undefined && this.thumbs !== null)
					this.thumb();

				this.swiper();
			}, 100);

		},

		swiper: function () {
			let _this = this;

			this.initSwiper = new Swiper('[data-slider="' + this.id + '"]', {
				watchOverflow: true,
				loop: this.loop,
				direction: this.direction,
				spaceBetween: this.margin,
				slidesPerView: this.slidesPerView,
				slideActiveClass: 'active',
				autoHeight: this.autoHeight,
				pagination: this.pagination,
				navigation: this.navigation,
				autoplay: this.autoplay,
				history: this.history,
				hashNavigation: this.hashNavigation,
				speed: this.speed,
				centeredSlides: this.centeredSlides,
				threshold: this.threshold,
				initialSlide: this.initialSlide,
				slideToClickedSlide: this.slideToClickedSlide,
				// effect: this.effect,
				// coverflowEffect: this.coverflowEffect,
				thumbs: this.initSwiperThumb,
				breakpoints: this.breakpoints,
				on: {
					init: function () {
						let closestContainer = this.el.closest('[data-slider-container]')
						if (closestContainer !== 'undefined' && closestContainer !== undefined && closestContainer !== null) {
							closestContainer.style.opacity = 1;
							closestContainer.style.visibility = 'visible';
						}

						if (!!_this.video)
							_this.videoInit(this.el.querySelectorAll('video'), this.slides[this.activeIndex]);

						if (!this.enabled)
							this.setTranslate(0);

					},
					resize: function () {
						if (!this.enabled)
							this.setTranslate(0);
					},
					autoplayTimeLeft(s, time, progress) {
						if (!!_this.progress)
							s.pagination.el.querySelector('.active').style.setProperty("--progress-width", 1 - progress);
					},
					slideChangeTransitionEnd: function () {
						if (!!_this.video)
							_this.videoInit(this.el.querySelectorAll('video'), this.slides[this.activeIndex]);
					}
				}
			});

			this.initSwiper.swiper;
		},

		thumb: function () {
			this.initSwiperThumb = {
				swiper: new Swiper(this.thumbs.id, {
					watchSlidesProgress: true,
					loop: this.thumbs.loop,
					freeMode: this.thumbs.freeMode,
					direction: this.thumbs.direction,
					spaceBetween: this.thumbs.margin,
					slidesPerView: this.thumbs.slidesPerView,
					navigation: this.thumbs.navigation,
					breakpoints: this.thumbs.breakpoints,
					on: {
						init: function (e) {
							if (window.getComputedStyle(this.el).display === 'none')
								this.el.style.display = 'block';
						},
					}
				})
			}
		},

		videoInit: function (videos = null, activeSlide = null) {
			if (!videos || !activeSlide)
				return;

			Array.prototype.forEach.call(videos, (video) => video.pause());

			let video = activeSlide.querySelector('video');
			if (video !== 'undefined' && video !== undefined && video !== null)
				video.play();

		},
	};
})();
//# sourceMappingURL=slider.js.map
