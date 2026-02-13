// Установка куки
// time - время жизни в миллисекундах
function setCookie(name, value, time) {
	const date = new Date();
	date.setTime(date.getTime() + time);
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
	return console.log(`cookie ${name} ${value} - added`);
};

// Получение куки по имени
function getCookie(name) {
	const matches = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)'));
	return matches ? decodeURIComponent(matches[1]) : null;
};

// Удаление куки
function deleteCookie(name) {
	document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	return console.log(`cookie ${name} - deleted`);
};


function FormHandler(form) {
	this.form = form;

	this.error = {
		message: 'Непредвиденная ошибка',
		status: 'error'
	}

	this.loader = null;
	if (typeof Loader != 'undefined')
		this.loader = new Loader();

	if (typeof FormValidator != 'undefined')
		this.validator = new FormValidator({
			texts: {
				invalid: 'Неправильное значение',
				short: 'Введите больше символов',
				long: 'Введите меньше символов',
				checked: 'Должно быть отмечено',
				empty: 'Это поле пустое',
				select: 'Пожалуйста, выберите опцию',
				number_min: 'Слишком маленькое значение',
				number_max: 'Слишком высокое значение',
				url: 'Недействительный URL',
				number: 'Не является числом',
				email: 'Некорректный E-mail',
				no_match: 'Нет совпадения',
				complete: 'Ввод не завершен'
			},
			classes: {
				item: 'ui-ctl',
				alert: 'ui-ctl-tag ui-ctl-tag-danger',
				bad: 'ui-ctl-danger'
			},
			events: ['blur']
		})
	else
		return;

	this.init();
}

FormHandler.prototype.init = function () {
	this.form.addEventListener('blur', (e) => {
		this.validator.checkField(e.target);
	}, true);

	this.form.onsubmit = (e) => {
		e.preventDefault();
		this.handleSubmit(e);
	};
};

FormHandler.prototype.handleSubmit = function (event) {
	this.form.submitter = event.submitter;
	const
		result = this.validator.checkAll(this.form),
		action = this.form.getAttribute('action'),
		data = new FormData(this.form);

	if (!!result.valid && !!action) {
		this.form.submitter.disabled = true;
		this.form.submitter.style.display = 'none';
		if (typeof Loader != 'undefined')
			this.loader?.type();

		fetch(action, {
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
			method: 'POST',
			body: data,
		})
			.then(response => {
				if (typeof Loader != 'undefined')
					this.loader?.type('close');
				if (!response.ok)
					throw new Error('Ответ сети не соответствует ожиданиям');
				return response.json();
			})
			.then(jsonData => {
				if (typeof Loader != 'undefined')
					this.loader?.type('close');
				this.handleResponse(jsonData)
			})
			.catch(error => {
				if (typeof Loader != 'undefined')
					this.loader?.type('close');
				this.handleResponse(this.error, error)
			});
	}
};

FormHandler.prototype.handleResponse = function (data, error = null) {
	let
		alertClass = ' alert-danger',
		alertText = 'Произошла ошибка!',
		boolSuccess = false;

	if (typeof data === 'object' && data.status !== 'error') {
		this.form.reset();
		alertClass = ' alert-success';
		alertText = 'Заявка отправлена!';
		boolSuccess = true;
	}

	const alert = document.createElement('div');
	alert.className = 'alert' + alertClass;
	alert.innerHTML = '<span class="small"><strong>' + alertText + '</strong> ' + (data.message || 'Непредвиденная ошибка') + '</span>';

	const nextAlertElement = this.form.querySelector('[data-alert-insert]');
	if (nextAlertElement)
		nextAlertElement.insertAdjacentElement('afterend', alert);
	else
		this.form.append(alert);

	setTimeout(() => {
		this.form.submitter.disabled = false;
		this.form.submitter.style.display = '';
		alert.remove();
		if (boolSuccess) {
			Fancybox.close();
		}
	}, 5000);
};

document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => {
		for (let form of document.forms) {
			if (!form.noValidate) continue;
			new FormHandler(form);
		}
	}, 100);
});