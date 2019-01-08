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

			case '☝️':
				for (let active of qq('li.active')) {
					active.classList.remove('active');
				}
				for (let checked of qq('li.checked')) {
					checked.classList.remove('checked');
				}
				Toolbars.toggleCheckedWord();
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

}
