window.addEventListener('load', (we) => {
	function hasParentWithMatchingSelector(target, selector) {
		return [...document.querySelectorAll(selector)].some(el => el !== target && el.contains(target));
	}
	const hamburgerButton = document.querySelector('.WrapburgerRwd');
	hamburgerButton.addEventListener('click', (ce) => {
		hamburgerButton.classList.toggle('active');
	});
	window.addEventListener('click', (wc) => {
		const t = hasParentWithMatchingSelector(wc.target, '.burgermenu');
		if(!t && !wc.target.classList.contains('WrapburgerRwd')) {
			hamburgerButton.classList.remove('active');
		}
	});
});
