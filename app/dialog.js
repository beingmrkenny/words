class Dialog {

	constructor () {
		this.dialog = getTemplate('DialogTemplate');
		this.dialog.open = true;
		document.body.appendChild(this.dialog);
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
		this.dialog.querySelector('h3').textContent = message;
		prepareForm();
		this.okCancel(ok);
	}

	okCancel (ok) {
		qid('OK').addEventListener('click', () => {
			ok();
			qid('Dialog').remove();
		});
		qid('Cancel').addEventListener('click', () => {
			qid('Dialog').remove();
		});
	}

}
