'use strict';

var template = document.querySelector('#picture').content;
var picturesContainer = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var commentsCount = bigPicture.querySelector('.social__comment-count');
var commentLoad = bigPicture.querySelector('.social__loadmore');
var uploadFile = document.querySelector('#upload-file');
var editImageForm = document.querySelector('.img-upload__overlay');
var editImageFormClose = document.querySelector('#upload-cancel');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var QUANTITY_URLS = 25;
var MIN_QUANTITY_COMMENTS = 1;
var MAX_QUANTITY_COMMENTS = 2;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

// Получаем массив из чисел для интеграции в ссылки
var getNumbersArray = function (length) {
  var numbers = [];
  for (var i = 0; i < length; i++) {
    numbers[i] = i + 1;
  }
  return numbers;
};
// Создаем переменную с полученным массивом
var urls = getNumbersArray(QUANTITY_URLS);

// Получаем рандомное число в нужном диапазоне
var getRandomNumber = function (min, max) {
  var number = 0;
  number = Math.floor(Math.random() * (max + 1 - min) + min);
  return number;
};

// Перетасовываем массив
var getShuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = getRandomNumber(0, i);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Получаем массив с созданными объектами
var getPhotoInfoArray = function (urlsArray, commentsArray, descriptionsArray) {
  var photoParametersTemp = [];
  urlsArray = getShuffleArray(urlsArray);
  commentsArray = getShuffleArray(commentsArray);
  for (var i = 0; i < urlsArray.length; i++) {
    var urlTemp = 'photos/' + urlsArray[i] + '.jpg';
    var likesTemp = getRandomNumber(MIN_LIKES, MAX_LIKES);
    var commentsTemp = [];
    // Рандомим количество комментов
    for (var j = 0; j < getRandomNumber(MIN_QUANTITY_COMMENTS, MAX_QUANTITY_COMMENTS); j++) {
      commentsTemp[j] = commentsArray[j];
    }
    var descriptionTemp = descriptionsArray[getRandomNumber(0, descriptionsArray.length - 1)];
    photoParametersTemp[i] =
      {
        url: urlTemp,
        likes: likesTemp,
        comments: commentsTemp,
        description: descriptionTemp
      };
  }
  return photoParametersTemp;
};
// Создаем переменную с полученным массивом
var photoParameters = getPhotoInfoArray(urls, comments, descriptions);

// Собираем информацию одной карточки
var createCard = function (cardsInfo) {
  var tempCard = template.cloneNode(true);
  tempCard.querySelector('.picture__img').setAttribute('src', cardsInfo.url);
  tempCard.querySelector('.picture__stat--likes').textContent = cardsInfo.likes;
  tempCard.querySelector('.picture__stat--comments').textContent = cardsInfo.comments.length;
  return tempCard;
};

// Создаем фрагмент для последующей встави в DOM
var fragment = document.createDocumentFragment();

// Вставляем в фрагмент все карточки
var insetCards = function () {
  for (var i = 0; i < photoParameters.length; i++) {
    fragment.appendChild(createCard(photoParameters[i]));
  }
};
insetCards();

// Вставляем фрагмент в DOM
picturesContainer.appendChild(fragment);

// Создаем фрагмент с комментариями
var renderСomments = function (object) {
  var fragmentcomments = document.createDocumentFragment();
  for (var j = 0; j < object.comments.length; j++) {
    var commentExample = bigPicture.querySelector('.social__comment').cloneNode(true);
    commentExample.classList.add('social__comment--text');
    commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + getRandomNumber(1, 6) + '.svg');
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

createBigCard(photoParameters[0]);
commentsCount.classList.add('visually-hidden');
commentLoad.classList.add('visually-hidden');

// =========== Открытие окна при загрузке фото и ограничения полей ==================

var descriptionField = document.querySelector('.text__description');
var hashtagsField = document.querySelector('.text__hashtags');
var MAX_HASHTAG_LENGTH = 20;
var MIN_HASHTAG_LENGTH = 4;
var HASHTAGS_QUANTITY = 5;

// Закрывает попап при нажатии на ESC
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
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

// Убирает обработчик нажатия ESC, когда поле в фокусе
descriptionField.addEventListener('focus', function () {
  document.removeEventListener('keydown', onPopupEscPress);
});

// Вешает на документ обработчик нажатия ESC, когда поле теряет фокус
descriptionField.addEventListener('blur', function () {
  document.addEventListener('keydown', onPopupEscPress);
});

// Убирает обработчик нажатия ESC, когда поле в фокусе
hashtagsField.addEventListener('focus', function () {
  document.removeEventListener('keydown', onPopupEscPress);
});

// Вешает на документ обработчик нажатия ESC, когда поле теряет фокус
hashtagsField.addEventListener('blur', function () {
  document.addEventListener('keydown', onPopupEscPress);
});

// Получаем массив из хештегов
var getHashtags = function (valueHashtagsField) {
  var hashtags = valueHashtagsField.split(' ');
  return hashtags;
};

// Проверяет количество хештегов
var checkQuantity = function (hashtags) {
  if (hashtags.length > HASHTAGS_QUANTITY) {
    return false;
  }
  return true;
};

// Проверяет длину одного хештега
var checkLength = function (hashtags) {
  for (var j = 0; j < hashtags.length; j++) {
    if (hashtags[j].length > MAX_HASHTAG_LENGTH) {
      return false;
    }
  }
  return true;
};

// Проверяет правильность написания хештегов
var checkHashtagsNames = function (hashtags) {
  for (var j = 0; j < hashtags.length; j++) {
    var hashtagSymbols = hashtags[j].split('');
    if (hashtagSymbols[0] !== '#' || hashtagSymbols.length < MIN_HASHTAG_LENGTH) {
      return false;
    }
  }
  return true;
};

// Проверяет, что бы решетка была только в начале хештега
var checkHashInName = function (hashtags) {
  for (var j = 0; j < hashtags.length; j++) {
    var hashtagSymbols = hashtags[j].split('');
    for (var n = 1; n < hashtagSymbols.length; n++) {
      if (hashtagSymbols[n] === '#') {
        return false;
      }
    }
  }
  return true;
};

// Проветяет наличие повторяющихся хештегов
var checkRepeating = function (hashtags) {
  for (var j = 0; j < hashtags.length - 1; j++) {
    for (var n = j + 1; n < hashtags.length; n++) {
      if (hashtags[j].toLowerCase() === hashtags[n].toLowerCase()) {
        return false;
      }
    }
  }
  return true;
};


hashtagsField.addEventListener('input', function (evt) {
  var field = evt.target;
  var hashtags = getHashtags(field.value);
  if (!checkHashtagsNames(hashtags)) {
    field.setCustomValidity('Хештег должен начинаться с "#" и содержать не менее ' + (MIN_HASHTAG_LENGTH - 1) + ' символов');
  } else if (!checkQuantity(hashtags)) {
    field.setCustomValidity('Максимальное количество тегов: ' + HASHTAGS_QUANTITY);
  } else if (!checkLength(hashtags)) {
    field.setCustomValidity('Максимальная длинна тега (включая сомвол "#"): ' + MAX_HASHTAG_LENGTH);
  } else if (!checkHashInName(hashtags)) {
    field.setCustomValidity('Хештеги должны разделяться пробелами');
  } else if (!checkRepeating(hashtags)) {
    field.setCustomValidity('Хештеги не должны повторяться');
  } else {
    field.setCustomValidity('');
  }
});

// ======================= Применение фильтров ============================

var imagePreview = editImageForm.querySelector('.img-upload__preview');
var defaultClassesImagePreview = imagePreview.classList.value;
var scalePin = editImageForm.querySelector('.scale__pin');
var scaleLevel = editImageForm.querySelector('.scale__level');
var scaleValue = editImageForm.querySelector('.scale__value');
var defaultFilter = editImageForm.querySelector('input[type="radio"]:checked').value;
var SCALE_PIN_VALUE_DEFAULT = '100%';

// Определяет уровень применения фильтра
var getLevelsFilters = function () {
  scaleValue.value = parseInt(scalePin.style.left, 10);
  var levelsFilters = {
    chrome: 'grayscale(' + 1 / 100 * scaleValue.value + ')',
    sepia: 'sepia(' + 1 / 100 * scaleValue.value + ')',
    marvin: 'invert(' + scaleValue.value + '%)',
    phobos: 'blur(' + 3 / 100 * scaleValue.value + 'px)',
    heat: 'brightness(' + ((2 / 100 * scaleValue.value) + 1) + ')'
  };

  return levelsFilters;
};

var changeScaleValue = function () {
  scaleLevel.style.width = scalePin.style.left;
};

// Применяет выбранный фильтр
var applyFilter = function (levelsFilters) {
  var currentFilter = editImageForm.querySelector('input[type="radio"]:checked').value;
  imagePreview.style.filter = levelsFilters[currentFilter];
};

// При переключении фильтра применяет его к превью фотографии
editImageForm.addEventListener('change', function (evt) {
  if (evt.target.classList.contains('effects__radio')) {
    if (evt.target.value === 'none') {
      imagePreview.classList = defaultClassesImagePreview;
      imagePreview.style.filter = 'none';
    } else {
      scalePin.style.left = SCALE_PIN_VALUE_DEFAULT;
      changeScaleValue();
      applyFilter(getLevelsFilters());
      imagePreview.classList = defaultClassesImagePreview;
      imagePreview.classList.add('effects__preview--' + evt.target.value);
    }
  }
});

// Применяет фильтр при отпускании мыши
scalePin.addEventListener('mouseup', function () {
  changeScaleValue();
  applyFilter(getLevelsFilters());
});

// Применяем дефолтный фильтр при открытии страницы, ставим пин на
// дефолтное значение и применяем соответствующий уровень фильтра
imagePreview.classList.add('effects__preview--' + defaultFilter);
scalePin.style.left = SCALE_PIN_VALUE_DEFAULT;
changeScaleValue();
applyFilter(getLevelsFilters());

// ================== Окно просмотра большой фотографии =============

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
