'use strict';

(function () {
  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentLoadElement = bigPictureElement.querySelector('.social__loadmore');

  // Вставляет миниатюры на страницу
  var insertCards = function (cards) {
    picturesContainerElement.appendChild(cards);
  };

  // Навешивает обработчик клика на миниатюру
  var addClickListener = function (linkPicture, data) {
    linkPicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview(data);
    });
  };

  // Навешивает обработчик клика на все миниатюры
  var addListenersForPictures = function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      var picture = pictures[i];
      addClickListener(picture, window.data[i]);
    }
  };

  // Создаем фрагмент с миниатюрами
  var cards = window.picture(window.data);

  // Заполняем страницу миниатюрами
  insertCards(cards);

  // создаем массив картинок-ссылок
  var picturesElements = document.querySelectorAll('.picture__img');

  addListenersForPictures(picturesElements);
  commentsCountElement.classList.add('hidden');
  commentLoadElement.classList.add('hidden');
})();
