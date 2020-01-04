let data = [];
let resizeTimer;

const num = new Intl.NumberFormat(navigator.language || "en-US", {
	style: "currency",
	currency: "SEK"
});

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

const item = ({ filename, title, description, date, status, price }) => `
	<div class="painting ${status}" data-price="${price}">
		<a href="#${createID(title)}" id="${createID(title)}">
			<picture>
				<source srcset="./paintings/large/${filename}.webp" type="image/webp" />
				<img
					src="./paintings/large/${filename}.jpg"
					alt="${title}, Large Size"
					id="large-${createID(title)}"
					class="large"
				/>
			</picture>

			<picture>
				<source srcset="./paintings/small/${filename}.webp" type="image/webp" />
				<img
					src="./paintings/small/${filename}.jpg"
					alt="${title}, Small Size"
					id="small-${createID(title)}"
					class="small"
				/>
			</picture>
		</a>

		<h2 class="title">${title}</h2>
		<h3>${description}</h3>
		${
			status !== "sold" && price > 0
				? `<div class="price">${num.format(
						price / 100
				  )} <a href="mailto:hello@hellgrenmick.se?subject=${title}">BUY ME</a></div>`
				: ""
		}
		<time datetime="${new Date(Date.parse(date)).toISOString()}">${date}</time>
	</div>
`;

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

	container.classList.remove("view-sale");
	container.classList.remove("grid");

	if (location.hash.length > 0 && location.hash !== "#for-sale") {
		document.querySelector("#view-details").classList.add("active");
		container.classList.remove("grid");

		document.querySelector(decodeURIComponent(location.hash)).scrollIntoView({
			behavior: "smooth"
		});
	} else if (location.hash === "#for-sale") {
		document.querySelector("#view-sale").classList.add("active");
		container.classList.add("grid");
		container.classList.add("view-sale");
		container.scrollTop = 0;
	} else if (location.hash !== "#view-detailed") {
		document.querySelector("#view-list").classList.add("active");
		container.classList.add("grid");
		container.scrollTop = 0;
	}
};

const init = async () => {
	await fetchData();
	setViewOptions();
	window.addEventListener("hashchange", setViewOptions);
};

init();
