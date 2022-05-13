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
      modalWindow: {
        title: '',
        description: '',
        link: '',
      },
      showUpdatingErrorAlert: false,
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
        const query = `disableCache=true&url=${encodeURIComponent(url)}`;

        const formattedUrl = new URL(`${protocol}://${hostname}${path}?${query}`);

        return formattedUrl.href;
      };

      const setEventsForLinks = () => {
        watchedState.posts.forEach((post, index) => {
          const link = document.querySelector(`.posts a[data-id="${post.id}"]`);
          link.addEventListener('click', () => {
            watchedState.posts[index].visited = true;
          });
        });
      };

      const updatePosts = () => {
        const feedsCount = watchedState.feeds.length;

        if (feedsCount === 0) {
          setTimeout(updatePosts, 5000);
          return;
        }

        let updatedFeeds = 0;

        const addUpdatedFeed = () => {
          updatedFeeds += 1;
          if (updatedFeeds === feedsCount) {
            setTimeout(updatePosts, 5000);
          }
        };

        watchedState.feeds.forEach(({ id, link }) => {
          const existPosts = watchedState.posts.filter(({ feedId }) => feedId === id);
          const proxyURL = getProxyUrl(link);

          axios.get(proxyURL)
            .then((response) => {
              const responseContent = response.data.contents;
              const parsedContent = parseXMLTree(responseContent);
              const newPosts = _.differenceBy(parsedContent.posts, existPosts, 'link');
              const newPostsWithIds = newPosts.map((post) => ({
                id: _.uniqueId(),
                feedId: id,
                ...post,
              }));
              watchedState.posts = [...newPostsWithIds, ...watchedState.posts];
              setEventsForLinks();
              watchedState.view.showUpdatingErrorAlert = false;
            })
            .catch(() => {
              watchedState.view.showUpdatingErrorAlert = true;
            })
            .finally(() => {
              addUpdatedFeed();
            });
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

            if (!parsedData) {
              watchedState.view.form.valid = false;
              watchedState.view.form.processing = false;
              watchedState.view.form.message = 'urlFieldMessages.invalidResource';
              return;
            }

            const { feed, posts } = parsedData;
            const feedId = _.uniqueId();
            const feedWithId = { id: feedId, ...feed };
            const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));

            watchedState.view.form.valid = true;
            watchedState.view.form.processing = false;
            watchedState.view.form.message = 'urlFieldMessages.success';
            watchedState.feeds.unshift(feedWithId);
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
          });
      });

      modalWindow.addEventListener('show.bs.modal', (event) => {
        const postId = event.relatedTarget.dataset.id;
        const [{ title, description, link }] = watchedState.posts.filter(({ id }) => id === postId);
        const postIndex = watchedState.posts.findIndex(({ id }) => (id === postId ? 1 : 0));
        watchedState.posts[postIndex].visited = true;
        watchedState.view.modalWindow = { title, description, link };
      });

      setTimeout(updatePosts, 5000);
    });
};
