var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
	let json = JSON.parse(this.responseText);
	if (json) {
		displayWords(json);
	} else {
		console.log('JSON done fucked up');
	}
});
xhr.addEventListener("error", function () {
	console.log('XHR done fucked up');
});
xhr.open("GET", "/words/data/ghent.php");
xhr.send();

q('#AddWord button').addEventListener ('click', Word.save);

var wordInput = q('#AddWord input');
wordInput.addEventListener ('keyup', function (ev) {
	if (ev.key == 'Escape') {
		qid('AddWord').reset();
	}
	WordList.hideyHideyShowyShowy(this.value);
});

for (let button of qq('button')) {
	button.addEventListener('click', buttonClickHandler);
}

function buttonClickHandler () {

	var wordLis = qq('li.active, li.checked'),
		words = [];

	if (wordLis.length > 0) {
		for (let word of wordLis) {
			words.push(word.querySelector('the-word').textContent);
		}
	}

	switch (this.textContent) {

		case '⭐️👀':
			for (let list of qq('word-list')) {
				WordList.separateFaves(list);
			}
			break;

		case '🔠':
		case '🔀':
			for (let list of qq('word-list')) {
				WordList.sort(list, this.textContent);
			}
			break;

		case '☝️':
			for (let active of qq('li.active')) {
				active.classList.remove('active');
			}
			for (let checked of qq('li.checked')) {
				checked.classList.remove('checked');
			}
			Word.checkedWordToolbar();
			break;

		case '✏️':
			Word.edit(this.closest('li'));
			break;

		case '⭐️':
			Word.fave(words);
			break;

		case '🏷':
			Word.tags(words);
			break;

		case '🗑':
			Word.destroy(words);
			break;
	}

}

function displayWords (words) {

	words.sort((a, b) => {
		if (!a.tag || !b.tag) {
			return -1;
		}
		a = a.tag.toUpperCase();
		b = b.tag.toUpperCase();
		return (a == b) ? 0 : (a > b) ? 1 : -1;
	});

	let main = document.querySelector('main');

	for (let tag of words) {

		let wordList = getTemplate('WordList'),
			wordListUl = wordList.querySelector('ul'),
			h2 = wordList.querySelector('h2');

		if (tag.tag === null) {
			wordList.dataset.tag = 'INBOX';
			h2.textContent = 'INBOX';
		} else {
			wordList.dataset.tag = tag.tag;
			h2.textContent = tag.tag.toLowerCase();
			h2.addEventListener('click', function () {
				WordList.edit(this);
			});
		}

		if (tag.words) {
			tag.words = shuffle(tag.words);
			for (let word of tag.words) {
				wordListUl.appendChild(Word.create(word));
			}
		}

		if (tag.tag === null && main.firstElementChild) {
			main.insertBefore(wordList, main.firstElementChild);
		} else {
			main.appendChild(wordList);
		}

	}

}
