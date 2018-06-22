'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var bigPicture = document.querySelector('.big-picture');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var commentLoad = bigPicture.querySelector('.social__loadmore');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

  // =========== Открытие и закрытие окна просмотра большой фотографии =============

  // Закрывает просмотр фотографии при нажатии на ESC
  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  // Открывает просмотр фотографии и вешает на документ обработчик нажатия ESC
  var openBigPicture = function () {
    bigPicture.classList.remove('hidden');
  };

  // Закрывает просмотр фотографии, удаляет значение поля выбора файла и обработчик нажатия ESC
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
  };

  // Закрывает просмотр фотографии при нажатии на крестик
  bigPictureClose.addEventListener('click', function () {
    closeBigPicture();
    document.removeEventListener('keydown', onBigPictureEscPress);
  });

  // Открывает просмотр фотографии при клике на фото
  document.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      openBigPicture();
      document.addEventListener('keydown', onBigPictureEscPress);
    }
  });

  // Создаем фрагмент с комментариями
  var renderСomments = function (object) {
    var fragmentcomments = document.createDocumentFragment();
    for (var j = 0; j < object.comments.length; j++) {
      var commentExample = bigPicture.querySelector('.social__comment').cloneNode(true);
      commentExample.classList.add('social__comment--text');
      commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg');
      commentExample.querySelector('.social__text').textContent = object.comments[j];
      fragmentcomments.appendChild(commentExample);
    }
    return fragmentcomments;
  };

  // вносим изменения в большую карточку
  var createBigCard = function (object) {
    bigPicture.querySelector('.big-picture__img').querySelector('img').setAttribute('src', object.url);
    bigPicture.querySelector('.likes-count').textContent = object.likes;
    bigPicture.querySelector('.comments-count').textContent = object.comments.length;
    // Определяем количество комментариев по уммолчанию
    var oldcomments = bigPicture.querySelectorAll('.social__comment').length;
    bigPicture.querySelector('.social__comments').appendChild(renderСomments(object));
    // Удаляем старые комментарии
    for (var j = 0; j < oldcomments; j++) {
      bigPicture.querySelector('.social__comments').removeChild(bigPicture.querySelector('.social__comment'));
    }
    bigPicture.querySelector('.social__caption').textContent = object.description;
  };

  createBigCard(window.data.photoParameters[0]);
  commentsCount.classList.add('visually-hidden');
  commentLoad.classList.add('visually-hidden');
})();
