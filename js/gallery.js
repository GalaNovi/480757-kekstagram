'use strict';

(function () {
  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentLoadElement = bigPictureElement.querySelector('.social__loadmore');

  // Вставляет миниатюры на страницу
  var successLoad = function (data) {
    var cards = window.picture(data);
    picturesContainerElement.appendChild(cards);
    var picturesElements = document.querySelectorAll('.picture__img');
    addListenersForPictures(picturesElements, data);
  };

  // Навешивает обработчик клика на миниатюру
  var addClickListener = function (linkPicture, data) {
    linkPicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview(data);
    });
  };

  // Навешивает обработчик клика на все миниатюры
  var addListenersForPictures = function (pictures, data) {
    for (var i = 0; i < pictures.length; i++) {
      var picture = pictures[i];
      addClickListener(picture, data[i]);
    }
  };

  window.backend.getData(successLoad, window.message.errorLoad);
  commentsCountElement.classList.add('hidden');
  commentLoadElement.classList.add('hidden');
})();
