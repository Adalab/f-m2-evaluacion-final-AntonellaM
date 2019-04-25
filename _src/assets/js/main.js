'use strict';

const searchButtonEl = document.querySelector('.search__button');
const searchInputEl = document.querySelector('.search__input');
const searchResponseEl = document.querySelector('.results-list');
const favoriteSectionEl = document.querySelector('.favorite-list');

let favorites = [];

function deleteFavorite(event) {
  const removedDataId = event.currentTarget.parentElement.dataset.id;
  const indexOfRemoved = favorites.findIndex(i => i.id === removedDataId);
  favorites.splice(indexOfRemoved, 1);
  event.currentTarget.parentElement.remove();
  const removeSelectedFavorite = document.getElementById(`${removedDataId}`);
  if (removeSelectedFavorite){
    removeSelectedFavorite.classList.remove('results-section__card--selected');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function closeModalNotification(event) {
  event.currentTarget.parentElement.remove();
}

function getFavorites() {
  const favoriteList = document.querySelectorAll('.favorite');
  const ids = [];
  favoriteList.forEach(fav => {
    ids.push(fav.dataset.id);
  });
  return ids;
}

function checkFavorite(card, favoriteList) {  
  if(favoriteList.includes(card.id)) {
    card.classList.add('results-section__card--selected');
  }
}

function createNotification(notificationText) {
  const modalEl = document.createElement('div');
  const notification = document.createTextNode(notificationText);
  const modalCloseButton = document.createElement('i');
  modalCloseButton.classList.add('fas');
  modalCloseButton.classList.add('fa-times');
  modalCloseButton.classList.add('fa-sm');
  modalCloseButton.classList.add('modal__close-button');
  modalEl.classList.add('modal');
  modalEl.appendChild(notification);
  modalEl.appendChild(modalCloseButton);
  searchResponseEl.appendChild(modalEl);

  modalCloseButton.addEventListener('click', closeModalNotification);
}

function createFavoriteCard(object) {
  const favoriteListItem = document.createElement('li');
  const favoriteTitleEl = document.createElement('h2');
  const favoriteImg = document.createElement('img');
  const favoriteEraseButton = document.createElement('i');
  const favoriteTitle = document.createTextNode(object.name);
  
  favoriteListItem.setAttribute('data-id', object.id);
  favoriteImg.setAttribute('style', `background-image: ${object.img}`);
  favoriteImg.classList.add('favorite__image');
  favoriteListItem.classList.add('favorite');
  favoriteTitleEl.classList.add('favorite__title');
  favoriteEraseButton.classList.add('fas');
  favoriteEraseButton.classList.add('fa-times');
  favoriteEraseButton.classList.add('fa-sm');
  favoriteEraseButton.classList.add('favorite-erase');

  favoriteListItem.appendChild(favoriteTitleEl);
  favoriteListItem.appendChild(favoriteImg);
  favoriteSectionEl.appendChild(favoriteListItem);
  favoriteTitleEl.appendChild(favoriteTitle);
  favoriteListItem.appendChild(favoriteEraseButton);

  favoriteEraseButton.addEventListener('click', deleteFavorite);
}

function createSeriesCard(seriesObject) {
  const seriesCard = document.createElement('li');
  const titleEl = document.createElement('h2');
  const imageEl = document.createElement('img');
  const title = document.createTextNode(seriesObject.name);
  const defaultImg = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

  seriesCard.classList.add('results-section__card');
  imageEl.classList.add('results-card__image');
  seriesCard.classList.add('results-section__card');
  seriesCard.setAttribute('id', `${seriesObject.id}`);

  if (seriesObject.image === null) {
    imageEl.setAttribute('style', `background-image: url(${defaultImg})`);        
  } else {
    imageEl.setAttribute('style', `background-image: url(${seriesObject.image.medium})`);
  }

  titleEl.appendChild(title);
  seriesCard.appendChild(titleEl);
  searchResponseEl.appendChild(seriesCard);
  seriesCard.appendChild(imageEl);
  return seriesCard;
}

function cardClickFavoriteHandler(event) {

  if (event.currentTarget.classList.contains('results-section__card--selected') === false) {
    event.currentTarget.classList.add('results-section__card--selected');
    const myFavoriteSerie = {
      id: event.currentTarget.id,
      name: event.currentTarget.firstChild.innerHTML,
      img: event.currentTarget.firstChild.nextElementSibling.style.backgroundImage,
    };
    createFavoriteCard(myFavoriteSerie);
    favorites.push(myFavoriteSerie);
    localStorage.setItem('favorites', JSON.stringify(favorites));

  } else if (event.currentTarget.classList.contains('results-section__card--selected') === true) {
    event.currentTarget.classList.remove('results-section__card--selected');
    const removedId = document.getElementById(`${event.currentTarget.id}`);
    const indexOfRemoved = favorites.findIndex(i => i.id === removedId); 
    const favoriteToRemove = document.querySelector(`[data-id='${event.currentTarget.id}']`);
    favorites.splice(indexOfRemoved, 1);
    if (favoriteToRemove) {
      favoriteToRemove.remove();
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

if (localStorage.favorites) {
  favorites = JSON.parse(localStorage.getItem('favorites'));
  for (const series of favorites) {
    createFavoriteCard(series);
  }
}

function searchSeries(title) {
  fetch(`http://api.tvmaze.com/search/shows?q=${title}`)
    .then(response => response.json())
    .then(function (data) {
      if (data.length === 0) {
        createNotification('Tu búsqueda no ha dado ningún resultado, por favor, inténtalo de nuevo con otra serie');
      } else {
        searchResponseEl.innerHTML = '';
        const favoritesIdsArray = getFavorites();
        for (const serie of data) {
          const card = createSeriesCard(serie.show);
          card.addEventListener('click', cardClickFavoriteHandler);
          checkFavorite(card, favoritesIdsArray);
        }
      }
    });
}

function searchButtonClickHandler() {

  if (searchInputEl.value === '') {
    createNotification('Por favor, introduce una serie en el buscador');
  } else {
    searchSeries(searchInputEl.value);  
  }
}

searchButtonEl.addEventListener('click', searchButtonClickHandler);
