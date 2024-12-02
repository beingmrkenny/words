class Word {

	static fave(words) {
		edit(
			'fave',
			{ words: words },
			(data) => {
				for (let theWord of qq('the-word')) {
					if (data.words.indexOf(theWord.textContent) > -1) {
						theWord.parentNode.dataset.fave = data.fave;
					}
				}
			},
			() => { console.log('oh, shit'); }
		);
	}

	static prepareEditTagsForm (dialog, words) {

		words = unique(words);

		let formHeader = 'Tagging ';
		if (words.length > 5) {
			formHeader = words.length + ' words';
		} else {
			let x = words.length - 1,
				amp = x - 1;
			for (let i = 0; i<=x; i++) {
				formHeader += `<a-word>${words[i]}</a-word>` + (i == amp ? ' & ' : (i == x) ? '' : ', ');
			}
		}

		dialog.querySelector('h3').innerHTML = formHeader;

		var tagList = document.createElement('ul');
		for (let h2 of qq('word-list h2')) {
			let tag = h2.textContent.trim();
			if (tag != 'INBOX') {
				let id = tag.replace(/[^a-z]/gi, ''),
					li = createElement(`
						<li><label for="TagInput-${id}">
							<input type="checkbox" value="${tag}" id="TagInput-${id}" data-changed="false"> ${tag}
						</label></li>
					`);
				li.querySelector('input').addEventListener('click', function (event) {
					event.stopPropagation();
					this.dataset.changed = "true";
				});
				li.querySelector('label').addEventListener('click', function (event) {
					event.preventDefault();
					let input = this.querySelector('input');
					if (input.disabled) {
						input.disabled = false;
					} else {
						input.checked = !input.checked;
					}
					input.dataset.changed = "true";
				});
				tagList.appendChild(li);
			}
		}

		dialog.querySelector('form').appendChild(tagList);

		let wordsHTTPArray = '';
		for (let word of words) {
			wordsHTTPArray += `&words[]=${word}`;
		}

		get('POST', '/words/data/get.php?what=WordsAndTags'+wordsHTTPArray, (data) => {
			let wordsCount = words.length;
			for (let tag in data) {
				let taggedCount = data[tag].length,
					input = q(`input[value="${tag}"]`);
				input.checked = (taggedCount == 0) ? false : true;
				input.disabled = (taggedCount == wordsCount || taggedCount == 0) ? false : true;
			}
		});

	}

	static submitEditTagsForm (words) {

		let add = [],
			remove = [];

		// TODO change this so that only changed inputs are picked up
		for (let checkbox of qq('#TagFormDialog input[type="checkbox"][data-changed="true"]')) {
			if (checkbox.disabled === false) {
				if (checkbox.checked === true) {
					add.push(checkbox.value);
				} else {
					remove.push(checkbox.value);
				}
			}
		}

		let newWords = q('#TagFormDialog input[type="text"]').value;
		if (newWords) {
			newWords = newWords.split(',');
			for (let newWord of newWords) {
				add.push(newWord.trim());
			}
		}

		edit(
			'tagging-words',
			{ words : words, add : add, remove: remove },
			(data) => {

				let inbox = q('ul', System.getInbox());

				for (let word in data) {
					for (let tag of data[word].add) {
						let wordList = q(`word-list[data-tag="${tag}"]`);
						if (!wordList) {
							wordList = WordList.create({ tag: tag });
						}
						let found = q(`[data-word="${word}"]`, wordList);
						if (!found) {
							q('ul', wordList).appendChild(Word.create({word:word}));
						}
						removeElements(qq(`[data-word="${word}"]`, inbox));
					}
					for (let tag of data[word].remove) {
						let isFave = '0';
						for (let wordElement of qq(`[data-word="${word}"]`, q(`word-list[data-tag="${tag}"]`))) {
							if (wordElement.dataset.fave == '1') {
								isFave = '1';
							}
							removeElements(wordElement);
						}
						if (!q(`[data-word="${word}"]`, inbox)) {
							inbox.appendChild(Word.create({ word: word, fave : isFave }));
						}
					}
				}

				for (let list of qq('word-list')) {
					WordList.sort(list);
					if (q('main').dataset.favesSeparated == '1') {
						WordList.separateFaves(list);
					}
				}

				// TODO uncheck those little bitches

			}
		);

	}

	static tags(words) {
		(new Dialog()).form(
			'Tagging',
			'TagForm',
			(dialog) => {
				Word.prepareEditTagsForm(dialog, words);
			},
			() => {
				Word.submitEditTagsForm(words);
			}
		);
	}

	// FIXME this is piss poor - butt why?
		// no idea what the fucking methods do, for one
	static destroy(words) {
		if (words.length > 0) {
			let wordsString = (words.length == 1) ? words : words.join(', ');
			(new Dialog()).message(`Are ye sure ye want to make delet all these word: ${wordsString}?`,
				() => {
					edit('delete-words',
						{ words: words },
						(data) => {
							for (let word of qq('the-word')) {
								if (words.indexOf(word.textContent) > -1) {
									word.parentNode.remove();
								}
							}
							System.toggleCheckedWordToolbar();
						},
						() => {
							console.log('bugger :(');
						}
					);
				}
			);
		}
	}

	static create (word) {

		if (word.word.trim() == '') {
			return false;
		}

		let wordLi = getTemplate('Word'),
			theWord = wordLi.querySelector('the-word'),
			hands = [ '👉🏻', '👉🏼', '👉🏽', '👉🏾', '👉🏿' ];

		wordLi.dataset.word = word.word;
		theWord.textContent = word.word;
		wordLi.dataset.hand = hands[Math.floor(Math.random() * 5)];
		wordLi.dataset.fave = word.fave;

		if (ovalue(word, 'newWord')) {
			theWord.classList.add('new');
		}

		for (let button of qq('button', wordLi)) {
			button.addEventListener('click', System.buttonClickHandler);
		}

		wordLi.addEventListener('click', Word.clickHandler);

		return wordLi;
	}

	static clickHandler () {
		var checkedCount = qq('.checked').length,
			activeCount = qq('li.active').length;

		this.classList.toggle('checked');

		if (checkedCount == 0 && activeCount == 0) {

			System.openToolbar(this);

		} else {
			for (let active of qq('li.active')) {
				active.classList.remove('active');
			}
			for (let styled of qq('tool-bar[style]')) {
				styled.style = null;
			}
		}

		System.toggleCheckedWordToolbar();
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
			setTimeout( () => { removeElements(q('deja-la')); }, 10000);
		}

		return wordsToAdd;
	}

	static edit (li) {
		var word = li.querySelector('the-word').textContent.trim();
		(new Dialog()).form(
			'Edit word',
			'EditItemForm',
			(dialog) => {
				let input = q('input', dialog);
				input.value = word;
				input.classList.add('word-input');
				input.focus();
			},
			() => {
				var newSpelling = ovalue(q('.word-input'), 'value').trim();
				edit('edit-word',
					{ oldSpelling: word, newSpelling: newSpelling },
					(data) => {
						for (let existingTheWord of qq('the-word')) {
							if (existingTheWord.textContent == data.oldSpelling) {
								existingTheWord.textContent = data.newSpelling;
							}
						}
						WordList.sort(li.closest('word-list'));
					},
					() => {
						console.log('pistle word :(');
					}
				);
			}
		);
	}

	static save (event) {

		event.preventDefault();

		var words = Word.getNotDejala(q('#AddWord input').value.split(','));

		if (words.length > 0) {

			q('#AddWord button').disabled = true;

			let xhr = new XMLHttpRequest();
			xhr.open("POST", "/words/data/save.php", true);
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

		WordList.hideyHideyShowyShowy();

		var firstWordList = q('word-list');

		if (!q('h2', firstWordList).textContent == 'INBOX') {
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
				fave: "0",
				newWord: true
			});
			if (wordLi) {
				wordListUl.appendChild(wordLi);
			}
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
