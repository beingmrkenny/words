class Word {

	static fave(words) {
		eddyt(
			'fave',
			{ words: words },
			(data) => {
				for (let theWord of qq('the-word')) {
					if (data.words.indexOf(theWord.textContent) > -1) {
						theWord.parentNode.dataset.fave = data.fave;
					}
				}
			},
			() => {
				console.log('oh, shit');
			}
		);
	}

	static tags(words, add, remove) {
		eddyt('tags', { words: words, add: add, remove: remove }, success, fail);
	}

	// FIXME this is piss poor - butt why?
	static destroy(words) {
		if (words.length > 0) {
			let wordsString = (words.length == 1) ? words : words.join(', ');
			(new Dialog()).message(`Are you sure you want to delete ${wordsString}?`,
				() => {
					eddyt('delete',
						{ words: words },
						(data) => {
							for (let word of qq('the-word')) {
								if (words.indexOf(word.textContent) > -1) {
									word.parentNode.remove();
								}
							}
							Word.checkedWordToolbar();
						},
						() => {
							console.log('bugger :(');
						}
					);
				}
			);
		}
	}

	static create (word, newWord = false) {

		let wordLi = getTemplate('Word'),
			theWord = wordLi.querySelector('the-word'),
			hands = [ '👉🏻', '👉🏼', '👉🏽', '👉🏾', '👉🏿' ];

		wordLi.dataset.hand = hands[Math.floor(Math.random() * 5)];
		wordLi.dataset.fave = word.fave;
		theWord.textContent = word.word;
		if (newWord) {
			theWord.classList.add('new');
		}

		wordLi.addEventListener('click', function () {

			var checkedCount = qq('.checked').length,
				activeCount = qq('li.active').length;

			this.classList.toggle('checked');

			if (checkedCount == 0 && activeCount == 0) {
				q('.checked').classList.add('active');
			} else {
				for (let active of qq('li.active')) {
					active.classList.remove('active');
				}
			}

			Word.checkedWordToolbar();
		});

		return wordLi;
	}

	static checkedWordToolbar () {
		var checkedToolbar = q('checked-word-tools'),
			checked = qq('li.checked').length,
			s = (checked == 1) ? '' : 's';
		checkedToolbar.firstChild.textContent = `${checked} checked word${s}: `;
		checkedToolbar.classList.toggle('active', (checked > 0));
	}

	static getNotDejala (wordsToAdd) {

		var messageTextWordDelements = [],
			indexesToRemove = [],
			dejala = [];

		wordsToAdd = unique(wordsToAdd);

		for (let existingTheWord of qq('the-word')) {

			let word = existingTheWord.textContent,
				index = wordsToAdd.indexOf(word);

			if (index > -1) {
				indexesToRemove.push(index);
				messageTextWordDelements.push(`<del>${word}</del>`);
				existingTheWord.scrollIntoView({
					behaviour: 'smooth',
					block: 'center'
				});
				existingTheWord.classList.add('deja-la');
				setTimeout( () => { existingTheWord.classList.remove('deja-la'); }, 10000);
			}

		}

		for (let i of indexesToRemove) {
			wordsToAdd.splice(i, 1);
		}

		if (messageTextWordDelements.length > 0) {
			q('header').appendChild(createElement(`<deja-la><span>déjà là: ${messageTextWordDelements.join()}</span></deja-la>`));
			setTimeout( () => { removeElement(q('deja-la')); }, 10000);
		}

		return wordsToAdd;
	}

	static save () {

		var words = Word.getNotDejala(q('#AddWord input').value.split(/[ ,]+/));

		if (words.length > 0) {

			q('#AddWord button').disabled = true;

			let xhr = new XMLHttpRequest();
			xhr.open("POST", "/words/data/scayve.php", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.addEventListener("readystatechange", function() {
				if (this.status == 200) {
					if (this.readyState == XMLHttpRequest.DONE) {
						Word.displayNouveaux(words);
						q('#AddWord button').disabled = false; // QUESTION is this happen when the right time?
					}
				}
			});

			xhr.send(`words=${words.join()}`);

		}

		q('#AddWord').reset();

	}

	static displayNouveaux (words) {

		var firstWordList = q('word-list');

		if (!firstWordList.querySelector('.list-header h2').textContent == 'INBOX') {
			firstWordList = getTemplate('WordList');
			firstWordList.querySelector('h2').textContent = 'INBOX';
			let main = q('main');
			if (!q('word-list')) {
				main.insertBefore(firstWordList, main.firstElementChild);
			} else {
				main.appendChild(firstWordList);
			}
		}

		let wordListUl = firstWordList.querySelector('ul'),
			wordLi;

		for (let word of words) {
			wordLi = Word.create({
				word: word,
				fave: "0"
			}, true);
			wordListUl.appendChild(wordLi);
		}

		if (wordLi) {
			// TODO if no sort, then shove the word right up the top
			// TODO if sorted, sort the fahkin list according to that fahkin sort
			WordList.sort(firstWordList);
			setTimeout(function () {
				// HACK this timeout seems hacky - waiting for something, but what?
				wordLi.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}, 500);
		}

	}
}
