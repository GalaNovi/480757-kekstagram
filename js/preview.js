'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');

  // Открывает просмотр фотографии и вешает на документ обработчик нажатия ESC
  var openbigPictureElement = function () {
    bigPictureElement.classList.remove('hidden');
  };

  // Закрывает просмотр фотографии, удаляет значение поля выбора файла и обработчик нажатия ESC
  var closebigPictureElement = function () {
    bigPictureElement.classList.add('hidden');
  };

  //  Создает фрагмент с комментариями
  var createComments = function (object) {
    var fragmentComments = document.createDocumentFragment();
    for (var i = 0; i < object.comments.length; i++) {
      var commentExample = bigPictureElement.querySelector('.social__comment').cloneNode(true);
      commentExample.classList.add('social__comment--text');
      commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg');
      commentExample.querySelector('.social__text').textContent = object.comments[i];
      fragmentComments.appendChild(commentExample);
    }
    return fragmentComments;
  };

  // Вносим изменения в большую карточку
  var changeBigCard = function (object) {
    bigPictureElement.querySelector('.big-picture__img').querySelector('img').setAttribute('src', object.url);
    bigPictureElement.querySelector('.likes-count').textContent = object.likes;
    bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;
    // Определяем количество комментариев по уммолчанию
    var oldСomments = bigPictureElement.querySelectorAll('.social__comment').length;
    bigPictureElement.querySelector('.social__comments').appendChild(createComments(object));
    // Удаляем старые комментарии
    for (var i = 0; i < oldСomments; i++) {
      bigPictureElement.querySelector('.social__comments').removeChild(bigPictureElement.querySelector('.social__comment'));
    }
    bigPictureElement.querySelector('.social__caption').textContent = object.description;
  };

  // Закрывает просмотр фотографии при нажатии на ESC
  var onbigPictureElementEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closebigPictureElement();
    }
  };

  // Закрывает просмотр фотографии при нажатии на крестик
  bigPictureCloseElement.addEventListener('click', function () {
    closebigPictureElement();
    document.removeEventListener('keydown', onbigPictureElementEscPress);
  });

  // Открывает просмотр фотографии при клике на фото
  document.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      openbigPictureElement();
      document.addEventListener('keydown', onbigPictureElementEscPress);
    }
  });

  window.preview = changeBigCard;
})();
