'use strict';

(function () {
  var cardsContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentLoadElement = bigPictureElement.querySelector('.social__loadmore');

  // Навешивает обработчик клика на миниатюру
  var addClickListener = function (card, data) {
    card.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.showPreview(data);
    });
  };

  // Вставляем в фрагмент все карточки
  var createCards = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = window.createPicture(data[i]);
      addClickListener(card, data[i]);
      fragment.appendChild(card);
    }
    return fragment;
  };

  // Вставляет миниатюры на страницу
  var onSuccessLoad = function (data) {
    var cards = createCards(data);
    cardsContainerElement.appendChild(cards);
  };

  window.backend.getData(onSuccessLoad, window.message.onErrorLoad);
  commentsCountElement.classList.add('hidden');
  commentLoadElement.classList.add('hidden');
})();
