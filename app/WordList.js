class WordList {

	static displayWords (words) {

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
					System.openToolbar(this.parentNode);
				});
			}

			for (let button of qq('button', wordList)) {
				button.addEventListener('click', System.buttonClickHandler);
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

	static sort (list, by = null) {

		var existingSort = ovalue(list, 'dataset', 'sortBy'),
			sortBy;

		switch (by) {
			case '🔠' :
				sortBy = (existingSort == 'alpha-asc') ? 'alpha-desc' : 'alpha-asc';
				break;
			case '🔀' :
				sortBy = by;
				break;
			default :
				sortBy = existingSort || '🔀';
				break;
		}

		list.dataset.sortBy = sortBy;

		WordList.sortUl(list.querySelector('ul'), 'li', sortBy);

	}

	static separateFaves (list) {
		var ul = list.querySelector('ul');
		for (let fave of qq('[data-fave="1"]', ul)) {
			if (ul.firstElementChild) {
				ul.insertBefore(
					fave,
					(ul.firstElementChild.dataset.fave == 1)
						? q('[data-fave="0"]', ul)
						: ul.firstElementChild
				);
			} else {
				ul.appendChild(fave);
			}
		}
		q('main').dataset.favesSeparated = '1';
	}

	static sortUl (ul, lisSelector, by) {

		var wordLis = [].slice.call(ul.querySelectorAll(lisSelector)),
			sorts = {
				'alpha-asc' : (a, b) => {
					a = a.querySelector('the-word').textContent;
					b = b.querySelector('the-word').textContent;
					return (a > b) ? 1 : -1;
				},
				'alpha-desc' : (a, b) => {
					a = a.querySelector('the-word').textContent;
					b = b.querySelector('the-word').textContent;
					return (a < b) ? 1 : -1;
				}
			};

		if (by == '🔀') {
			wordLis = shuffle(wordLis);
		} else{
			wordLis.sort(sorts[by]);
		}

		for (let wordLi of wordLis) {
			ul.appendChild(wordLi);
		}

	}

	static sortLists () {
		var lists = [].slice.call(qq('word-list')),
			main = q('main');

		lists.sort((a, b) => {
			a = a.querySelector('h2').textContent;
			b = b.querySelector('h2').textContent;
			return (a > b) ? 1 : -1;
		});
		for (let list of lists) {
			main.appendChild(list);
		}
	}

	static hideyHideyShowyShowy (needle = null) {

		var substring, substrings;

		if (needle && needle.includes(',')) {
			substrings = new RegExp(needle.replace(/\s*,\s*/g, '|'));
		} else if (typeof needle == 'string') {
			substring = needle;
		}

		for (let wordLi of qq('li')) {
			let word = wordLi.querySelector('the-word').textContent;
			if (substrings) {
				wordLi.classList.toggle('display-none', !substrings.test(word));
			} else {
				wordLi.classList.toggle('display-none', (substring ? (!word.includes(substring)) : false));
			}
		}

		for (let wordList of qq('word-list')) {
			if (needle) {
				let allWords = qq('li', wordList).length,
					hiddenWords = qq('.display-none', wordList).length;
				wordList.classList.toggle('display-none', (allWords == hiddenWords));
			} else {
				wordList.classList.remove('display-none');
			}
		}
	}

	static edit (list) {
		var tag = q('h2', list).textContent.trim();
		(new Dialog()).form(
			'Edit tag',
			'EditItemForm',
			(dialog) => {
				let input = q('input', dialog);
				input.value = tag;
				input.classList.add('tag-input');
				input.focus();
			},
			() => {
				var newTag = ovalue(q('.tag-input'), 'value').trim();
				eddyt('edit-tag',
					{ tag: tag, newTag: newTag },
					(data) => {
						list.querySelector('h2').textContent = data.newTag;
						WordList.sortLists();
					},
					() => {
						console.log('pistle :(');
					}
				);
			}
		);
	}

	static destroy (tag) {
		(new Dialog()).message(`Are ye sure ye want to make delet of the tag of “${tag}”? Only the tag shall be made delet: its words shall be made to remain.`,
			() => {
				eddyt('delete-tag',
					{ tag: tag },
					(data) => {
						for (let wordList of qq('word-list')) {
							if (q('h2', wordList).textContent == tag) {
								let inbox = q('ul', System.getInbox());
								for (let theWord of qq('the-word', wordList)) {
									let word = theWord.textContent,
										wordLi = theWord.parentNode.parentNode.removeChild(theWord.parentNode);
									if (!q(`[data-word="${word}"]`)) {
										inbox.appendChild(wordLi);
									}
								}
								wordList.remove();
								break;
							}
						}
					},
					() => {
						console.log('wee wee cows :(');
					}
				);
			}
		);
	}

}
