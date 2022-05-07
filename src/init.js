import 'bootstrap';
import './styles/main.scss';
import onChange from 'on-change';
import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import initState from './initState.js';
import viewActions from './view.js';
import {
  parseXMLTree,
  setFeedId,
  setPostsIds,
  resourceExists,
  getProxyUrl,
} from './utils.js';

export default () => {
  const state = initState();
  const watchedState = onChange(state, (path, value) => viewActions(state, path, value));
  const form = document.querySelector('.rss-form');
  const modalWindow = document.querySelector('#modal');

  yup.setLocale({
    string: {
      url: 'urlFieldMessages.invalidUrl',
    },
    mixed: {
      required: 'urlFieldMessages.shouldNotBeEmpty',
    },
  });

  const setEventsForLinks = () => {
    const links = document.querySelectorAll('.posts a');
    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const postId = parseInt(event.target.dataset.id, 10);
        const postIndex = _.findIndex(state.posts, (post) => post.id === postId);
        watchedState.posts[postIndex].visited = true;
      });
    });
  };

  const updatePosts = () => {
    state.feeds.forEach(({ id, link }) => {
      const existPosts = state.posts.filter(({ feedId }) => feedId === id);
      const proxyURL = getProxyUrl(link);
      axios.get(proxyURL)
        .then((response) => {
          const responseContent = response.data.contents;
          const parsedContent = parseXMLTree(responseContent);
          const newPosts = _.differenceBy(parsedContent.posts, existPosts, 'link');
          const nextPostId = state.posts.length;
          const newPostsWithIds = setPostsIds(newPosts, nextPostId, id);
          watchedState.posts = [...newPostsWithIds, ...state.posts];
          setEventsForLinks();
          watchedState.view.showUpdatingErrorAlert = false;
        })
        .catch(() => {
          watchedState.view.showUpdatingErrorAlert = true;
        });
    });

    setTimeout(updatePosts, 5000);
  };

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
          const parsedData = parseXMLTree(resourceContent, url);

          if (!parsedData) {
            watchedState.view.form.valid = false;
            watchedState.view.form.processing = false;
            watchedState.view.form.message = 'urlFieldMessages.invalidResource';
            return;
          }

          const { feed, posts } = parsedData;
          const feedWithId = setFeedId(feed, nextFeedId);
          const postsWithIds = setPostsIds(posts, nextPostId, nextFeedId);

          watchedState.view.form.valid = true;
          watchedState.view.form.processing = false;
          watchedState.view.form.message = 'urlFieldMessages.success';
          watchedState.feeds.unshift(feedWithId);
          watchedState.posts = [...postsWithIds, ...state.posts];
          setEventsForLinks();
        })
        .catch((err) => {
          watchedState.view.form.valid = false;
          watchedState.view.form.processing = false;

          if (err.name === 'ValidationError') {
            const [errorTextPath] = err.errors;
            watchedState.view.form.message = errorTextPath;
          }

          if (err.name === 'AxiosError') {
            watchedState.view.form.message = 'urlFieldMessages.networkError';
          }
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

  setTimeout(updatePosts, 5000);
};
