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

	static edit (tagHeader) {
		var list = tagHeader.closest('word-list'),
			tag = tagHeader.textContent.trim();
		(new Dialog()).form(
			'Edit tag',
			'EditTagForm',
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
						// TODO got to here
						// re-sort the lists
					},
					() => {
						console.log('pistle :(');
					}
				);
			}
		);
	}

}
