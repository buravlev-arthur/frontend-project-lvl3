class Render {
  constructor() {
    this.form = document.querySelector('.rss-form');
    this.urlInput = this.form.elements.url;
    this.formButton = this.form.querySelector('button');
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
}

export default Render;
