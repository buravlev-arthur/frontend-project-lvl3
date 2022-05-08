[![Actions Status](https://github.com/buravlev-arthur/frontend-project-lvl3/workflows/hexlet-check/badge.svg)](https://github.com/buravlev-arthur/frontend-project-lvl3/actions/workflows/hexlet-check.yml)
[![Actions Status](https://github.com/buravlev-arthur/frontend-project-lvl3/workflows/project-check/badge.svg)](https://github.com/buravlev-arthur/frontend-project-lvl3/actions/workflows/project-check.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/9a3008e622be79fdc81e/maintainability)](https://codeclimate.com/github/buravlev-arthur/frontend-project-lvl3/maintainability)

# RSS-Агрегатор
RSS-Агрегатор – это веб-приложение, позволяющие сформировать персонализированную ленту постов путем добавления ссылок на rss-каналы.

Демонстрация проекта: [ссылка](https://frontend-project-lvl3-alpha-cyan.vercel.app/)

## Запуск тестового сервера на локальной машине
```
git clone https://github.com/buravlev-arthur/frontend-project-lvl3.git
cd frontend-project-lvl3
make install
make start
```

## Сборка проекта
```
git clone https://github.com/buravlev-arthur/frontend-project-lvl3.git
cd frontend-project-lvl3
make install
make build
```
Файлы для деплоя сгенерируются в директории «dist» (находится в коре проекта).

## Функции и особенности
1.	Обновление списков постов rss-каналов каждые 5 секунд без необходимости перезагружать страницу;
2.	Функция предварительного просмотра постов;
3.	Стабильная работа приложения при плохом интернет-соединении и в момент его отсутствия;
4.	Адаптивный интерфейс, позволяющий удобно работать с приложением в том числе с мобильных устройств.

## Инструкция по использованию
1.	Скопируйте и вставьте валидную *ссылку* на rss-канал в текстовое поле «Ссылка RSS»;
2.	Нажмите кнопку «Добавить»;
3.	Если *ссылка содержит* валидную rss-структуру, Вы увидите список постов слева и описание канала;
4.	При возникновении проблем с добавлением rss-канала Вы увидите соответствующие сообщение под текстовым полем (список возможных ошибок см. в разделе «Сообщения приложения»).

## Сообщения приложения
- **RSS успешно загружен** – Посты канала успешно добавлены в ленту;
- **RSS уже существует** – Вы пытаетесь добавить в ленту канал, URL которого был уже добавлен ранее;
- **Ссылка должна быть валидным URL** – неверный формат ссылки. Минимально необходимо указатель протокол и домен. Например: https://lorem-rss.herokuapp.com (где https – протокол; lorem-rss.herokuapp.com – доменное имя ресурса);
- **Ресурс не содержит валидный RSS** – ресурс по указанному URL доступен, но содержит неверный формат. Парсер приложения не может распознать данные ленты. 
- **Ошибка сети** – обычно данная ошибка возникает при отсутствии соединения с сервером или при неполадках на самом сервере (например, когда возвращаются коды ошибки 500). 
