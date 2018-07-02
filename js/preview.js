'use strict';

(function () {
  var SHOW_COMMENTS_QUANTITY = 5;
  var LOAD_COMMENTS_QUANTITY = 5;
  var ESC_KEYCODE = 27;
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');
  var commentsShow = bigPictureElement.querySelector('.comments-show');
  var loadCommentsButton = bigPictureElement.querySelector('.social__loadmore');

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
    // Определяем количество предыдущих комментариев
    var oldСomments = bigPictureElement.querySelectorAll('.social__comment').length;
    bigPictureElement.querySelector('.social__comments').appendChild(createComments(object));
    // Удаляем предыдущие комментарии
    for (var i = 0; i < oldСomments; i++) {
      bigPictureElement.querySelector('.social__comments').removeChild(bigPictureElement.querySelector('.social__comment'));
    }
    bigPictureElement.querySelector('.social__caption').textContent = object.description;
  };

  // Определяет сколько комментов показано и выводит это число на странице
  var updateCommentsShowCount = function () {
    var comments = document.querySelectorAll('.social__comment');
    var showCommentsCount = 0;
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].style.display === '') {
        showCommentsCount += 1;
      }
    }
    commentsShow.textContent = showCommentsCount;
  };

  // Прячет лишние комментарии
  var hideComments = function () {
    var commentsElements = bigPictureElement.querySelectorAll('.social__comment');
    if (commentsElements.length > SHOW_COMMENTS_QUANTITY) {
      for (var i = SHOW_COMMENTS_QUANTITY; i < commentsElements.length; i++) {
        commentsElements[i].style.display = 'none';
      }
    }
  };

  // Прячет кнопку загрузки комментарием, если их меньше показываемого количества
  var hideLoadCommentsButton = function () {
    var commentsElements = bigPictureElement.querySelectorAll('.social__comment');
    if (commentsElements.length <= SHOW_COMMENTS_QUANTITY) {
      loadCommentsButton.classList.add('hidden');
    }
  };

  // Показывает следующие комментарии и обновляет их счет
  var showNextComments = function () {
    var commentsElements = Array.from(bigPictureElement.querySelectorAll('.social__comment'));
    var hiddenComments = commentsElements.filter(function (comment) {
      return comment.style.display === 'none';
    });
    for (var i = 0; i < LOAD_COMMENTS_QUANTITY && i < hiddenComments.length; i++) {
      hiddenComments[i].style.display = '';
    }
    updateCommentsShowCount();
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

  // Обработчик для кнопки показа комментариев
  loadCommentsButton.addEventListener('click', function () {
    showNextComments();
  });

  window.showPreview = function (object) {
    changeBigCard(object);
    hideLoadCommentsButton();
    hideComments();
    updateCommentsShowCount();
    openBigPictureElement();
  };
})();
