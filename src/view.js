import render from './render.js';
import i18next from './dict/index.js';

const viewActions = (state, path, value) => {
  if (path === 'view.form.valid') {
    render.urlInputSetBorder(value);
  }

  if (path === 'view.form.message') {
    const text = i18next.t(value);
    const { view: { form: { valid } } } = state;
    render.setFormMessage(text, valid);
  }

  if (path === 'view.form.processing' && value) {
    render.urlInputReadonly();
    render.formButtonDisable();
  }

  if (path === 'view.form.processing' && !value) {
    render.urlInputEditable();
    render.formButtonAble();

    if (state.view.form.valid) {
      render.urlInputClear();
    }
  }

  if (path === 'feeds') {
    render.renderFeeds(state.feeds);
  }

  if (/^posts/.test(path)) {
    render.renderPosts(state.posts);
  }

  if (path === 'view.showUpdatingErrorAlert' && value) {
    render.showUpdatingErrorAlert();
  }

  if (path === 'view.showUpdatingErrorAlert' && !value) {
    render.hideUpdatingErrorAlert();
  }

  if (path === 'view.modalWindow') {
    render.setModalWindow(value);
  }
};

export default viewActions;
