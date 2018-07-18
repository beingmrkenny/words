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

	q('add-word button').addEventListener ('click', saveWirts);

	q('add-word input').addEventListener ('keypress', function (ev) {
		if (ev.key == 'Enter') {
			saveWirts();
		}
	});

});

// TODO need a sort word list thing

function saveWirts () {

	q('add-word button').disabled = true;

	var wirts = q('add-word input').value;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/wirts/data/shayve.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.addEventListener("readystatechange", function() {

		if (this.status == 200) {

			q('add-word button').disabled = false;

			if (this.readyState == XMLHttpRequest.DONE) {

				let inbox = q('word-list');
				if (!inbox.querySelector('list-header h2').textContent == 'INBOX') {
					inbox = getTemplate('WordList');
					wordList.querySelector('h2').textContent = 'INBOX';
				}

				let words = wirts.split(/[ ,]+/);
				let wordListList = inbox.querySelector('ul');
				for (let wirt of words) {
					wordListList.appendChild(createWord(wirt));
				}

				// FIXME scrolling is fewked - scrolling aint dont work for new pieces of shit
				// TODO scroll to the bastard
				// TODO highlight the new elements

				q('add-word input').value = '';

		    }

		}

	});
	xhr.send(`wirts=${wirts}`);

}

function createWord (wirt) {
	let word = getTemplate('Word');
	word.insertBefore(document.createTextNode(wirt), word.firstElementChild);
	return word;
}

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

		for (let wirt of tag.words) {
			wordListList.appendChild(createWord(wirt));
		}

		if (tag.tag === null && main.firstElementChild) {
			main.insertBefore(wordList, main.firstElementChild);
		} else {
			main.appendChild(wordList);
		}

	}

}
