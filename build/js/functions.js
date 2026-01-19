(function () {
	'use strict';

	if (!!window.templateFunctions) return;

	// Конструктор
	window.templateFunctions = function (encParams) {
		if (!encParams)
			return;

		const self = this;
		const params = JSON.parse(atob(encParams));

		if (typeof params === 'object') {
			this.admin = typeof params.admin === 'boolean' ? params.admin : false;
			this.ajaxPath = params.ajax_path || params.ajax_url || '/local/ajax/';
			this.resolution = params.res ? Object.fromEntries(
				Object.entries(params.res).map(([key, value]) => {
					return [key, parseInt(value, 10)];
				})
			) : { 'xs': 400, 'sm': 576, 'md': 768, 'lg': 992, 'xl': 1200, 'xxl': 1400, '3xl': 1920, '4xl': 2560 };
			this.siteName = params.site_name || '';
			this.sessid = params.sessid || null;
			this.params = {
				lastScrollTop: 0,
				scrollTop: window.scrollY,
				header: null,
				headerHeight: null,
				onLoader: false,
			};

			document.addEventListener('DOMContentLoaded', this.init.bind(this));


			this.defer(() => {
				if (typeof Fancybox != 'undefined')
					this.fancybox();
				if (typeof LazyLoad != 'undefined')
					this.lazyload();
			});
		}
	};

	window.templateFunctions.prototype = {
		defer: function (fn) {
			if (document.readyState === 'complete' || document.readyState === 'interactive')
				setTimeout(fn, 0);
			else
				document.addEventListener('DOMContentLoaded', fn);
		},
		init: function () {
			// Инициализация
		},


		selectDropDown: function (e, popupId = null) {
			if (popupId === 'undefined' || popupId === undefined || popupId === null)
				return;

			let
				contentNode = document.querySelector('[data-dropdown="' + popupId + '"]'),
				_this = e;

			BX.PopupWindowManager.create("selectDrop-" + popupId, e, {
				className: 'popup-select',
				minWidth: BX.width(e),
				autoHide: true,
				offsetLeft: 0,
				offsetTop: 2,
				overlay: false,
				draggable: { restrict: true },
				closeByEsc: true,
				content: BX(contentNode),
				events: {
					onPopupShow: () => {
						if (!BX.hasClass(_this, '--selected'))
							BX.addClass(_this, '--selected');
					},
					onPopupAfterClose: () => {
						if (BX.hasClass(_this, '--selected'))
							BX.removeClass(_this, '--selected');
					},
				}
			}).show();
		},

		// defer loader
		fancybox: function () {
			Fancybox.bind("[data-fancybox]", {});
			// Fancybox.bind("[data-fb-form]", {
			// 	mainClass: '--fb-form',
			// 	on: {
			// 		init: e => {

			// 		},
			// 		close: e => {


			// 		}
			// 	}
			// })
		},

	};

})();


if (typeof BX?.UI?.Notification === 'object') {
	function alertBalloonRenderer(balloon) {
		let
			content = this.getContent(),
			options = this.getData() || {},
			icon = options.icon || false,
			size = options.size || '',
			type = options.type || false,
			width = this.getWidth(),
			cssClass = 'm-0 ui-alert';

		if (icon)
			cssClass += ' ui-alert-icon-' + icon;
		if (size)
			cssClass += ' ui-alert-' + size;
		if (type)
			cssClass += ' ui-alert-' + type;

		return BX.create("div", {
			props: {
				className: cssClass
			},
			style: {
				width: BX.type.isNumber(width) ? (width + "px") : width
			},
			children: [
				BX.create("span", {
					props: {
						className: "ui-alert-message"
					},
					html: BX.type.isDomNode(content) ? null : content,
					children: BX.type.isDomNode(content) ? [content] : []
				}),
				BX.create("span", {
					props: {
						className: "ui-alert-close-btn"
					},
					events: {
						click: function () {
							balloon.close();
						}
					}
				}),
			]
		})
	}
}
//# sourceMappingURL=functions.js.map
