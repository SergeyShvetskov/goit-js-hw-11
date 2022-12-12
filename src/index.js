import './css/style.css';
import Notiflix from 'notiflix';

const refs = {
  button: document.querySelector('.submitButton'),
  input: document.querySelector('search-input'),
};

refs.button.addEventListener('click', onClick);

function onClick(event) {
  event.preventDefault();
  console.log('Кнопка працює');
  Notiflix.Notify.success('Повідомлення працюють');
}
