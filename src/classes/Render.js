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

    posts.forEach(({ id, title, link }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      li.classList.add('list-group-item', 'border-0');
      a.classList.add('fw-bold');
      a.target = '_blank';
      a.href = link;
      a.dataset.id = id;
      a.textContent = title;

      li.append(a);
      this.postsList.append(li);
    });
  }
}

export default Render;
