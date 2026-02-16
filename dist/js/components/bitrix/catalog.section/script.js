(function () {
	'use strict';




	if (!window.JCCatalogSectionComponent) {
		window.JCCatalogSectionComponent = function (params) {
			this.formPosting = false;
			this.siteId = params.siteId || '';
			this.ajaxId = params.ajaxId || '';
			this.template = params.template || '';
			this.componentPath = params.componentPath || '';
			this.parameters = params.parameters || '';
			this.containerSelector = params.container || '';
			this.container = null;
			this.ajaxPath = '/local/ajax/';
			this.sessid = BX?.bitrix_sessid() ?? null;
			this.lazyLoad = params.lazyLoad ?? false;
			this.showMoreButton = null;
			this.showMoreButtonMessage = null;
			this.params = {
				eventAdd2Basket: 'data-add2basket'
			}

			if (params.navParams) {
				this.navParams = {
					NavNum: params.navParams.NavNum || 1,
					NavPageNomer: parseInt(params.navParams.NavPageNomer) || 1,
					NavPageCount: parseInt(params.navParams.NavPageCount) || 1
				};
			}




			// this.bigData = params.bigData || {enabled: false};


			// if (this.bigData.enabled && BX.util.object_keys(this.bigData.rows).length > 0)
			// {
			// 	BX.cookie_prefix = this.bigData.js.cookiePrefix || '';
			// 	BX.cookie_domain = this.bigData.js.cookieDomain || '';
			// 	BX.current_server_time = this.bigData.js.serverTime;

			// 	BX.ready(BX.delegate(this.bigDataLoad, this));
			// }

			// if (params.initiallyShowHeader)
			// {
			// 	BX.ready(BX.delegate(this.showHeader, this));
			// }

			// if (params.deferredLoad)
			// {
			// 	BX.ready(BX.delegate(this.deferredLoad, this));
			// }



			// if (params.loadOnScroll)
			// {
			// 	BX.bind(window, 'scroll', BX.proxy(this.loadOnScroll, this));
			// }


			if (typeof params === 'object') {
				document.addEventListener('DOMContentLoaded', this.init.bind(this));
			}


		};

		window.JCCatalogSectionComponent.prototype = {
			init: function () {
				if (this.containerSelector) {
					this.container = document.querySelector('[data-entity="' + this.containerSelector + '"]');
					this.container.querySelectorAll('[' + this.params.eventAdd2Basket + ']').forEach(button => {
						button.addEventListener('click', this.add2basket.bind(this));
					});

				}

				if (this.lazyLoad) {
					this.showMoreButton = document.querySelector('[data-use="show-more-' + this.navParams.NavNum + '"]');
					this.showMoreButtonMessage = this.showMoreButton.innerHTML;
					this.showMoreButton.addEventListener('click', this.showMore.bind(this));
				}

			},

			add2basket: function (event) {
				let target = event.currentTarget;

				const productId = target.getAttribute(this.params.eventAdd2Basket);
				const originalText = target.innerHTML;

				target.disabled = true;
				// event.textContent = 'Обработка...';

				const formData = {
					sessid: this.sessid,
					action: 'add2basket',
					productId: productId
				}

				fetch(this.ajaxPath + 'add2basket.php', {
					method: 'POST',
					body: JSON.stringify(formData),
					headers: {
						'X-Requested-With': 'XMLHttpRequest',
						'Content-Type': 'application/json',
					}
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(data => {
						let content, dataNotification;

						if (typeof BX?.UI?.Notification === 'object') {
							content = data?.text ?? null;
							if (data.type !== 'success')
								dataNotification = { type: 'danger', icon: 'warning' }
							else
								dataNotification = { type: 'success' }

							if (content) {
								BX.UI.Notification.Center.notify({
									content: content,
									data: dataNotification,
									position: 'top-right',
									render: alertBalloonRenderer,
									category: 'add2basket',
									autoHide: true,
									autoHideDelay: 3000,
								});
							}
						}
					})
					.catch(error => console.error('Fetch error:', error))
					.finally(() => {
						target.disabled = false;
						// event.innerHTML = originalText;
						BX.onCustomEvent('OnBasketChange');
					});


			},
			checkButton: function () {
				if (this.showMoreButton) {
					if (this.navParams.NavPageNomer == this.navParams.NavPageCount) {
						this.showMoreButton.remove();
					}
					else {
						// this.container.appendChild(this.showMoreButton);
					}
				}
			},

			enableButton: function () {
				if (this.showMoreButton) {
					this.showMoreButton.classList.remove('disabled');
					this.showMoreButton.innerHTML = this.showMoreButtonMessage;
				}
			},

			disableButton: function () {
				if (this.showMoreButton) {
					this.showMoreButton.classList.add('disabled');
					// this.showMoreButton.innerHTML = BX.message('BTN_MESSAGE_LAZY_LOAD_WAITER');
				}
			},

			setAddBasketItems: function (obj) {
				if (typeof obj !== 'object')
					return;

				Object.keys(obj).forEach(id => {
					// this.setAddBasketItem(id);
				})
			},
			setAddBasketItem: function (id = null) {
				if (!id)
					return;

				// const elements = document.querySelectorAll(`[${this.params.eventAdd2basket}="${id}"]`);

				// console.log(elements);


			},

			// loadOnScroll: function () {
			// 	var scrollTop = BX.GetWindowScrollPos().scrollTop,
			// 		containerBottom = BX.pos(this.container).bottom;

			// 	if (scrollTop + window.innerHeight > containerBottom) {
			// 		this.showMore();
			// 	}
			// },

			showMore: function () {
				// console.log(this.navParams);

				if (this.navParams.NavPageNomer < this.navParams.NavPageCount) {
					var data = {};
					data['action'] = 'showMore';
					data['PAGEN_' + this.navParams.NavNum] = this.navParams.NavPageNomer + 1;

					if (!this.formPosting) {
						this.formPosting = true;
						this.disableButton();

						this.sendRequest(data);
					}
				}
			},

			// bigDataLoad: function () {
			// 	var url = 'https://analytics.bitrix.info/crecoms/v1_0/recoms.php',
			// 		data = BX.ajax.prepareData(this.bigData.params);

			// 	if (data) {
			// 		url += (url.indexOf('?') !== -1 ? '&' : '?') + data;
			// 	}

			// 	var onReady = BX.delegate(function (result) {
			// 		this.sendRequest({
			// 			action: 'deferredLoad',
			// 			bigData: 'Y',
			// 			items: result && result.items || [],
			// 			rid: result && result.id,
			// 			count: this.bigData.count,
			// 			rowsRange: this.bigData.rowsRange,
			// 			shownIds: this.bigData.shownIds
			// 		});
			// 	}, this);

			// 	BX.ajax({
			// 		method: 'GET',
			// 		dataType: 'json',
			// 		url: url,
			// 		timeout: 3,
			// 		onsuccess: onReady,
			// 		onfailure: onReady
			// 	});
			// },

			// deferredLoad: function () {
			// 	this.sendRequest({ action: 'deferredLoad' });
			// },

			sendRequest: function (data) {
				var defaultData = {
					siteId: this.siteId,
					template: this.template,
					parameters: this.parameters
				};

				if (this.ajaxId) {
					defaultData.AJAX_ID = this.ajaxId;
				}

				BX.ajax({
					url: this.componentPath + '/ajax.php' + (document.location.href.indexOf('clear_cache=Y') !== -1 ? '?clear_cache=Y' : ''),
					method: 'POST',
					dataType: 'json',
					timeout: 60,
					data: BX.merge(defaultData, data),
					onsuccess: BX.delegate(function (result) {
						if (!result || !result.JS)
							return;

						BX.ajax.processScripts(
							BX.processHTML(result.JS).SCRIPT,
							false,
							BX.delegate(function () { this.showAction(result, data); }, this)
						);
					}, this)
				});
			},

			showAction: function (result, data) {
				if (!data)
					return;

				switch (data.action) {
					case 'showMore':
						this.processShowMoreAction(result);
						break;
					case 'deferredLoad':
						// this.processDeferredLoadAction(result, data.bigData === 'Y');
						break;
				}
			},

			processShowMoreAction: function (result) {
				this.formPosting = false;
				this.enableButton();

				if (result) {
					this.navParams.NavPageNomer++;
					this.processItems(result.items);
					this.processPagination(result.pagination);
					this.processEpilogue(result.epilogue);
					this.checkButton();
				}
			},

			// processDeferredLoadAction: function (result, bigData) {
			// 	if (!result)
			// 		return;

			// 	var position = bigData ? this.bigData.rows : {};

			// 	this.processItems(result.items, BX.util.array_keys(position));
			// },

			processItems: function (itemsHtml, position) {
				if (!itemsHtml)
					return;

				let
					items, k, origRows,
					processed = BX.processHTML(itemsHtml, false),
					temporaryNode = BX.create('DIV');

				temporaryNode.innerHTML = processed.HTML;
				items = temporaryNode.querySelectorAll('[data-entity="items-item"]');

				if (items.length) {
					for (k in items) {
						if (items.hasOwnProperty(k)) {
							origRows = position ? this.container?.querySelector('[data-entity="items-row"]') : false;

							if (origRows && BX.type.isDomNode(origRows[position[k]]))
								origRows[position[k]].parentNode.insertBefore(items[k], origRows[position[k]]);
							else
								this.container?.querySelector('[data-entity="items-row"]').appendChild(items[k]);
						}
					}
				}

				BX.ajax.processScripts(processed.SCRIPT);
			},

			processPagination: function (paginationHtml) {
				if (!paginationHtml)
					return;

				let pagination = document.querySelectorAll('[data-pagination-num="' + this.navParams.NavNum + '"]');
				for (var k in pagination) {
					if (pagination.hasOwnProperty(k)) {
						pagination[k].innerHTML = paginationHtml;
					}
				}

				this.updateUrlPaginationParam('PAGEN_' + this.navParams.NavNum, this.navParams.NavPageNomer, true)
			},

			updateUrlPaginationParam: function (paginationParam, value, push = true) {
				let url = new URL(window.location.href);
				let params = url.searchParams;

				if (value === null || typeof value === 'undefined' || value === '')
					params.delete(paginationParam);
				else
					params.set(paginationParam, String(value));

				let newUrl = url.pathname + (params.toString() ? '?' + params.toString() : '') + (url.hash || '');

				if (push)
					history.pushState(null, '', newUrl);
				else
					history.replaceState(null, '', newUrl);
			},

			processEpilogue: function (epilogueHtml) {
				if (!epilogueHtml)
					return;

				var processed = BX.processHTML(epilogueHtml, false);
				BX.ajax.processScripts(processed.SCRIPT);
			},

			// showHeader: function (animate) {
			// 	var parentNode = BX.findParent(this.container, { attr: { 'data-entity': 'parent-container' } }),
			// 		header;

			// 	if (parentNode && BX.type.isDomNode(parentNode)) {
			// 		header = parentNode.querySelector('[data-entity="header"]');

			// 		if (header && header.getAttribute('data-showed') != 'true') {
			// 			header.style.display = '';

			// 			if (animate) {
			// 				new BX.easing({
			// 					duration: 2000,
			// 					start: { opacity: 0 },
			// 					finish: { opacity: 100 },
			// 					transition: BX.easing.makeEaseOut(BX.easing.transitions.quad),
			// 					step: function (state) {
			// 						header.style.opacity = state.opacity / 100;
			// 					},
			// 					complete: function () {
			// 						header.removeAttribute('style');
			// 						header.setAttribute('data-showed', 'true');
			// 					}
			// 				}).animate();
			// 			}
			// 			else {
			// 				header.style.opacity = 100;
			// 			}
			// 		}
			// 	}
			// }
		};
	}

	if (!window.basketItems) {
		window.BasketItems = function (ids) {
			this.ids = ids || {};
		};

		window.BasketItems.prototype = {
			processIds: function () {
				if (this.ids && Object.keys(this.ids).length > 0) {
					Object.keys(this.ids).forEach(function (id) {

						const elements = document.querySelectorAll("[data-add2basket='" + id + "']");

						elements.forEach(function (el) {
							el.classList.remove('btn-outline-primary');
							el.classList.add('btn-success');
							el.textContent = 'В корзине';

						});
					});
				}
			},

			// addIds: function (newIds) {
			// 	if (Array.isArray(newIds)) {
			// 		this.ids = this.ids.concat(newIds);
			// 		this.processIds();
			// 	}
			// }
		};


		// Создаем экземпляр с нашими ID

		// Запускаем обработку после загрузки DOM

	}


})();