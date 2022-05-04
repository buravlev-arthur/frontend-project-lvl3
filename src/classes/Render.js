class Render {
  constructor() {
    this.form = document.querySelector('.rss-form');
    this.urlInput = this.form.elements.url;
    this.formButton = this.form.querySelector('button');
    this.formMessage = document.querySelector('.feedback');
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
}

export default Render;
