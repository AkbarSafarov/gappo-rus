class VideoWidget {
	constructor(element) {
		this.widget = element;
		this.videoContainer = this.widget.querySelector('[data-video="container"]');
		this.video = this.widget.querySelector('video');
		this.closeBtn = this.widget.querySelector('[data-close]');
		this.soundToggle = this.widget.querySelector('[data-sound]');
		this.minimizeBtn = this.widget.querySelector('[data-minimize]');
		this.playPauseBtn = this.widget.querySelector('[data-play-pause]');
		this.fullscreenBtn = this.widget.querySelector('[data-fullscreen]');
		this.videoDesktop = this.widget.getAttribute('data-desktop');
		this.videoMobile = this.widget.getAttribute('data-mobile');

		this.loader = document.createElement('div')
		this.loader.setAttribute('data-video-loader', '');
		this.videoContainer?.prepend(this.loader);

		this.isMobile = (window.innerWidth <= 768);

		// this.playPauseIcon = null;


		this.mimeTypesByExtension = {
			mp4: 'video/mp4',
			webm: 'video/webm',
			ogg: 'video/ogg',
			mov: 'video/quicktime',
			m4v: 'video/x-m4v'
		};


		this.iconMap = {
			'volume-high': 'M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z',
			'volume-xmark': 'M301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z',
			'minimize': 'M32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l448 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416z',
			'fullscreen': 'M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z',
			'close': 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z',
			'play': 'M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z',
			'pause': 'M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z'
		};
		this.iconViewBoxMap = {
			'volume-high': '0 0 640 512',
			'volume-xmark': '0 0 576 512',
			'minimize': '0 0 512 512',
			'fullscreen': '0 0 448 512',
			'close': '0 0 384 512',
			'play': '0 0 384 512',
			'pause': '0 0 320 512'
		}

		this.init();
	}

	setCookie(name, value, time) {
		const date = new Date();
		date.setTime(date.getTime() + time);
		const expires = "expires=" + date.toUTCString();
		document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
	}

	getCookie(name) {
		const cname = name + "=";
		const decodedCookie = decodeURIComponent(document.cookie);
		const ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
		}
		return "";
	}

	init() {
		this.loadVideo();
		this.setupIcons();
		this.setupEventListeners();
	}

	createSVGIcon(iconName, className = '') {
		const svgNS = 'http://www.w3.org/2000/svg';
		const pathData = this.iconMap[iconName];
		const viewBox = this.iconViewBoxMap[iconName];

		if (!pathData) {
			console.error(`Иконка "${iconName}" не найдена`);
			return null;
		}
		if (!viewBox) {
			console.error(`ViewBox "${iconName}" не найден`);
			return null;
		}

		const svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute('viewBox', viewBox);
		svg.setAttribute('aria-hidden', 'true');
		svg.setAttribute('focusable', 'false');
		svg.setAttribute('role', 'img');
		if (className) svg.classList.add(className);

		const path = document.createElementNS(svgNS, 'path');
		path.setAttribute('d', pathData);
		path.setAttribute('fill', 'currentColor');

		svg.appendChild(path);
		return svg;
	}

	updateIcon(button, iconName) {
		const icon = button.querySelector('svg');
		if (icon) {
			const pathData = this.iconMap[iconName];
			const viewBox = this.iconViewBoxMap[iconName];
			if (viewBox)
				icon.setAttribute('viewBox', viewBox);
			if (pathData)
				icon.querySelector('path').setAttribute('d', pathData);
		}
	}

	setupIcons() {
		this.soundToggle.appendChild(this.createSVGIcon(this.video.muted ? 'volume-xmark' : 'volume-high'));
		this.minimizeBtn.appendChild(this.createSVGIcon('minimize'));
		this.closeBtn.appendChild(this.createSVGIcon('close'));
		this.fullscreenBtn.appendChild(this.createSVGIcon('fullscreen'));
		this.playPauseBtn.appendChild(this.createSVGIcon(this.video.paused ? 'play' : 'pause'));
	}

	async getVideoMimeType(url) {
		try {
			const response = await fetch(url, { method: 'HEAD' });
			const contentType = response.headers.get('Content-Type');
			if (contentType) return contentType;
		} catch (e) {
			console.error('Ошибка получения заголовков', e);
		}

		const extMatch = url.match(/\.([a-z0-9]+)(\?|#|$)/i);
		if (extMatch) {
			const ext = extMatch[1].toLowerCase();
			return this.mimeTypesByExtension[ext] || null;
		}

		return null;
	}

	async loadVideo() {
		// const isMobile = window.innerWidth <= 768;
		const videoSource = (this.isMobile && this.videoMobile) ? this.videoMobile : this.videoDesktop;

		// Очищаем предыдущие источники
		while (this.video.firstChild) this.video.removeChild(this.video.firstChild);

		const source = document.createElement('source');
		source.src = videoSource;
		let mimeType = await this.getVideoMimeType(videoSource);

		if (!mimeType) {
			mimeType = 'video/mp4';
		}
		source.type = mimeType;
		this.video.appendChild(source);

		this.video.load();
		this.loader.style.display = 'block';

		this.video.addEventListener('loadeddata', () => {
			this.loader.style.display = 'none';

			const playPromise = this.video.play();
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.log('Автовоспроизведение предотвращено:', error);
				});
			}

			this.video.disablePictureInPicture = false;
		});
	}

	setupEventListeners() {
		// Обработчик для расширения виджета
		this.videoContainer.addEventListener('click', (e) => {
			if (!this.widget.classList.contains('expanded'))
				this.expandWidget();
			else if (this.widget.classList.contains('expanded'))
				this.togglePlayPause();
		});

		// Закрытие виджета (полное удаление)
		this.closeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.widget.remove();
			this.setCookie('vm-video-closed', 'true', 3 * 60 * 1000);
		});

		// Переключение звука
		this.soundToggle.addEventListener('click', (e) => {
			e.stopPropagation();
			this.toggleSound();
		});

		// Свернуть виджет
		this.minimizeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.minimizeWidget();
		});

		// Пауза/воспроизведение (только в expanded режиме)
		this.playPauseBtn.addEventListener('click', (e) => {
			if (!this.widget.classList.contains('expanded'))
				return;
			e.stopPropagation();
			this.togglePlayPause();
		});

		// Полноэкранный режим
		this.fullscreenBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.toggleFullscreen();
		});

		this.video.addEventListener('dblclick', (e) => {
			e.stopPropagation();
			this.toggleFullscreen();
		});

		// Клик по документу для сворачивания
		document.addEventListener('click', (e) => {
			if (this.widget.classList.contains('expanded') && !this.widget.contains(e.target))
				this.minimizeWidget();
		});

		// Обработка полноэкранного режима
		document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
		document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
		document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
		document.addEventListener('msfullscreenchange', () => this.handleFullscreenChange());
	}

	handleFullscreenChange() {
		if (this.isFullscreen()) {
			this.video.controls = true;
		} else {
			this.video.controls = false;
		}
	}

	expandWidget() {
		this.widget.classList.add('expanded');
		this.toggleSound();
		this.togglePlayPause(false);
	}

	minimizeWidget() {
		this.widget.classList.remove('expanded');
		this.toggleSound(true);

	}

	toggleFullscreen() {
		const requestFullscreen = element => {
			if (element.requestFullscreen) return element.requestFullscreen();
			if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
			if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
		};
		const exitFullscreen = element => {
			if (element.exitFullscreen) return element.exitFullscreen();
			if (element.webkitExitFullscreen) return element.webkitExitFullscreen();
			if (element.mozCancelFullScreen) return element.mozCancelFullScreen();
		}

		this.isFullscreen() ? exitFullscreen(document) : requestFullscreen(this.video);

	}

	toggleSound(muted = null) {
		this.video.muted = muted ?? !this.video.muted;
		this.updateIcon(this.soundToggle, this.video.muted ? 'volume-xmark' : 'volume-high');
		this.soundToggle.setAttribute('aria-label', this.video.muted ? 'Включить звук' : 'Выключить звук');
	}

	togglePlayPause(paused = null) {
		if (paused === null) {
			this.updateIcon(this.playPauseBtn, this.video.paused ? 'play' : 'pause');
			this.soundToggle.setAttribute('aria-label', this.video.paused ? 'Воспроизвести' : 'Пауза');
			this.video.paused ? this.video.play() : this.video.pause();
		}
	}

	isFullscreen() {
		return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
	}

	debounce(func, wait) {
		let timeout;
		return () => {
			const context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				func.apply(context);
			}, wait);
		};
	}

}
//# sourceMappingURL=video.widget.js.map
