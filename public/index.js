document.addEventListener('DOMContentLoaded', () => {
	const navbarLinks = document.querySelectorAll('.navbar a');
	const navBar = document.querySelectorAll('.navbar')
	navbarLinks.forEach(elem => elem.addEventListener('click', navbarTogglerClick));

	function navbarTogglerClick(event) {
		smoothScroll(event); //Call 'smoothScroll' function
	}

	// First approach using 'window.scollTo()' builtin function
	// function smoothScroll(event) {
	// 	event.preventDefault(); ///Avoid default auto from 'window.scroll' builtin function
	// 	const targetId = event.currentTarget.getAttribute('href');
	// 	window.scrollTo({
	// 		top: targetId === '#' ? 0 : document.querySelector(targetId).offsetTop,
	// 		behavior: 'smooth',
	// 	});
	// }

	//Second approach using 'requestAnimationFrame()' builtin function
	function smoothScroll(event) {
		event.preventDefault(); ///Avoid default auto from 'window.scroll' builtin function
		const targetId =
			event.currentTarget.getAttribute('href') === '#' ? 'header' : event.currentTarget.getAttribute('href');

		const targetPosition = document.querySelector(targetId).offsetTop;
		const startPosition = window.pageYOffset;
		const distance = targetPosition - startPosition;
		const duration = 1000;
		let start = null;

		window.requestAnimationFrame(step);

		function step(timeStamp) {
			if (!start) start = timeStamp;
			const progress = timeStamp - start;
			window.scrollTo(0, distance * (progress / duration) + startPosition);
			if (progress < duration) window.requestAnimationFrame(step);
		}
	}
	// })
});
