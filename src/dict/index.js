import i18next from 'i18next';
import ru from './langs/ru.js';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

export default i18next;
