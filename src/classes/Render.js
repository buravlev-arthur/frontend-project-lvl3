import i18next from '../dict/index.js';

class Render {
  constructor() {
    this.form = document.querySelector('.rss-form');
    this.urlInput = this.form.elements.url;
    this.formButton = this.form.querySelector('button');
    this.formMessage = document.querySelector('.feedback');
    this.feedsCard = document.querySelector('.feeds > .card');
    this.feedsList = document.querySelector('.feeds ul');
    this.postsCard = document.querySelector('.posts > .card');
    this.postsList = document.querySelector('.posts ul');
    this.updatingErrorAlert = document.querySelector('.updating-error-alert');
    this.modalWindowTitle = document.querySelector('#modal .modal-title');
    this.modalWindowBody = document.querySelector('#modal .modal-body > p');
    this.modalWindowLink = document.querySelector('#modal a.full-article');
  }

  urlInputSetBorder(valid) {
    if (valid) {
      this.urlInput.classList.remove('is-invalid');
    } else {
      this.urlInput.classList.add('is-invalid');
    }
  }

  urlInputClear() {
    this.urlInput.value = '';
    this.urlInput.focus();
  }

  formButtonDisable() {
    this.formButton.setAttribute('disabled', 'disabled');
  }

  formButtonAble() {
    this.formButton.removeAttribute('disabled');
  }

  setFormMessage(text, valid) {
    this.formMessage.textContent = text;
    if (valid) {
      this.formMessage.classList.remove('text-danger');
      this.formMessage.classList.add('text-success');
    } else {
      this.formMessage.classList.remove('text-success');
      this.formMessage.classList.add('text-danger');
    }
  }

  renderFeeds(feeds) {
    this.feedsCard.classList.remove('d-none');
    this.feedsList.innerHTML = '';

    feeds.forEach((feed) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      li.classList.add('list-group-item', 'border-0');
      h3.classList.add('h6', 'm-0');
      p.classList.add('m-0', 'small', 'text-black-50');

      h3.textContent = feed.title;
      p.textContent = feed.description;

      li.append(h3);
      li.append(p);
      this.feedsList.append(li);
    });
  }

  renderPosts(posts) {
    this.postsCard.classList.remove('d-none');
    this.postsList.innerHTML = '';

    posts.forEach(({
      id,
      title,
      link,
      visited,
    }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const button = document.createElement('button');

      li.classList.add('list-group-item', 'border-0');

      const linkClass = visited ? 'fw-normal' : 'fw-bold';
      a.classList.add(linkClass);
      a.target = '_blank';
      a.href = link;
      a.dataset.id = id;
      a.textContent = title;

      button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'float-end');
      button.textContent = i18next.t('buttons.review');
      button.dataset.id = id;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';

      li.append(a);
      li.append(button);
      this.postsList.append(li);
    });
  }

  showUpdatingErrorAlert() {
    this.updatingErrorAlert.classList.remove('d-none');
  }

  hideUpdatingErrorAlert() {
    this.updatingErrorAlert.classList.add('d-none');
  }

  setModalWindow({ title, description, link }) {
    this.modalWindowTitle.textContent = title;
    this.modalWindowBody.textContent = description;
    this.modalWindowLink.href = link;
  }
}

export default Render;
