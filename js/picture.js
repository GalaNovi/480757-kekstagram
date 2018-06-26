'use strict';

(function () {
  var template = document.querySelector('#picture').content;

  // Собираем информацию одной карточки
  var createCard = function (cardsInfo) {
    var tempCard = template.cloneNode(true);
    tempCard.querySelector('.picture__img').setAttribute('src', cardsInfo.url);
    tempCard.querySelector('.picture__stat--likes').textContent = cardsInfo.likes;
    tempCard.querySelector('.picture__stat--comments').textContent = cardsInfo.comments.length;
    return tempCard;
  };

  window.createPicture = createCard;
})();
