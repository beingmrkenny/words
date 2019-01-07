class WordList {

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

	static edit (tagHeader) {
		var list = tagHeader.closest('word-list'),
			tag = tagHeader.textContent.trim();
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

}
