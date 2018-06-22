'use strict';

(function () {
  var MAX_HASHTAG_LENGTH = 20;
  var MIN_HASHTAG_LENGTH = 4;
  var HASHTAGS_QUANTITY = 5;
  var ESC_KEYCODE = 27;
  var uploadFile = document.querySelector('#upload-file');
  var editImageForm = document.querySelector('.img-upload__overlay');
  var editImageFormClose = document.querySelector('#upload-cancel');
  var descriptionField = document.querySelector('.text__description');
  var hashtagsField = document.querySelector('.text__hashtags');

  // =========== Открытие окна при загрузке фото и ограничения полей ==================
  // Закрывает попап при нажатии на ESC (если ни одно из текстовых полей не активно)
  var onPopupEscPress = function (evt) {
    var isFieldActive = document.activeElement === hashtagsField || document.activeElement === descriptionField;
    if (evt.keyCode === ESC_KEYCODE && !isFieldActive) {
      closeEditImageForm();
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  // Открывает попап и вешает на документ обработчик нажатия ESC
  var openEditImageForm = function () {
    editImageForm.classList.remove('hidden');
  };

  // Закрывает попап, удаляет значение поля выбора файла и обработчик нажатия ESC
  var closeEditImageForm = function () {
    editImageForm.classList.add('hidden');
    uploadFile.value = '';
  };

  // При загрузке файла открывается форма для его редактирования
  uploadFile.addEventListener('change', function () {
    openEditImageForm();
    document.addEventListener('keydown', onPopupEscPress);
  });

  // Закрывает попап при нажатии на крестик
  editImageFormClose.addEventListener('click', function () {
    closeEditImageForm();
    document.removeEventListener('keydown', onPopupEscPress);
  });

  // ======================= Правила ввода хештегов ======================

  // Получаем массив из хештегов
  var getHashtags = function (valueHashtagsField) {
    return valueHashtagsField.split(' ');
  };

  // Проверяет количество хештегов
  var checkQuantity = function (hashtags) {
    return hashtags.length < HASHTAGS_QUANTITY;
  };

  // Проверяет длину одного хештега
  var checkLength = function (hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag.length <= MAX_HASHTAG_LENGTH;
    });
  };

  // Проверяет правильность написания хештегов
  var checkHashtagsNames = function (hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag[0] === '#' && hashtag.length >= MIN_HASHTAG_LENGTH;
    });
  };

  // Проверяет, что бы решетка была только в начале хештега
  var checkHashInName = function (hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag.indexOf('#') === hashtag.lastIndexOf('#');
    });
  };

  // Проветяет наличие повторяющихся хештегов
  var checkRepeating = function (hashtags) {
    var tempHashtags = hashtags.map(function (hashtag) {
      return hashtag.toLowerCase();
    });
    return !tempHashtags.some(function (hashtag) {
      return tempHashtags.indexOf(hashtag) !== tempHashtags.lastIndexOf(hashtag);
    });
  };

  // Проверяет правильность написания и добавляет соответствующий текст ошибки.
  var onInputChange = function () {
    var hashtags = getHashtags(hashtagsField.value);
    if (!checkHashtagsNames(hashtags)) {
      hashtagsField.setCustomValidity('Хештег должен начинаться с "#" и содержать не менее ' + (MIN_HASHTAG_LENGTH - 1) + ' символов');
    } else if (!checkQuantity(hashtags)) {
      hashtagsField.setCustomValidity('Максимальное количество тегов: ' + HASHTAGS_QUANTITY);
    } else if (!checkLength(hashtags)) {
      hashtagsField.setCustomValidity('Максимальная длинна тега (включая сомвол "#"): ' + MAX_HASHTAG_LENGTH);
    } else if (!checkHashInName(hashtags)) {
      hashtagsField.setCustomValidity('Хештеги должны разделяться пробелами');
    } else if (!checkRepeating(hashtags)) {
      hashtagsField.setCustomValidity('Хештеги не должны повторяться');
    } else {
      hashtagsField.setCustomValidity('');
    }
  };

  hashtagsField.addEventListener('input', onInputChange);
})();
