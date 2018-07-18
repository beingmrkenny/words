document.addEventListener('DOMContentLoaded', function () {

	var xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function () {
		let json = JSON.parse(this.responseText);
		if (json) {
			displayWirts(json);
		} else {
			console.log('JSON done fucked up');
		}
	});
	xhr.addEventListener("error", function () {
		console.log('XHR done fucked up');
	});
	xhr.open("GET", "/wirts/data/ghent.php");
	xhr.send();

});

function displayWirts (wirts) {

	wirts.sort((a, b) => {

		if (!a.tag || !b.tag) {
			return -1;
		}

		a = a.tag.toUpperCase();
		b = b.tag.toUpperCase();

		if (a < b) {
			return -1;
		}

		if (a > b) {
			return 1;
		}

		return 0;

	});

	let main = document.querySelector('main');

	for (let tag of wirts) {

		let wordList = getTemplate('WordList'),
			wordListList = wordList.querySelector('ul');

		if (tag.tag === null) {
			wordList.querySelector('h2').textContent = 'INBOX';
		} else {
			wordList.querySelector('h2').textContent = tag.tag.toLowerCase();
		}

		for (let word of tag.words) {
			wordListList.appendChild(createElement(`<li>${word}</li>`));
		}

		if (tag.tag === null && main.firstElementChild) {
			main.insertBefore(wordList, main.firstElementChild);
		} else {
			main.appendChild(wordList);
		}

	}

}
