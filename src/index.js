import 'bootstrap';
import './styles/main.scss';
import * as yup from 'yup';
import state from './state.js';
import watchedState from './view.js';

yup.setLocale({
  string: {
    url: 'urlFieldMessages.invalidUrl',
  },
});

const form = document.querySelector('.rss-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const url = formData.get('url');
  const isNewUrl = !state.feeds.includes(url);

  if (isNewUrl) {
    const urlTempalte = yup.string().url().required();

    urlTempalte.validate(url)
      .then((link) => {
        watchedState.view.form.processing = true;
        watchedState.view.form.valid = true;
        watchedState.view.form.message = 'urlFieldMessages.success';

        return link;
      })
      .catch((err) => {
        const [errorTextPath] = err.errors;
        watchedState.view.form.valid = false;
        watchedState.view.form.message = errorTextPath;
      })
      .then((link) => {
        state.feeds.push(link);
        watchedState.view.form.processing = false;
      });
  }

  if (!isNewUrl) {
    watchedState.view.form.valid = false;
    watchedState.view.form.message = 'urlFieldMessages.resourceIsExists';
  }
});
