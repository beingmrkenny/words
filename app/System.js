class System {

	static getInbox () {
		let inbox = q('word-list[data-tag="INBOX"]');
		if (!inbox) {
			let main = document.querySelector('main');
			inbox = getTemplate('WordList');
			inbox.querySelector('h2').textContent = 'INBOX';
			inbox.dataset.tag = 'INBOX';
			if (main.firstElementChild) {
				main.insertBefore(wordList, main.firstElementChild);
			} else {
				main.appendChild(wordList);
			}
		}
		return inbox;
	}

	static uncheckAllCheckedWords () {
		for (let active of qq('li.active')) {
			active.classList.remove('active');
		}
		for (let checked of qq('li.checked')) {
			checked.classList.remove('checked');
		}
		System.toggleCheckedWordToolbar();
	}

	static buttonClickHandler () {

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

			case '🏳':
				System.uncheckAllCheckedWords();
				break;

			case '✏️':
				let word = this.closest('li');
				if (word) {
					Word.edit(word);
				} else {
					WordList.edit(this.closest('word-list'));
				}
				break;

			case '⭐️':
				Word.fave(words);
				break;

			case '🏷':
				Word.tags(words);
				break;

			case '🗑':
				let parent = this.parentNode.parentNode.parentNode;
				if (parent.tagName == 'WORD-LIST') {
					WordList.destroy(q('h2', parent).textContent);
				} else {
					Word.destroy(words);
				}
				break;
		}

	}

	static openToolbar(containingParent) {

		containingParent.classList.add('active');

		var containingParentBox = containingParent.getBoundingClientRect(),
			toolbar = q('tool-bar', containingParent),
			toolbarBox = toolbar.getBoundingClientRect(),
			leftOffset = 50;

		if (window.innerWidth < toolbarBox.width) {
			document.body.appendChild(createElement(`<div class="cunt">get a wider screen, cunt</div>`));
			return;
		}

		if (containingParent.tagName == 'WORD-LIST') {
			let dialog = toolbar.closest('dialog');
			leftOffset = 0;
			dialog.showModal();
			dialog.addEventListener('click', function () {
				this.close();
				containingParent.classList.remove('active');
			});
			q(':focus').blur();
		}

		var left = containingParentBox.x - leftOffset;
		toolbar.style.top = `${containingParentBox.y - 65}px`;
		toolbar.style.left = `${left}px`;

		if (left < 0) {
			setTimeout(() => {
				toolbar.style.left = '10px';
			}, 0);
		} else if (toolbarBox.right > window.innerWidth) {
			setTimeout(() => {
				toolbar.style.left = `${toolbarBox.left - (toolbarBox.right - window.innerWidth)}px`;
			}, 0);
		}

	}

	static toggleCheckedWordToolbar () {
		var checkedToolbar = q('checked-word-tools'),
			checked = qq('li.checked').length,
			s = (checked == 1) ? '' : 's';
		checkedToolbar.firstChild.textContent = `${checked} checked word${s}: `;
		checkedToolbar.classList.toggle('active', (checked > 0));
	}

}
