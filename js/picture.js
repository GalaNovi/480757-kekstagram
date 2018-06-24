'use strict';

(function () {
  var template = document.querySelector('#picture').content;

  // Собираем информацию одной карточки
  var createOneCard = function (cardsInfo) {
    var tempCard = template.cloneNode(true);
    tempCard.querySelector('.picture__img').setAttribute('src', cardsInfo.url);
    tempCard.querySelector('.picture__stat--likes').textContent = cardsInfo.likes;
    tempCard.querySelector('.picture__stat--comments').textContent = cardsInfo.comments.length;
    return tempCard;
  };

  // Вставляем в фрагмент все карточки
  var createCards = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = createOneCard(data[i]);
      fragment.appendChild(card);
    }
    return fragment;
  };

  window.picture = createCards;
})();
