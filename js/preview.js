'use strict';

(function () {
  var SHOW_COMMENTS_QUANTITY = 5;
  var LOAD_COMMENTS_QUANTITY = 5;
  var ESC_KEYCODE = 27;
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');
  var commentsListElement = bigPictureElement.querySelector('.social__comments');
  var shownCommentsCount = bigPictureElement.querySelector('.comments-shown-count');
  var loadCommentsButton = bigPictureElement.querySelector('.social__loadmore');
  var commentsData = null;
  var shownComments = [];

  // Открывает просмотр фотографии и вешает на документ обработчик нажатия ESC
  var openBigPictureElement = function () {
    bigPictureElement.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureElementEscPress);
    bigPictureCloseElement.addEventListener('click', onCrossClick);
  };

  // Закрывает просмотр фотографии, удаляет значение поля выбора файла и обработчик нажатия ESC
  var closeBigPictureElement = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureElementEscPress);
    bigPictureCloseElement.removeEventListener('click', onCrossClick);
    commentsData = null;
    shownComments = [];
  };

  //  Создает фрагмент с комментариями
  var createComments = function (object) {
    commentsData = object.comments;
    var fragmentComments = document.createDocumentFragment();
    var numberComments = commentsData.length <= SHOW_COMMENTS_QUANTITY ? commentsData.length : SHOW_COMMENTS_QUANTITY;
    for (var i = 0; i < numberComments; i++) {
      var commentExample = document.querySelector('#comment').content.cloneNode(true).querySelector('li');
      commentExample.classList.add('social__comment--text');
      commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg');
      commentExample.querySelector('.social__text').textContent = object.comments[i];
      fragmentComments.appendChild(commentExample);
      shownComments.push(commentExample);
    }
    return fragmentComments;
  };

  // Вносим изменения в большую карточку
  var changeBigCard = function (object) {
    bigPictureElement.querySelector('.big-picture__img').querySelector('img').setAttribute('src', object.url);
    bigPictureElement.querySelector('.likes-count').textContent = object.likes;
    bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;
    commentsListElement.innerHTML = '';
    commentsListElement.appendChild(createComments(object));
    bigPictureElement.querySelector('.social__caption').textContent = object.description || '';
  };

  // Если показаны все комментарии - прячет кнопку, если нет - показывает
  var showHideLoadCommentsButton = function () {
    if (commentsData.length - shownComments.length) {
      loadCommentsButton.classList.remove('hidden');
    } else {
      loadCommentsButton.classList.add('hidden');
    }
  };

  // Обновляет счетчик комметариев
  var updateCommentsCount = function () {
    shownCommentsCount.textContent = shownComments.length;
  };

  // Закрывает просмотр фотографии при нажатии на ESC
  var onBigPictureElementEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPictureElement();
    }
  };

  // Закрывает просмотр фотографии при нажатии на крестик
  var onCrossClick = function () {
    closeBigPictureElement();
  };

  // Добавляет порцию комментариев
  var onLoadCommentsButtonClick = function () {
    var notShownComments = commentsData.length - shownComments.length;
    if (notShownComments > 0) {
      var fragmentComments = document.createDocumentFragment();
      var numberComments = notShownComments <= LOAD_COMMENTS_QUANTITY ? notShownComments : LOAD_COMMENTS_QUANTITY;
      var tempComments = [];
      for (var i = 0; i < numberComments; i++) {
        var commentExample = document.querySelector('#comment').content.cloneNode(true).querySelector('li');
        commentExample.classList.add('social__comment--text');
        commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg');
        commentExample.querySelector('.social__text').textContent = commentsData[i + shownComments.length];
        fragmentComments.appendChild(commentExample);
        tempComments.push(commentExample);
      }
      commentsListElement.appendChild(fragmentComments);
      shownComments = shownComments.concat(tempComments);
    }
    updateCommentsCount();
    showHideLoadCommentsButton();
  };

  // Вешаем обработчик на кнопку
  loadCommentsButton.addEventListener('click', onLoadCommentsButtonClick);

  // Заполняет превью данными и показывает его
  window.showPreview = function (object) {
    changeBigCard(object);
    updateCommentsCount();
    showHideLoadCommentsButton();
    openBigPictureElement();
  };
})();
