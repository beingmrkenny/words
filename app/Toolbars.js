class Toolbars {

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

	static toggleCheckedWord () {
		var checkedToolbar = q('checked-word-tools'),
			checked = qq('li.checked').length,
			s = (checked == 1) ? '' : 's';
		checkedToolbar.firstChild.textContent = `${checked} checked word${s}: `;
		checkedToolbar.classList.toggle('active', (checked > 0));
	}

}
