function qid (id) {
	return document.getElementById(id);
}

function q (selector) {
	return document.querySelector(selector);
}

function qq (selector) {
	return document.querySelectorAll(selector);
}

function getTemplate(id) {
	var templateContent = document.importNode(qid(id).content, true);
	return templateContent.firstElementChild;
}

function createElement(string) {

	if (typeof (string) != 'string') {
		throw 'String must be passed to createElement';
	}

	string = string.trim();

	var container,
		tag = string.match(/<\s*([a-z0-9-]+)/i)[1];

	switch (tag) {
		case 'thead' :
		case 'tbody' :
			container = document.createElement('table');
			break;
		case 'tr' :
			container = document.createElement('table');
			break;
		case 'td' :
		case 'th' :
			container = document.createElement('table');
			container.appendChild(document.createElement('tr'));
			break;
		default :
			container = document.createElement('div');
	}

	switch (tag) {

		case 'tr':
			container.innerHTML = string;
			return container.firstElementChild.firstElementChild;
			break;

		case 'th':
		case 'td':
			container.firstElementChild.innerHTML = string;
			return container.firstElementChild.firstElementChild;
			break;

		default:
			container.innerHTML = string;
			return container.firstElementChild;
			break;
	}

}
