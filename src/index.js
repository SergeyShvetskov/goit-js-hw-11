import './css/style.css';
import Notiflix from 'notiflix';

// const refs = {
//   button: document.querySelector('.submitButton'),
//   input: document.querySelector('search-input'),
// };

// refs.button.addEventListener('click', onClick);

// function onClick(event) {
//   event.preventDefault();
//   console.log('Кнопка працює');
//   Notiflix.Notify.success('Повідомлення працюють');
// }

const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.news-list'),
  // submitButton: document.querySelector('.submitButton'),
  loader: document.querySelector('.news-loader'),
  inputText: document.querySelector('.search-input'),
};
const URL = 'https://pixabay.com/api/';

let items = [];

// refs.inputText.addEventListener('input', onInput);
// refs.submitButton.addEventListener('click', onClick);
refs.form.addEventListener('submit', onSubmit);
const onSubmit = e => {
  const { value } = e.target.elements.query;
  e.preventDefault();
  // const value = e.target.value;
  let valueTrim = value.trim();
  console.log('запит через Сабміт');
  if (valueTrim) {
    refs.list.innerHTML = '';
    showLoader();
    fetch(
      `${URL}?key=32016262-7f9a92cb69c408002dfb9dc09&q=${valueTrim}&image_type=photo&orientation=horizontal&safesearch=true`
    )
      .then(resp => {
        if (!resp.ok) {
          throw Error();
        }
        return resp.json();
      })
      .then(data => {
        // items = data;
        console.log(data);
        // render();
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      })
      .finally(() => {
        hideLoader();
      });
  }
};

const getItemtemplateMin = ({ name, flags }) => {
  let result = `<li class="news-list-li"> 
    <img width = 30px src=${flags.svg}>
    <span class="name-country"> ${name.official}</span>
    </li>`;
  return result;
};

const getItemtemplateMax = ({
  name,
  capital,
  population,
  flags,
  languages,
}) => {
  let lang = Object.values(languages).join(', ');
  let result = `<li class="news-item">
       <img width = 30px src=${flags.svg} alt=${name}> 
    <span class="name-country-big"> ${name.official}</span>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${lang}</p>
        </li>
    `;
  return result;
};

const render = () => {
  if (items.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (items.length <= 10 && items.length >= 2) {
    const list = items.map(getItemtemplateMin);
    refs.list.innerHTML = '';
    refs.list.insertAdjacentHTML('beforeend', list.join(''));
  } else if (items.length == 1) {
    const list = items.map(getItemtemplateMax);
    refs.list.innerHTML = '';
    refs.list.insertAdjacentHTML('beforeend', list.join(''));
  }
};

const showLoader = () => {
  refs.loader.classList.add('show');
};

const hideLoader = () => {
  refs.loader.classList.remove('show');
};

// const lockForm = () => {
//   refs.submitButton.setAttribute('disabled', true);
// };
// const unlockForm = () => {
//   refs.submitButton.removeAttribute('disabled');
// };
