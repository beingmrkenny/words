class Toolbars {

	static openToolbar(containingParent) {

		containingParent.classList.add('active');

		let containingParentBox = containingParent.getBoundingClientRect();
		let toolbar = q('tool-bar', containingParent);

		let dialog = toolbar.closest('dialog');
		if (containingParent.tagName == 'WORD-LIST') {
			dialog.showModal();
			dialog.addEventListener('click', function () {
				this.close();
				containingParent.classList.remove('active');
			});
		}

		let toolbarBox = toolbar.getBoundingClientRect();
		let left = containingParentBox.x - 50;
		toolbar.style.top = `${containingParentBox.y - 65}px`;
		toolbar.style.left = `${left}px`;
		if (left < 0) {
			setTimeout(() => {
				toolbar.style.left = '10px';
			}, 0);
		}
		if (toolbarBox.right > window.innerWidth) {
			setTimeout(() => {
				toolbar.style.left = `${toolbarBox.left - (toolbarBox.right - window.innerWidth)}px`;
			}, 0);
		}
		if (window.innerWidth < toolbarBox.width) {
			document.body.appendChild(createElement(`<div class="cunt">get a wider screen, ye&nbsp;cunt</div>`));
		}
	}

	static toggleCheckedWord () {
		var checkedToolbar = q('checked-word-tools'),
			checked = qq('li.checked').length,
			s = (checked == 1) ? '' : 's';
		checkedToolbar.firstChild.textContent = `${checked} checked word${s}: `;
		checkedToolbar.classList.toggle('active', (checked > 0));
	}

}
