import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  submitButton: document.querySelector('.submitButton'),
  loader: document.querySelector('.news-loader'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.gallery.addEventListener('click', onClickGallery);
const URL = 'https://pixabay.com/api/';

let items = [];
let page = 1;
let valueTrim = '';
let newGallery = "";

function onClickGallery(event) {
  console.log(event);
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  newGallery = new SimpleLightbox('.gallery a');
  
  // newGallery.on('show.simplelightbox', function () {
  //   newGallery.destroy();
  //   // newGallery.close();
  // });
}
 async function onClickLoadMore(e) {
  page += 1;
  showLoader();
  lockForm();

    await axios.get(
    `${URL}?key=32016262-7f9a92cb69c408002dfb9dc09&q=${valueTrim}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
      .then(response => response.data).then(data => {
        items = data.hits;
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


async function onSubmit(e) {
  e.preventDefault();
  page = 1;
  const value = e.target.elements.searchQuery.value;

  valueTrim = value.trim();
  if (valueTrim) {
    refs.list.innerHTML = '';
    showLoader();
    lockForm();
    loadMoreHide();
     await axios.get(
      `${URL}?key=32016262-7f9a92cb69c408002dfb9dc09&q=${valueTrim}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
     ).then(response => response.data)
  
      .then(data => {
        console.log(data);
        const { totalHits } = data;
        if (totalHits !== 0) {
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        items = data.hits;
        if (items.length == 0) {
          throw Error();
        }
        console.log(items);
        render();
        loadMoreShow();
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
}


refs.form.addEventListener('submit', onSubmit);
refs.loadMoreButton.addEventListener('click', onClickLoadMore);

const getItemtemplateMin = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) =>
  `<div class="photo-card">
  <a class="photo-link" href=${largeImageURL} >
  <img class="gallery__image" src=${webformatURL} alt="${tags}" loading="lazy" />
  </a>
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
  if (page === 1) {
    refs.list.innerHTML = '';
  }
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

function loadMoreShow() {
  refs.loadMoreButton.classList.add('show');
}

function loadMoreHide() {
  refs.loadMoreButton.classList.remove('show');
}
