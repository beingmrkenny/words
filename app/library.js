function qid (id) {
	return document.getElementById(id);
}

function q (selector, context = document) {
	return context.querySelector(selector);
}

function qq (selector, context = document) {
	return context.querySelectorAll(selector);
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

function removeElements (elements) {

	if (elements instanceof HTMLElement) {
		elements = [elements];
	}

	if (elements instanceof NodeList || Array.isArray(elements)) {

		for (let element of elements) {

			element.style.height = element.offsetHeight + 'px';
			element.style.width = element.offsetWidth + 'px';
			element.style.transition = 'margin 85ms ease-in, padding 85ms ease-in, opacity 85ms ease-in, height 85ms ease-in';

			element.addEventListener('transitionend', function (event) {
				var element = this;
				if (event.propertyName == 'height') {
					element.remove();
				}
			});

			let styles = {
				overflow : 'hidden',
				margin   : '0',
				padding  : '0',
				opacity  : '0',
				height   : '0'
			};

			window.setTimeout(function () {
				for (let property in styles) {
					element.style[property] = styles[property];
				}
			}, 10);

		}

	}

}

function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

function unique (a) {
	return a.filter( (value, index, self) => {
		return self.indexOf(value) === index;
	} );
}

function ovalue(obj) {
	var base = obj;
	if (typeof base == 'object' && base !== null) {
		for (var i=1, x=arguments.length; i<x; i++) {
			if (typeof base[arguments[i]] == 'object' && base[arguments[i]] !== null) {
				base = base[arguments[i]];
			} else {
				base = base[arguments[i--]];
				break;
			}
		}
	}
	return base;
}
