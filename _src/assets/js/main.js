'use strict';

const searchButtonEl = document.querySelector('.search__button');
const searchInputEl = document.querySelector('.search__input');
const searchResponseEl = document.querySelector('.results-section');
const favoriteSectionEl = document.querySelector('.favorite-section');

window.localStorage.clear();

let search = '';
let favorites = [];

function cardClickFavoriteHandler(event) {
  if (event.currentTarget.classList.contains('results-section__card--selected') === false) {
    event.currentTarget.classList.add('results-section__card--selected');
    const favoriteListItem = document.createElement('li');
    const favoriteTitleEl = document.createElement('h2');
    const favoriteTitle = document.createTextNode(event.currentTarget.firstChild.innerHTML);
    favoriteTitleEl.appendChild(favoriteTitle);
    const favoriteImg = document.createElement('img');
    favoriteImg.setAttribute('style', `background-image: ${event.currentTarget.firstChild.nextElementSibling.style.backgroundImage}`);
    favoriteImg.classList.add('results-section__image');
    favoriteListItem.appendChild(favoriteTitleEl);
    favoriteListItem.appendChild(favoriteImg);
    favoriteListItem.setAttribute('id', event.currentTarget.firstChild.id);
    favoriteSectionEl.appendChild(favoriteListItem);

    const myFavoriteSerie = {
      id: event.currentTarget.firstChild.id,
      name: event.currentTarget.firstChild.innerHTML,
      img: event.currentTarget.firstChild.nextElementSibling.style.backgroundImage,
    };

    console.log(myFavoriteSerie);
    favorites.push(myFavoriteSerie);
    localStorage.setItem('favorites', JSON.stringify(favorites));

  } else if (event.currentTarget.classList.contains('results-section__card--selected') === true) {
    event.currentTarget.classList.remove('results-section__card--selected');
    const removedId = document.getElementById(`${event.currentTarget.firstChild.id}`);
    removedId.remove();



    const cardPosition = favorites.indexOf(event.currentTarget.firstChild.id);
    favorites.splice(cardPosition-1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

function printSeriesTitle(seriesObject) {
  const seriesCard = document.createElement('div');
  const titleEl = document.createElement('h2');
  const title = document.createTextNode(seriesObject.name);
  titleEl.appendChild(title);
  titleEl.setAttribute('id', `${seriesObject.id}`);
  seriesCard.appendChild(titleEl);
  searchResponseEl.appendChild(seriesCard);
  printSeriesImage(seriesCard, seriesObject);
}

function printSeriesImage(seriesCard, seriesObject) {
  const imageEl = document.createElement('img');
  imageEl.classList.add('results-section__image');
  const defaultImg = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  if (seriesObject.image === null) {
    imageEl.setAttribute('style', `background-image: url(${defaultImg})`);        
  } else {
    imageEl.setAttribute('style', `background-image: url(${seriesObject.image.medium})`);
  }
  seriesCard.appendChild(imageEl);
  seriesCard.classList.add('results-section__card');

  const arraySeriesCard = document.querySelectorAll('.results-section__card');
  
  for (const card of arraySeriesCard) {
    card.addEventListener('click', cardClickFavoriteHandler);
  }
}

function searchSeries(title) {
  fetch(`http://api.tvmaze.com/search/shows?q=${title}`)
    .then(response => response.json())
    .then(function (data) {
      searchResponseEl.innerHTML = '';

      for (const serie of data) {
        printSeriesTitle(serie.show);
      }
    });
}

function searchButtonClickHandler() {
  search = searchInputEl.value;
  searchSeries(search);
}

searchButtonEl.addEventListener('click', searchButtonClickHandler);