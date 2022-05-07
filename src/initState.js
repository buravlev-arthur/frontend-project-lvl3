const initState = () => ({
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
});

export default initState;
