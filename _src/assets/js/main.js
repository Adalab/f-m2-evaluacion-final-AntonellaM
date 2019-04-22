'use strict';

const searchButtonEl = document.querySelector('.search__button');
const searchInputEl = document.querySelector('.search__input');
const searchResponseEl = document.querySelector('.results-section');

let search = '';
let favorites = [];

function cardClickFavoriteHandler(event) {
  console.log('Listener works', event.currentTarget);
  const selectedCard = event.currentTarget;
  selectedCard.classList.toggle('results-section__card--selected');
  if (selectedCard.classList.contains('results-section__card--selected')) {
    favorites.push(selectedCard.innerHTML);
    localStorage.setItem('favorites', JSON.stringify(favorites));

  } else {
    const cardPosition = favorites.indexOf(selectedCard.innerHTML);
    favorites.splice(cardPosition, cardPosition, '');
    localStorage.setItem('favorites', JSON.stringify(favorites));

  }
}

function printSeriesTitle(seriesObject) {
  const seriesCard = document.createElement('div');
  const titleEl = document.createElement('h2');
  const title = document.createTextNode(seriesObject.name);
  titleEl.appendChild(title);
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