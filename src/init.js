import 'bootstrap';
import './styles/main.scss';
import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import state from './state.js';
import watchedState from './view.js';
import {
  parseXMLTree,
  setFeedId,
  setPostsIds,
  resourceExists,
  getProxyUrl,
  getNewPosts,
  setEventsForLinks,
} from './utils.js';

export default () => {
  yup.setLocale({
    string: {
      url: 'urlFieldMessages.invalidUrl',
    },
    mixed: {
      required: 'urlFieldMessages.shouldNotBeEmpty',
    },
  });

  const form = document.querySelector('.rss-form');
  const modalWindow = document.querySelector('#modal');

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
          watchedState.view.form.valid = true;
          watchedState.view.form.message = 'urlFieldMessages.processing';
          return getProxyUrl(url);
        })
        .then((proxyURL) => axios.get(proxyURL))
        .then((response) => {
          const resourceContent = response.data.contents;
          const nextFeedId = state.feeds.length;
          const nextPostId = state.posts.length;
          const parsedData = parseXMLTree(resourceContent, url);

          if (!parsedData) {
            watchedState.view.form.valid = false;
            watchedState.view.form.message = 'urlFieldMessages.invalidResource';
            return;
          }

          const { feed, posts } = parsedData;
          const feedWithId = setFeedId(feed, nextFeedId);
          const postsWithIds = setPostsIds(posts, nextPostId, nextFeedId);

          watchedState.feeds.unshift(feedWithId);
          watchedState.posts = [...postsWithIds, ...state.posts];
          setEventsForLinks();
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

  modalWindow.addEventListener('show.bs.modal', (event) => {
    const postId = parseInt(event.relatedTarget.dataset.id, 10);
    const [{ title, description, link }] = state.posts.filter(({ id }) => id === postId);
    const postIndex = _.findIndex(state.posts, (post) => post.id === postId);
    watchedState.posts[postIndex].visited = true;
    watchedState.view.modalWindow = { title, description, link };
  });

  setTimeout(getNewPosts, 5000);
};
