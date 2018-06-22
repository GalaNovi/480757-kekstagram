'use strict';

(function () {
  var template = document.querySelector('#picture').content;
  var picturesContainer = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  // Собираем информацию одной карточки
  var createCard = function (cardsInfo) {
    var tempCard = template.cloneNode(true);
    tempCard.querySelector('.picture__img').setAttribute('src', cardsInfo.url);
    tempCard.querySelector('.picture__stat--likes').textContent = cardsInfo.likes;
    tempCard.querySelector('.picture__stat--comments').textContent = cardsInfo.comments.length;
    return tempCard;
  };

  // Вставляем в фрагмент все карточки
  var insetCards = function () {
    for (var i = 0; i < window.data.photoParameters.length; i++) {
      fragment.appendChild(createCard(window.data.photoParameters[i]));
    }
  };
  insetCards();

  // Вставляем фрагмент в DOM
  picturesContainer.appendChild(fragment);
})();
