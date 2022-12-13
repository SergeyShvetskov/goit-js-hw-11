import './css/style.css';
import Notiflix from 'notiflix';


const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  submitButton: document.querySelector('.submitButton'),
  loader: document.querySelector('.news-loader'),
};
const URL = 'https://pixabay.com/api/';

let items = [];


function onSubmit(e) {
  e.preventDefault();
  // console.log(e.target.elements.searchQuery.value);
  const value = e.target.elements.searchQuery.value;
  
  console.log(value);

  // const value = e.target.value;
  let valueTrim = value.trim();
  if (valueTrim) {
    refs.list.innerHTML = '';
    showLoader();
    lockForm();
    fetch(
      `${URL}?key=32016262-7f9a92cb69c408002dfb9dc09&q=${valueTrim}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
    )
      .then(resp => {
        if (!resp.ok) {
          throw Error();
        }
        return resp.json();
      })
      .then(data => {
        items = data.hits;
        if (items.length == 0) {
          throw Error();
        }
        console.log(items);
        render();
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      })
      .finally(() => {
        hideLoader();
        unlockForm();
      });
  }
};

refs.form.addEventListener('submit', onSubmit);

const getItemtemplateMin = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads }) =>
  `<div class="photo-card">
  <img class="gallery__image" src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
        <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;

const render = () => {
 const list = items.map(getItemtemplateMin);
    refs.list.innerHTML = '';
    refs.list.insertAdjacentHTML('beforeend', list.join(''));
};


const showLoader = () => {
  refs.loader.classList.add('show');
};

const hideLoader = () => {
  refs.loader.classList.remove('show');
};

const lockForm = () => {
  refs.submitButton.setAttribute('disabled', true);
};
const unlockForm = () => {
  refs.submitButton.removeAttribute('disabled');
};
