import 'bootstrap';
import './styles/main.scss';
import axios from 'axios';
import * as yup from 'yup';
import state from './state.js';
import watchedState from './view.js';
import { parseXMLTree, resourceExists, getProxyUrl } from './utils.js';

yup.setLocale({ string: { url: 'urlFieldMessages.invalidUrl' } });

const form = document.querySelector('.rss-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const url = formData.get('url');
  const isNewUrl = !resourceExists(url, state.feeds);

  if (isNewUrl) {
    const urlTempalte = yup.string().url().required();

    urlTempalte.validate(url)
      .then(() => {
        watchedState.view.form.processing = true;
        return getProxyUrl(url);
      })
      .then((proxyURL) => axios.get(proxyURL))
      .then((response) => {
        const resourceContent = response.data.contents;
        const nextFeedId = state.feeds.length;
        const nextPostId = state.posts.length;
        const parsedData = parseXMLTree(resourceContent, url, nextFeedId, nextPostId);

        if (!parsedData) {
          watchedState.view.form.valid = false;
          watchedState.view.form.message = 'urlFieldMessages.invalidResource';
          return;
        }

        const { feed, posts } = parsedData;
        watchedState.feeds.push(feed);
        watchedState.posts = [...watchedState.posts, ...posts];
        watchedState.view.form.valid = true;
        watchedState.view.form.message = 'urlFieldMessages.success';
      })
      .catch((err) => {
        watchedState.view.form.valid = false;

        if (err.name === 'ValidationError') {
          const [errorTextPath] = err.errors;
          watchedState.view.form.message = errorTextPath;
        }

        if (err.name === 'AxiosError') {
          watchedState.view.form.message = 'urlFieldMessages.networkError';
        }
      })
      .finally(() => {
        watchedState.view.form.processing = false;
      });
  }

  if (!isNewUrl) {
    watchedState.view.form.valid = false;
    watchedState.view.form.message = 'urlFieldMessages.resourceIsExists';
  }
});
