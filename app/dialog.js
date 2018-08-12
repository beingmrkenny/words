function displayDialog (message, ok) {
	var dialog = getTemplate('DialogTemplate');
	dialog.open = true;
	dialog.querySelector('.message').textContent = message;
	document.body.appendChild(dialog);
	qid('OK').addEventListener('click', () => {
		ok();
		qid('Dialog').remove();
	});
	qid('Cancel').addEventListener('click', () => {
		qid('Dialog').remove();
	});
}
