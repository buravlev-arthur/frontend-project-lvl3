import 'bootstrap';
import './styles/main.scss';
import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import ru from './dicts/ru.js';
import watch from './view.js';
import parseXMLTree from './parser.js';

export default () => {
  const state = {
    feeds: [],
    posts: [],
    view: {
      form: {
        valid: null,
        processing: false,
        message: '',
      },
      modalWindowPostId: null,
      showUpdatingErrorAlert: false,
      postsLinks: [],
    },
  };

  yup.setLocale({
    string: {
      url: 'urlFieldMessages.invalidUrl',
    },
    mixed: {
      required: 'urlFieldMessages.shouldNotBeEmpty',
      notOneOf: 'urlFieldMessages.resourceIsExists',
    },
  });

  i18next
    .init({ lng: 'ru', debug: false, resources: { ru } })
    .then((translate) => {
      const watchedState = watch(state, translate);
      const form = document.querySelector('.rss-form');
      const modalWindow = document.querySelector('#modal');

      const getProxyUrl = (url) => {
        const protocol = 'https';
        const hostname = 'allorigins.hexlet.app';
        const path = '/get';
        const proxyURLData = new URL(`${path}`, `${protocol}://${hostname}`);
        proxyURLData.searchParams.set('disableCache', 'true');
        proxyURLData.searchParams.set('url', url);

        return proxyURLData.href;
      };

      const setEventsForLinks = () => {
        watchedState.view.postsLinks.forEach((link, index) => {
          const postLink = document.querySelector(`.posts a[data-id="${link.id}"]`);
          postLink.addEventListener('click', () => {
            watchedState.view.postsLinks[index].visited = true;
          });
        });
      };

      const updatePosts = () => {
        const promises = watchedState.feeds.map(({ link }) => axios.get(getProxyUrl(link)));
        const promise = Promise.all(promises);
        promise
          .then((responses) => {
            responses.forEach((response) => {
              const { data: { status: { url } } } = response;
              const [{ id }] = watchedState.feeds.filter((feed) => feed.link === url);
              const existPosts = watchedState.posts.filter(({ feedId }) => feedId === id);
              const responseContent = response.data.contents;
              const parsedContent = parseXMLTree(responseContent, url);
              const newPosts = _.differenceBy(parsedContent.posts, existPosts, 'link');
              const newPostsWithIds = newPosts.map((post) => ({
                id: _.uniqueId(),
                feedId: id,
                ...post,
              }));
              const newPostsLinks = newPostsWithIds.map((post) => ({
                id: post.id,
                visited: false,
              }));

              watchedState.view.postsLinks = [...newPostsLinks, ...watchedState.view.postsLinks];
              watchedState.posts = [...newPostsWithIds, ...watchedState.posts];
            });

            setEventsForLinks();
            watchedState.view.showUpdatingErrorAlert = false;
          })
          .catch(() => {
            watchedState.view.showUpdatingErrorAlert = true;
          })
          .finally(() => {
            setTimeout(updatePosts, 5000);
          });
      };

      const loadRss = (rssFeedURL) => {
        watchedState.view.form.processing = true;
        watchedState.view.form.valid = true;
        watchedState.view.form.message = 'urlFieldMessages.loading';
        const proxyURL = getProxyUrl(rssFeedURL);
        return axios.get(proxyURL);
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const url = formData.get('url');
        const existLinks = watchedState.feeds.map((feed) => feed.link);
        const urlTempalte = yup.string().url().required().notOneOf(existLinks);

        urlTempalte.validate(url)
          .then((rssFeedURL) => loadRss(rssFeedURL))
          .then((response) => {
            const resourceContent = response.data.contents;
            const parsedData = parseXMLTree(resourceContent, url);
            const { feed, posts } = parsedData;
            const feedId = _.uniqueId();
            const feedWithId = { id: feedId, ...feed };
            const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));
            const postsLinks = postsWithId.map(({ id }) => ({ id, visited: false }));

            watchedState.view.form.valid = true;
            watchedState.view.form.processing = false;
            watchedState.view.form.message = 'urlFieldMessages.success';
            watchedState.feeds.unshift(feedWithId);
            watchedState.view.postsLinks = [...postsLinks, ...watchedState.view.postsLinks];
            watchedState.posts = [...postsWithId, ...watchedState.posts];
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

            if (err.name === 'ParserError') {
              watchedState.view.form.message = 'urlFieldMessages.invalidResource';
            }
          });
      });

      modalWindow.addEventListener('show.bs.modal', (event) => {
        const postId = event.relatedTarget.dataset.id;
        watchedState.view.modalWindowPostId = postId;
        watchedState.view.postsLinks.find((post) => post.id === postId).visited = true;
      });

      setTimeout(updatePosts, 5000);
    });
};
