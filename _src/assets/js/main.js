'use strict';

const searchButtonEl = document.querySelector('.search__button');
const searchInputEl = document.querySelector('.search__input');
const searchResponseEl = document.querySelector('.results-list');
const favoriteSectionEl = document.querySelector('.favorite-list');

let search = '';
let favorites = [];

function favoriteCloseButton(event) {
  const removedDataId = event.currentTarget.parentElement.dataset.id;
  const indexOfRemoved = favorites.findIndex(i => i.id === removedDataId);
  favorites.splice(indexOfRemoved, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  event.currentTarget.parentElement.remove();
  const removeSelectedFavorite = document.getElementById(`${removedDataId}`);
  removeSelectedFavorite.classList.remove('results-section__card--selected');
}

if (localStorage.favorites) {
  favorites = JSON.parse(localStorage.getItem('favorites'));
  for (const series of favorites) {
    const favoriteListItem = document.createElement('li');
    favoriteListItem.classList.add('favorite');
    const favoriteTitleEl = document.createElement('h2');
    favoriteTitleEl.classList.add('favorite__title');
    const favoriteTitle = document.createTextNode(series.name);
    favoriteTitleEl.appendChild(favoriteTitle);

    const favoriteImg = document.createElement('img');
    favoriteImg.setAttribute('style', `background-image: ${series.img}`);
    favoriteImg.classList.add('favorite__image');

    favoriteListItem.appendChild(favoriteTitleEl);
    favoriteListItem.appendChild(favoriteImg);
    favoriteListItem.setAttribute('data-id', series.id);
    favoriteSectionEl.appendChild(favoriteListItem);

    const favoriteEraseButton = document.createElement('i');
    favoriteEraseButton.classList.add('fas');
    favoriteEraseButton.classList.add('fa-times');
    favoriteEraseButton.classList.add('fa-sm');
    favoriteEraseButton.classList.add('favorite-erase');
    favoriteListItem.appendChild(favoriteEraseButton);

    favoriteEraseButton.addEventListener('click', favoriteCloseButton);
  }
}

function cardClickFavoriteHandler(event) {

  if (event.currentTarget.classList.contains('results-section__card--selected') === false) {
    event.currentTarget.classList.add('results-section__card--selected');

    const favoriteListItem = document.createElement('li');
    favoriteListItem.classList.add('favorite');
    const favoriteTitleEl = document.createElement('h2');
    favoriteTitleEl.classList.add('favorite__title');
    const favoriteTitle = document.createTextNode(event.currentTarget.firstChild.innerHTML);
    favoriteTitleEl.appendChild(favoriteTitle);

    const favoriteImg = document.createElement('img');
    favoriteImg.setAttribute('style', `background-image: ${event.currentTarget.firstChild.nextElementSibling.style.backgroundImage}`);
    favoriteImg.classList.add('favorite__image');

    const favoriteEraseButton = document.createElement('i');
    favoriteEraseButton.classList.add('fas');
    favoriteEraseButton.classList.add('fa-times');
    favoriteEraseButton.classList.add('favorite-erase');
    favoriteListItem.appendChild(favoriteEraseButton);

    favoriteEraseButton.addEventListener('click', favoriteCloseButton);

    favoriteListItem.appendChild(favoriteTitleEl);
    favoriteListItem.appendChild(favoriteImg);
    favoriteListItem.setAttribute('data-id', `${event.currentTarget.id}`);
    favoriteSectionEl.appendChild(favoriteListItem);

    const myFavoriteSerie = {
      id: event.currentTarget.id,
      name: event.currentTarget.firstChild.innerHTML,
      img: event.currentTarget.firstChild.nextElementSibling.style.backgroundImage,
    };

    favorites.push(myFavoriteSerie);
    localStorage.setItem('favorites', JSON.stringify(favorites));

  } else if (event.currentTarget.classList.contains('results-section__card--selected') === true) {
    event.currentTarget.classList.remove('results-section__card--selected');
    
    const removedId = document.getElementById(`${event.currentTarget.id}`);

    const indexOfRemoved = favorites.findIndex(i => i.id === removedId);

    favorites.splice(indexOfRemoved-1, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    const favoriteToRemove = document.querySelector(`[data-id='${event.currentTarget.id}']`);

    if (favoriteToRemove) {
      favoriteToRemove.remove();
    }
  }
}

function printSeriesTitle(seriesObject) {
  const seriesCard = document.createElement('li');
  seriesCard.classList.add('results-section__card');
  seriesCard.setAttribute('id', `${seriesObject.id}`);

  const favoriteList = document.querySelectorAll('.favorite');

  for (const favoriteItem of favoriteList) {
    if (parseInt(favoriteItem.dataset.id) === seriesObject.id) {
      seriesCard.classList.add('results-section__card--selected');
    }
  }

  const titleEl = document.createElement('h2');
  const title = document.createTextNode(seriesObject.name);
  titleEl.appendChild(title);
  seriesCard.appendChild(titleEl);
  searchResponseEl.appendChild(seriesCard);
  printSeriesImage(seriesCard, seriesObject);
}

function printSeriesImage(seriesCard, seriesObject) {
  const imageEl = document.createElement('img');
  imageEl.classList.add('results-card__image');

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
      const titleResultsEl = document.createElement('h2');
      const titleResults = document.createTextNode('Resultados');
      titleResultsEl.appendChild(titleResults);

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