import onChange from 'on-change';
import state from './state.js';
import Render from './classes/Render.js';

const render = new Render();

const watchedState = onChange(state, (path, value) => {
  if (path === 'view.form.valid') {
    render.urlInputSetBorder(value);
  }

  if (path === 'view.form.processing' && value) {
    render.formButtonDisable();
  }

  if (path === 'view.form.processing' && !value) {
    render.formButtonAble();
    render.urlInputClear();
  }
});

export default watchedState;
