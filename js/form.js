'use strict';

(function () {
  var MAX_HASHTAG_LENGTH = 20;
  var MIN_HASHTAG_LENGTH = 4;
  var HASHTAGS_QUANTITY = 5;
  var ESC_KEYCODE = 27;
  var uploadFileElement = document.querySelector('#upload-file');
  var editImageElement = document.querySelector('.img-upload__overlay');
  var editImageCloseElement = document.querySelector('#upload-cancel');
  var descriptionFieldElement = document.querySelector('.text__description');
  var hashtagsFieldElement = document.querySelector('.text__hashtags');
  var form = document.querySelector('.img-upload__form');
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileChooser = document.querySelector('.img-upload__input');
  var preview = document.querySelector('.img-upload__preview-image');

  // Открывает попап и вешает на документ обработчик нажатия ESC
  var openEditImageElement = function () {
    editImageElement.classList.remove('hidden');
    editImageCloseElement.addEventListener('click', onCrossClick);
  };

  // Закрывает попап, удаляет значение поля выбора файла и обработчик нажатия ESC
  var closeEditImageElement = function () {
    editImageElement.classList.add('hidden');
    uploadFileElement.value = '';
    editImageCloseElement.removeEventListener('click', onCrossClick);
    form.reset();
    window.resetEffects();
  };

  // Получаем массив из хештегов, удаляет лишние пробелы
  var getHashtags = function (hashtagsFieldElementValue) {
    var hashtags = hashtagsFieldElementValue.split(' ');
    return hashtags.filter(function (hashtag) {
      return hashtag !== '';
    });
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

  // Закрывает попап при нажатии на ESC (если ни одно из текстовых полей не активно)
  var onPopupEscPress = function (evt) {
    var isFieldActive = document.activeElement === hashtagsFieldElement || document.activeElement === descriptionFieldElement;
    if (evt.keyCode === ESC_KEYCODE && !isFieldActive) {
      closeEditImageElement();
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  // Закрывает попап при нажатии на крестик
  var onCrossClick = function () {
    closeEditImageElement();
  };

  // Проверяет правильность написания и добавляет соответствующий текст ошибки.
  var onInputChange = function () {
    var hashtags = getHashtags(hashtagsFieldElement.value);
    if (!checkHashtagsNames(hashtags)) {
      hashtagsFieldElement.setCustomValidity('Хештег должен начинаться с "#" и содержать не менее ' + (MIN_HASHTAG_LENGTH - 1) + ' символов');
    } else if (!checkQuantity(hashtags)) {
      hashtagsFieldElement.setCustomValidity('Максимальное количество тегов: ' + HASHTAGS_QUANTITY);
    } else if (!checkLength(hashtags)) {
      hashtagsFieldElement.setCustomValidity('Максимальная длинна тега (включая сомвол "#"): ' + MAX_HASHTAG_LENGTH);
    } else if (!checkHashInName(hashtags)) {
      hashtagsFieldElement.setCustomValidity('Хештеги должны разделяться пробелами');
    } else if (!checkRepeating(hashtags)) {
      hashtagsFieldElement.setCustomValidity('Хештеги не должны повторяться');
    } else {
      hashtagsFieldElement.setCustomValidity('');
    }
  };

  // Функция успешной отправки сообщения
  var onSuccessLoad = function () {
    closeEditImageElement();
    window.message.text('Информация успешно отправлена!');
  };

  var onErrorLoad = function (errorText) {
    window.message.showError(errorText);
  };

  // Обработчик загрузки файла
  uploadFileElement.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });
      reader.readAsDataURL(file);
      openEditImageElement();
      document.addEventListener('keydown', onPopupEscPress);
    } else {
      window.message.showError('Файл не является изображением');
    }
  });

  // Обработчик правильности написания хештегов
  hashtagsFieldElement.addEventListener('input', onInputChange);

  // Обработчик при отправке формы
  form.addEventListener('submit', function (evt) {
    window.backend.sendData(new FormData(form), onSuccessLoad, onErrorLoad);
    evt.preventDefault();
  });
})();
