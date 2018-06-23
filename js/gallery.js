'use strict';

(function () {
  // ===================== Миниатюры ========================

  var picturesContainer = document.querySelector('.pictures');

  // Вставляем в фрагмент все карточки
  var createCards = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = window.picture.create(data[i]);
      fragment.appendChild(card);
    }
    return fragment;
  };

  var insertCards = function (cards) {
    picturesContainer.appendChild(cards);
  };

  var cards = createCards(window.data.photoParameters);
  insertCards(cards);

  // ====================== Превьюшка ========================

  var bigPicture = document.querySelector('.big-picture');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var commentLoad = bigPicture.querySelector('.social__loadmore');

  // Вносим изменения в большую карточку
  var changeBigCard = function (object) {
    bigPicture.querySelector('.big-picture__img').querySelector('img').setAttribute('src', object.url);
    bigPicture.querySelector('.likes-count').textContent = object.likes;
    bigPicture.querySelector('.comments-count').textContent = object.comments.length;
    // Определяем количество комментариев по уммолчанию
    var oldСomments = bigPicture.querySelectorAll('.social__comment').length;
    bigPicture.querySelector('.social__comments').appendChild(window.preview.create(object));
    // Удаляем старые комментарии
    for (var i = 0; i < oldСomments; i++) {
      bigPicture.querySelector('.social__comments').removeChild(bigPicture.querySelector('.social__comment'));
    }
    bigPicture.querySelector('.social__caption').textContent = object.description;
  };

  // Создаем массив из миниатюр
  var linksPictures = document.querySelectorAll('.picture__img');

  // Навешивает обработчик клика на миниатюру
  var addClickListener = function (linkPicture, index) {
    linkPicture.addEventListener('click', function () {
      changeBigCard(window.data.photoParameters[index]);
    });
  };

  var addListenersForPictures = function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      var picture = pictures[i];
      addClickListener(picture, i);
    }
  };

  addListenersForPictures(linksPictures);
  commentsCount.classList.add('hidden');
  commentLoad.classList.add('hidden');
})();
