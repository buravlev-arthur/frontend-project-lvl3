import 'bootstrap';
import './styles/main.scss';
import * as yup from 'yup';
import state from './state.js';
import watchedState from './view.js';

const form = document.querySelector('.rss-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const url = formData.get('url');
  const isNewUrl = !state.feeds.includes(url);

  if (isNewUrl) {
    const urlTempalte = yup.string().url().required();

    urlTempalte.isValid(url)
      .then((urlIsValid) => {
        if (urlIsValid) {
          watchedState.view.form.processing = true;
          watchedState.view.form.valid = true;
          return url;
        }

        watchedState.view.form.valid = false;
        return null;
      })
      .then((urlForRequest) => {
        if (urlForRequest) {
          state.feeds.push(urlForRequest);
          watchedState.view.form.processing = false;
        }
      });
  } else {
    watchedState.view.form.valid = false;
  }
});
