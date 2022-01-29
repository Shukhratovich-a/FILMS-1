// Select Movies List
var elMovieList = document.querySelector(".dashboard__list");

// Select Templates
var elMovieTemplate = document.querySelector("#movie-template").content;
var elGenresTemplate = document.querySelector("#genres-template").content;
var elSelctOptionTemplate = document.querySelector("#select-option-template").content;

// Select Add New Films Form And Inputs
var elDashboardForm = document.querySelector(".dashboard__form");
var elDashboardInputs = elDashboardForm.querySelectorAll(".dashboard__input");
var elDashboardInputName = elDashboardForm.querySelector(".dashboard__input[name='name']");
var elDashboardInputOverview = elDashboardForm.querySelector(".dashboard__input[name='overview']");
var elDashboardInputGenres = elDashboardForm.querySelector(".dashboard__input[name='genres']");
var elDashboardInputPoster = elDashboardForm.querySelector(".dashboard__input[name='poster']");
var elDashboardInputDate = elDashboardForm.querySelector(".dashboard__input[name='date']");

// Select Filter Item
var elFilterForm = document.querySelector(".dashboard__filter");
var elFilterSelect = elFilterForm.querySelector(".dashboard__input[name='select']");

// Normalize Date
var normalizeDate = (setDate) => {
  var date = new Date(setDate);

  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, 0);
  var day = String(date.getDate()).padStart(2, 0);

  return year + "-" + month + "-" + day;
};

// Render Movie Genres
var renderGenres = (array, genresDefaultTemplate, genresList) => {
  genresList.innerHTML = null;

  array.forEach((genre) => {
    var genresTempalte = genresDefaultTemplate.cloneNode(true);

    genresTempalte.querySelector(".genre").textContent = genre;

    genresList.appendChild(genresTempalte);
  });
};

// Render all films
var renderMovies = (array, movieDefaultTemplate, movieList) => {
  // Clear List
  movieList.innerHTML = null;

  array.forEach((movie) => {
    // Clone New Movie Template
    var movieTemplate = movieDefaultTemplate.cloneNode(true);
    var releaseDate = new Date(movie.release_date).getFullYear();

    // Set Text
    movieTemplate.querySelector(".movie__title").textContent = movie.title;
    movieTemplate.querySelector(".movie__data").textContent = "(" + releaseDate + ")";
    movieTemplate.querySelector(".movie__overview").textContent = movie.overview;

    // Set Attributes
    movieTemplate.querySelector(".movie__poster").src = movie.poster;
    movieTemplate.querySelector(".movie__data").title = normalizeDate(movie.release_date);

    // Select Genres List Template
    var genresList = movieTemplate.querySelector(".movie__genres");

    // Render Genres
    renderGenres(movie.genres, elGenresTemplate, genresList);

    // Appending
    movieList.appendChild(movieTemplate);
  });
};

// Early Return
var earlyReturn = (inputsArray = []) => {
  var summ = 0;

  inputsArray.forEach((input) => {
    if (input.value === "") {
      input.classList.add("dashboard__input--disabled");
      summ += 1;
    } else {
      input.classList.remove("dashboard__input--disabled");
    }
  });

  return summ;
};

// Add New Movie Function
var addNewMovie = (name, overview, genres, poster, date, moviesArray) => {
  var newMovieName = name.value.trim();
  var newMovieOverview = overview.value.trim();
  var newMovieGenres = genres.value.trim().split(" ");
  var newMoviePoster = poster.value.trim();
  var newMovieDate = date.value;

  var newMovie = {
    title: newMovieName,
    poster: newMoviePoster,
    overview: newMovieOverview,
    genres: newMovieGenres,
    release_date: newMovieDate,
  };

  moviesArray.unshift(newMovie);
};

// Render New Movie
var renderNewMovie = (evt) => {
  evt.preventDefault();

  if (earlyReturn(elDashboardInputs)) {
    return;
  }

  addNewMovie(
    elDashboardInputName,
    elDashboardInputOverview,
    elDashboardInputGenres,
    elDashboardInputPoster,
    elDashboardInputDate,
    films
  );

  renderMovies(films, elMovieTemplate, elMovieList);

  // Clear Input Values
  elDashboardInputName.value = null;
  elDashboardInputOverview.value = null;
  elDashboardInputGenres.value = null;
  elDashboardInputPoster.value = null;
};

// Collect All Genres
var collectGenres = (array = []) => {
  // Create Array
  var allGenresList = [];

  // Collect Genres
  array.forEach((arrayItem) => {
    arrayItem.genres.forEach((genre) => {
      if (!allGenresList.includes(genre)) {
        allGenresList.push(genre);
      }
    });
  });

  return allGenresList;
};

// Render Select Options
var renderSelects = (array, template, element) => {
  element.innerHTML = null;

  // Default Option
  var defultOption = template.cloneNode(true);
  defultOption.querySelector(".dashboard__filter__option").textContent = "All";
  defultOption.querySelector(".dashboard__filter__option").value = "All";
  defultOption.querySelector(".dashboard__filter__option").disabled = true;
  defultOption.querySelector(".dashboard__filter__option").selected = true;
  element.appendChild(defultOption);

  array.forEach((option) => {
    var optionTemplate = template.cloneNode(true);

    optionTemplate.querySelector(".dashboard__filter__option").textContent = option;
    optionTemplate.querySelector(".dashboard__filter__option").value = option;

    element.appendChild(optionTemplate);
  });
};

// Filter Movies
var filterMovies = (select) => {
  renderMovies(films, elMovieTemplate, elMovieList);

  var selectValue = select.value;
  var allMovies = document.querySelectorAll(".movie");

  allMovies.forEach((movie) => {
    var genres = movie.querySelectorAll(".genre");

    var genreArray = [];

    genres.forEach((genre) => {
      genreArray.push(genre.textContent);
    });

    if (!genreArray.includes(selectValue)) {
      movie.style.display = "none";
    } else {
      movie.style.display = "block";
    }
    if (selectValue === "All") {
      movie.style.display = "block";
    }
  });
};

var renderFilterMovies = (evt) => {
  evt.preventDefault();

  filterMovies(elFilterSelect);
};

//

renderSelects(collectGenres(films), elSelctOptionTemplate, elFilterSelect);

renderMovies(films, elMovieTemplate, elMovieList);

elDashboardForm.addEventListener("submit", renderNewMovie);

elFilterForm.addEventListener("submit", renderFilterMovies);
