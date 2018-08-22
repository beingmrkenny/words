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

	for (let wordLi of qq('li')) {
		let word = wordLi.querySelector('the-word').textContent;
		wordLi.classList.toggle('display-none', (!word.includes(this.value)));
	}

	for (let wordList of qq('word-list')) {
		let allWords = qq('li', wordList),
			hiddenWords = qq('.display-none', wordList);
		wordList.classList.toggle('display-none', (allWords.length == hiddenWords.length));
	}



});

setTimeout(function () {

	for (let button of qq('button')) {

		button.addEventListener('click', function () {

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
					// TODO dialog
					let add = [],
						remove = [];
					Word.tags(words, add, remove);
					break;

				case '🗑':
					Word.destroy(words);
					break;
			}

		});
	}

}, 0);

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
			h2.textContent = 'INBOX';
		} else {
			h2.textContent = tag.tag.toLowerCase();
			h2.addEventListener('click', function () {
				WordList.edit(this);
			});
		}

		tag.words = shuffle(tag.words);

		for (let word of tag.words) {
			wordListUl.appendChild(Word.create(word));
		}

		if (tag.tag === null && main.firstElementChild) {
			main.insertBefore(wordList, main.firstElementChild);
		} else {
			main.appendChild(wordList);
		}

	}

}
