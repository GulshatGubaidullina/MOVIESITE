const API_KEY = '22cd9319-2dd0-4d4d-b446-c98d6c5833f2';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';

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
						<div class="movie__category">${movie.genres.map((genre) => `${genre.genre}`)}</div>
						<div class="movie__average movie__average--green">8,3</div>
					</div>
		`
		// moviesEl.insertAdjacentHTML('beforeend', movieHTML);
		moviesEl.appendChild(movieEl);
	});
}