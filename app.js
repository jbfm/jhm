let data = [];
const container = document.querySelector("#paintings");

const createID = title => title.toLowerCase().replace(" ", "-");

const item = ({ filename, title, description, date }) => `<a href="#${createID(
	title
)}" class="painting" id="${createID(title)}">
	<img src="./paintings/large/${filename}" alt="${title}, Large Size" class="large" />
	<img src="./paintings/small/${filename}" alt="${title}, Small Size" class="small" />

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
};

const setViewOptions = () => {
	if ((a = document.querySelector(".view-options .active"))) {
		a.classList.remove("active");
	}

	if (location.hash.length > 0) {
		document.querySelector("#view-details").classList.add("active");
		container.classList.remove("grid");

		container.scrollTop = document.querySelector(
			decodeURIComponent(location.hash)
		).offsetTop;
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
