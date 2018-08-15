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

	static edit (tag) {
		tag = tag.trim();
		(new Dialog()).form(
			'Edit tag',
			'EditTagForm',
			() => {
				q('#Dialog input').value = tag;
			},
			() => {
				eddyt('edit',
					{ tag: tag, newTag: newTag },
					() => {
						// find correnct tag and fuck it
					},
					() => {
						console.log('pistle :(');
					}
				);
			}
		);
		// popup a form
		// save that shit
		// update the UI on success or just fuck off and die on failuere
	}

}
