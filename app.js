let data = [];
let resizeTimer;

const container = document.querySelector("#paintings");

const createID = title => title.toLowerCase().replace(" ", "-");

const setHeight = item => {
	const smallImage = document.querySelector(`#small-${createID(item.title)}`);
	const largeImage = document.querySelector(`#large-${createID(item.title)}`);

	const set = () => {
		let parentWidth = container.getBoundingClientRect().width - 60;
		let diff = smallImage.naturalHeight / smallImage.naturalWidth;

		largeImage.style.height = `${parentWidth * diff}px`;
	};

	smallImage.complete ? set() : (smallImage.onload = set);
};

const item = ({ filename, title, description, date }) => `<a href="#${createID(
	title
)}" class="painting" id="${createID(title)}">
	<img src="./paintings/large/${filename}" alt="${title}, Large Size" id="large-${createID(
	title
)}" class="large" />
	<img src="./paintings/small/${filename}" alt="${title}, Small Size" id="small-${createID(
	title
)}" class="small" />

	<h2>${title}</h2>
	<h3>${description}</h3>
	<time datetime="${new Date(Date.parse(date)).toISOString()}">${date}</time>
</a>`;

const renderItems = data =>
	(container.innerHTML = data.map(i => item(i)).join(""));

const fetchData = async () => {
	const req = await fetch("./paintings/list.json");

	if (!req.ok) {
		return;
	}

	data = await req.json();
	renderItems(data);

	data.forEach(setHeight);

	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			data.forEach(setHeight);
		}, 200);
	});
};

const setViewOptions = () => {
	if ((a = document.querySelector(".view-options .active"))) {
		a.classList.remove("active");
	}

	if (location.hash.length > 0) {
		document.querySelector("#view-details").classList.add("active");
		container.classList.remove("grid");

		document.querySelector(decodeURIComponent(location.hash)).scrollIntoView({
			behavior: "smooth"
		});
	} else {
		document.querySelector("#view-list").classList.add("active");
		container.classList.add("grid");

		container.scrollTop = 0;
	}

	document.querySelector("#view-details a").href = `#${createID(
		data[0].title
	)}`;
};

const init = async () => {
	await fetchData();
	setViewOptions();
	window.addEventListener("hashchange", setViewOptions);
};

init();
