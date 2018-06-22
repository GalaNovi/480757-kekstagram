'use strict';

var ESC_KEYCODE = 27;
var bigPicture = document.querySelector('.big-picture');
var commentsCount = bigPicture.querySelector('.social__comment-count');
var commentLoad = bigPicture.querySelector('.social__loadmore');

var editImageForm = document.querySelector('.img-upload__overlay');

var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
var template = document.querySelector('#picture').content;
var picturesContainer = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();

// Собираем информацию одной карточки
var createCard = function (cardsInfo) {
  var tempCard = template.cloneNode(true);
  tempCard.querySelector('.picture__img').setAttribute('src', cardsInfo.url);
  tempCard.querySelector('.picture__stat--likes').textContent = cardsInfo.likes;
  tempCard.querySelector('.picture__stat--comments').textContent = cardsInfo.comments.length;
  return tempCard;
};

// Вставляем в фрагмент все карточки
var insetCards = function () {
  for (var i = 0; i < window.data.photoParameters.length; i++) {
    fragment.appendChild(createCard(window.data.photoParameters[i]));
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

// ======================= Применение фильтров ============================

var SCALE_PIN_VALUE_DEFAULT = '100%';
var imagePreview = editImageForm.querySelector('.img-upload__preview');
var scalePin = editImageForm.querySelector('.scale__pin');
var scaleLevel = editImageForm.querySelector('.scale__level');
var scaleValue = editImageForm.querySelector('.scale__value');
var currentFilter = editImageForm.querySelector('input[type="radio"]:checked').value;
var scaleBar = editImageForm.querySelector('.img-upload__scale');

// Определяет уровень применения нужного фильтра
var getLevelFilter = function (filter) {
  var levelsFilters = {
    none: '',
    chrome: 'grayscale(' + 1 / 100 * scaleValue.value + ')',
    sepia: 'sepia(' + 1 / 100 * scaleValue.value + ')',
    marvin: 'invert(' + scaleValue.value + '%)',
    phobos: 'blur(' + 3 / 100 * scaleValue.value + 'px)',
    heat: 'brightness(' + ((2 / 100 * scaleValue.value) + 1) + ')'
  };
  return levelsFilters[filter];
};

// Передает положение пина для вычисления уровня насыщенности
// Линия уровня меняется в зависимости от положения пина
var changeScaleValue = function () {
  scaleValue.value = Math.round(parseFloat(scalePin.style.left, 10));
  scaleLevel.style.width = scalePin.style.left;
};

// Применяет фильтр
var applyFilter = function (filter) {
  changeScaleValue();
  imagePreview.style.filter = getLevelFilter(filter);
};

// Прячет слайдер если фильтра нет. Если есть - показывает.
var switchFilterPanel = function (filterType) {
  if (filterType === 'none') {
    scaleBar.style.display = 'none';
  } else if (filterType !== currentFilter) {
    scaleBar.style.display = 'block';
  }
};

// Меняет фильтр на выбранный
var changeFilter = function (filterType) {
  switchFilterPanel(filterType);
  scalePin.style.left = SCALE_PIN_VALUE_DEFAULT;
  imagePreview.classList.remove('effects__preview--' + currentFilter);
  imagePreview.classList.add('effects__preview--' + filterType);
  applyFilter(filterType);
  currentFilter = filterType;
};

// Функция смены фильта
var onFilterChange = function (evt) {
  evt.preventDefault();
  var filterType = evt.target.value;
  changeFilter(filterType);
};

// При переключении фильтра применяет его к превью фотографии
editImageForm.addEventListener('change', onFilterChange);

// Применяем дефолтный фильтр при открытии страницы, ставим пин на
// дефолтное значение и применяем соответствующий уровень фильтра
imagePreview.classList.add('effects__preview--' + currentFilter);
scalePin.style.left = SCALE_PIN_VALUE_DEFAULT;
applyFilter(currentFilter);

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

// ========================= Перетаскивание слайдера ==========================

var scaleLine = document.querySelector('.scale__line');
scaleLine.style.cursor = 'pointer';

scaleLine.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  // Перемещает пин на место нажатия мышкой
  if (evt.target === scaleLine || evt.target === scaleLevel) {
    scalePin.style.left = (evt.offsetX / scaleLine.offsetWidth * 100) + '%';
    applyFilter(currentFilter);
  }

  var pinStartCoordinateX = evt.clientX;

  var onPinMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = pinStartCoordinateX - moveEvt.clientX;

    pinStartCoordinateX = moveEvt.clientX;

    var scalePinLeft = ((scalePin.offsetLeft - shift) / scaleLine.offsetWidth * 100);

    if (scalePinLeft > 0 && scalePinLeft < 100) {
      scalePin.style.left = scalePinLeft + '%';
      applyFilter(currentFilter);
    }
  };

  var onPinMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onPinMouseMove);
    document.removeEventListener('mouseup', onPinMouseUp);
  };

  document.addEventListener('mousemove', onPinMouseMove);
  document.addEventListener('mouseup', onPinMouseUp);
});
