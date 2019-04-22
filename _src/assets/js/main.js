'use strict';

const searchButtonEl = document.querySelector('.search__button');
const searchInputEl = document.querySelector('.search__input');
const searchResponseEl = document.querySelector('.results-section');

let search;

function printSeriesTitle(seriesObject) {
  const titleEl = document.createElement('h2');
  const title = document.createTextNode(seriesObject.name);
  titleEl.appendChild(title);
  searchResponseEl.appendChild(titleEl);
}

function printSeriesImage(seriesObject) {
  console.log(seriesObject.image);
  const imageEl = document.createElement('img');
  imageEl.classList.add('results-section__image');
  const defaultImg = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  if (seriesObject.image === null) {
    imageEl.setAttribute('style', `background-image: url(${defaultImg})`);        
  } else {
    imageEl.setAttribute('style', `background-image: url(${seriesObject.image.medium})`);
  }
  searchResponseEl.appendChild(imageEl);
}

function searchSeries(title) {
  fetch(`http://api.tvmaze.com/search/shows?q=${title}`)
    .then(response => response.json())
    .then(function (data) {
      for (const serie of data) {
        printSeriesTitle(serie.show);
        printSeriesImage(serie.show);
      }
    });
}

function searchButtonClickHandler() {
  search = searchInputEl.value;
  searchSeries(search);
}

searchButtonEl.addEventListener('click', searchButtonClickHandler);