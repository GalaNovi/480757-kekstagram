'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var bigPicture = document.querySelector('.big-picture');
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

  // ===================== Создаем фрагмент с комментариями =======================

  var createBigCard = function (object) {
    var fragmentComments = document.createDocumentFragment();
    for (var i = 0; i < object.comments.length; i++) {
      var commentExample = bigPicture.querySelector('.social__comment').cloneNode(true);
      commentExample.classList.add('social__comment--text');
      commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg');
      commentExample.querySelector('.social__text').textContent = object.comments[i];
      fragmentComments.appendChild(commentExample);
    }
    return fragmentComments;
  };

  window.preview = {
    create: createBigCard
  };
})();
