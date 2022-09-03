const API_KEY = '22cd9319-2dd0-4d4d-b446-c98d6c5833f2';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

getMovies(API_URL_POPULAR);

async function getMovies(url) {
	const resp = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": API_KEY,
		},
	});
	const respData = await resp.json();
	showMovies(respData);
}

function showMovies(data) {
	const moviesEl = document.querySelector(".movies");

	document.querySelector(".movies").innerHTML = "";

	data.films.forEach(movie => {
		const movieEl = document.createElement("div");
		movieEl.classList.add("movie");
		movieEl.innerHTML = `
		<div class="movie__cover-inner">
						<img src="${movie.posterUrlPreview}" 
						class="movie__cover"
						alt="${movie.nameRu}">
					</div>
					<div class="movie__info">
						<div class="movie__title">${movie.nameRu}</div>
						<div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
						<div class="movie__average movie__average--${showClassByRate(movie.rating)}">${movie.rating}</div>
					</div>
		`
		movieEl.addEventListener("click", () => openModal(movie.filmId));
		moviesEl.appendChild(movieEl);
	});
}

function showClassByRate(rating) {
	if (rating >= 7) {
		return "green"
	} else if (rating >= 5) {
		return "orange"
	} else return "red"
}

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
	if (search.value) {
		getMovies(apiSearchUrl);

		search.value = "";
	}
})

// Modal
const modalEl = document.querySelector(".modal");

async function openModal(id) {
	const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": API_KEY,
		},
	});
	const respData = await resp.json();

	console.log(id);
	modalEl.classList.add("modal--show");
	document.body.classList.add("stop-scrolling");

	modalEl.innerHTML = `
	<div class="modal__card">
					<img src="${respData.posterUrl}" alt="" class="modal__movie-backdrop">
					<h2>
						<span class="modal__movie-title">${respData.nameRu}</span>
						<span class="modal__movie-release-year">${respData.year}</span>
					</h2>
					<ul class="modal__movie-info">
						<div class="loader"></div>
						<li class="modal__movie-genre">Жанр - ${respData.genres.map((genre) => ` ${genre.genre}`)}</li>
						${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
						<li class="modal__movie-site">Сайт -
							<a href="${respData.webUrl}">${respData.webUrl}</a>
						</li>
						<li class="modal__movie-overview">${respData.description}</li>
					</ul>
					<button class="modal__button-close">Закрыть</button>
				</div>
			</div>
			`
	const btnClose = document.querySelector(".modal__button-close");
	btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
	modalEl.classList.remove("modal--show");
	document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
	if (e.target === modalEl) {
		closeModal();
	}
})

window.addEventListener("keydown", (e) => {
	if (e.keyCode === 27) {
		closeModal();
	}
})