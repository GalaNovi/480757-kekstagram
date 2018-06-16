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
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTIONS = [
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
var getrandomNumber = function (min, max) {
  var number = 0;
  number = Math.floor(Math.random() * (max + 1 - min) + min);
  return number;
};

// Перетасовываем массив
var getShuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = getrandomNumber(0, i);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Получаем массив с созданными объектами
var getPhotoInfoArray = function (urlsArray, commentsArray, descriptionsArray) {
  var photoInfoTemp = [];
  urlsArray = getShuffleArray(urlsArray);
  commentsArray = getShuffleArray(commentsArray);
  for (var i = 0; i < urlsArray.length; i++) {
    var urlTemp = 'photos/' + urlsArray[i] + '.jpg';
    var likesTemp = getrandomNumber(MIN_LIKES, MAX_LIKES);
    var commentsTemp = [];
    // Рандомим количество комментов
    for (var j = 0; j < getrandomNumber(MIN_QUANTITY_COMMENTS, MAX_QUANTITY_COMMENTS); j++) {
      commentsTemp[j] = commentsArray[j];
    }
    var descriptionTemp = descriptionsArray[getrandomNumber(0, descriptionsArray.length - 1)];
    photoInfoTemp[i] =
      {
        url: urlTemp,
        likes: likesTemp,
        comments: commentsTemp,
        description: descriptionTemp
      };
  }
  return photoInfoTemp;
};
// Создаем переменную с полученным массивом
var photosInfo = getPhotoInfoArray(urls, COMMENTS, DESCRIPTIONS);

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
for (var i = 0; i < photosInfo.length; i++) {
  fragment.appendChild(createCard(photosInfo[i]));
}

// Вставляем фрагмент в DOM
picturesContainer.appendChild(fragment);

// Создаем фрагмент с комментариями
var renderComments = function (array) {
  var fragmentComments = document.createDocumentFragment();
  for (var j = 0; j < array.comments.length; j++) {
    var commentExample = bigPicture.querySelector('.social__comment').cloneNode(true);
    commentExample.classList.add('social__comment--text');
    commentExample.querySelector('.social__picture').setAttribute('src', 'img/avatar-' + getrandomNumber(1, 6) + '.svg');
    commentExample.querySelector('.social__text').textContent = array.comments[j];
    fragmentComments.appendChild(commentExample);
  }
  return fragmentComments;
};
// вносим изменения в большую карточку
var createBigCard = function (array) {
  bigPicture.querySelector('.big-picture__img').querySelector('img').setAttribute('src', array.url);
  bigPicture.querySelector('.likes-count').textContent = array.likes;
  bigPicture.querySelector('.comments-count').textContent = array.comments.length;
  // Определяем количество комментариев по уммолчанию
  var oldComments = bigPicture.querySelectorAll('.social__comment').length;
  bigPicture.querySelector('.social__comments').appendChild(renderComments(array));
  // Удаляем старые комментарии
  for (var j = 0; j < oldComments; j++) {
    bigPicture.querySelector('.social__comments').removeChild(bigPicture.querySelector('.social__comment'));
  }
  bigPicture.querySelector('.social__caption').textContent = array.description;
};

createBigCard(photosInfo[0]);
commentsCount.classList.add('visually-hidden');
commentLoad.classList.add('visually-hidden');

// ================== Открытие окна при загрузке фото ==============================

// Закрывает попап при нажатии на ESC
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeEditImageForm();
  }
};

// Открывает попап и вешает на документ обработчик нажатия ESC
var openEditImageForm = function () {
  editImageForm.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

// Закрывает попап, удаляет значение поля выбора файла и обработчик нажатия ESC
var closeEditImageForm = function () {
  editImageForm.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
};

// При загрузке файла открывается форма для его редактирования
uploadFile.addEventListener('change', function () {
  openEditImageForm();
});

// Закрывает попап при нажатии на крестик
editImageFormClose.addEventListener('click', function () {
  closeEditImageForm();
});

// Закрывает попап при нажатии ENTER на крестике
editImageFormClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeEditImageForm();
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

// Оставляет только цифры в строке
var getNumberfromString = function (string) {
  var symbols = string.split('');
  for (var j = 0; j < symbols.length; j++) {
    if (isNaN(Number(symbols[j]))) {
      symbols[j] = '';
    }
  }
  string = symbols.join('');
  return string;
};

// Определяет уровень применения фильтра
var getlevelFilter = function () {
  scaleValue.value = getNumberfromString(scalePin.style.left);
  var filtersStyles = {
    chrome: 'grayscale(' + 1 / 100 * scaleValue.value + ')',
    sepia: 'sepia(' + 1 / 100 * scaleValue.value + ')',
    marvin: 'invert(' + scaleValue.value + '%)',
    phobos: 'blur(' + 3 / 100 * scaleValue.value + 'px)',
    heat: 'brightness(' + ((2 / 100 * scaleValue.value) + 1) + ')'
  };
  var currentFilter = editImageForm.querySelector('input[type="radio"]:checked').value;
  imagePreview.style.filter = filtersStyles[currentFilter];
  scaleLevel.style.width = scalePin.style.left;
};

// При переключении фильтра применяет его к превью фотографии
editImageForm.addEventListener('change', function (evt) {
  if (evt.target.classList.contains('effects__radio')) {
    if (evt.target.value === 'none') {
      imagePreview.classList = defaultClassesImagePreview;
      imagePreview.style.filter = 'none';
    } else {
      scalePin.style.left = SCALE_PIN_VALUE_DEFAULT;
      getlevelFilter();
      imagePreview.classList = defaultClassesImagePreview;
      imagePreview.classList.add('effects__preview--' + evt.target.value);
    }
  }
});

// Изменяет уровень применения фильтра при отпускании мыши
scalePin.addEventListener('mouseup', function () {
  getlevelFilter();
});

// Применяем дефолтный фильтр при открытии страницы, ставим пин на
// дефолтное значение и применяем соответствующий уровень фильтра
imagePreview.classList.add('effects__preview--' + defaultFilter);
scalePin.style.left = SCALE_PIN_VALUE_DEFAULT;
getlevelFilter();

// Закрывает просмотр фотографии при нажатии на ESC
var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
  }
};

// Открывает просмотр фотографии и вешает на документ обработчик нажатия ESC
var openBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureEscPress);
};

// Закрывает просмотр фотографии, удаляет значение поля выбора файла и обработчик нажатия ESC
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

// Закрывает просмотр фотографии при нажатии на крестик
bigPictureClose.addEventListener('click', function () {
  closeBigPicture();
});

// Закрывает просмотр фотографии при нажатии ENTER на крестике
bigPictureClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeBigPicture();
  }
});

// Открывает просмотр фотографии при клике на фото
document.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('picture__img')) {
    openBigPicture();
  }
});

// ===================== Поля формы ========================

var descriptionField = document.querySelector('.text__description');
var hashtagsField = document.querySelector('.text__hashtags');

descriptionField.addEventListener('focus', function () {
  document.removeEventListener('keydown', onPopupEscPress);
});

descriptionField.addEventListener('blur', function () {
  document.addEventListener('keydown', onPopupEscPress);
});

hashtagsField.addEventListener('focus', function () {
  document.removeEventListener('keydown', onPopupEscPress);
});

hashtagsField.addEventListener('blur', function () {
  document.addEventListener('keydown', onPopupEscPress);
});
