class Dialog {

	constructor () {
		this.dialog = getTemplate('DialogTemplate');
		document.body.appendChild(this.dialog);
		this.dialog.showModal();
	}

	message (message, ok) {
		this.dialog.replaceChild(
			createElement(`<p class="message">${message}</p>`),
			this.dialog.querySelector('content-placeholder')
		);
		this.okCancel(ok);
	}

	form (message, formId, prepareForm, ok) {
		this.dialog.replaceChild(
			getTemplate(formId),
			this.dialog.querySelector('content-placeholder')
		);
		this.dialog.id = formId + 'Dialog';
		this.dialog.querySelector('h3').textContent = message;
		prepareForm(this.dialog);
		this.okCancel(ok);
		this.dialog.querySelector('form input').addEventListener ('keyup', function (ev) {
			if (ev.key == 'Enter') {
				ok();
				this.dialog.remove();
			}
		});
		this.dialog.querySelector('form').addEventListener ('submit', function (ev) {
			ev.preventDefault();
		});
	}

	okCancel (ok) {
		q('#OK', this.dialog).addEventListener('click', () => {
			ok();
			this.dialog.remove();
		});
		q('#Cancel', this.dialog).addEventListener('click', () => {
			this.dialog.remove();
		});
	}

}
