'use strict';

(function () {
  // ======================= Применение фильтров ============================
  var SCALE_PIN_VALUE_DEFAULT = '100%';
  var RESIZE_STEP = 25;
  var MAX_SIZE_VALUE = 100;
  var MIN_SIZE_VALUE = 25;
  var editImageFormElement = document.querySelector('.img-upload__overlay');
  var imagePreviewElement = editImageFormElement.querySelector('.img-upload__preview');
  var scalePinElement = editImageFormElement.querySelector('.scale__pin');
  var scaleLevelElement = editImageFormElement.querySelector('.scale__level');
  var scaleValueElement = editImageFormElement.querySelector('.scale__value');
  var currentFilter = editImageFormElement.querySelector('input[type="radio"]:checked').value;
  var scaleBarElement = editImageFormElement.querySelector('.img-upload__scale');
  var resizeValueElement = editImageFormElement.querySelector('.resize__control--value');
  var resizeMinusButton = editImageFormElement.querySelector('.resize__control--minus');
  var resizePlusButton = editImageFormElement.querySelector('.resize__control--plus');
  var scaleLineElement = document.querySelector('.scale__line');

  // Определяет уровень применения нужного фильтра
  var getLevelFilter = function (filter) {
    var levelsFilters = {
      none: '',
      chrome: 'grayscale(' + 1 / 100 * scaleValueElement.value + ')',
      sepia: 'sepia(' + 1 / 100 * scaleValueElement.value + ')',
      marvin: 'invert(' + scaleValueElement.value + '%)',
      phobos: 'blur(' + 3 / 100 * scaleValueElement.value + 'px)',
      heat: 'brightness(' + ((2 / 100 * scaleValueElement.value) + 1) + ')'
    };
    return levelsFilters[filter];
  };

  // Передает положение пина для вычисления уровня насыщенности
  // Линия уровня меняется в зависимости от положения пина
  var changescaleValueElement = function () {
    scaleValueElement.value = parseInt(scalePinElement.style.left, 10);
    scaleLevelElement.style.width = scalePinElement.style.left;
  };

  // Применяет фильтр
  var applyFilter = function (filter) {
    changescaleValueElement();
    imagePreviewElement.style.filter = getLevelFilter(filter);
  };

  // Прячет слайдер если фильтра нет. Если есть - показывает.
  var switchFilterPanel = function (filterType) {
    if (filterType === 'none') {
      scaleBarElement.style.display = 'none';
    } else if (filterType !== currentFilter) {
      scaleBarElement.style.display = 'block';
    }
  };

  // Меняет фильтр на выбранный
  var changeFilter = function (filterType) {
    switchFilterPanel(filterType);
    scalePinElement.style.left = SCALE_PIN_VALUE_DEFAULT;
    imagePreviewElement.classList.remove('effects__preview--' + currentFilter);
    imagePreviewElement.classList.add('effects__preview--' + filterType);
    applyFilter(filterType);
    currentFilter = filterType;
  };

  // Функция смены фильта
  var onFilterChange = function (evt) {
    evt.preventDefault();
    var filterType = evt.target.value;
    changeFilter(filterType);
  };

  // Прописывает размер элемента в css
  var applySize = function (size) {
    size = parseFloat(size) / 100;
    imagePreviewElement.style.transform = 'scale(' + size + ')';
  };

  // Меняет размер изображения
  var resizeImage = function (step) {
    var currentValue = parseFloat(resizeValueElement.value);
    if (currentValue + step >= MIN_SIZE_VALUE && currentValue + step <= MAX_SIZE_VALUE) {
      resizeValueElement.value = (currentValue + step) + '%';
    }
    applySize(resizeValueElement.value);
  };

  // Меняет стиль курсора при наведении на шкалу
  scaleLineElement.style.cursor = 'pointer';

  // Применяем дефолтный фильтр при открытии страницы, ставим пин на
  // дефолтное значение и применяем соответствующий уровень фильтра
  imagePreviewElement.classList.add('effects__preview--' + currentFilter);
  scalePinElement.style.left = SCALE_PIN_VALUE_DEFAULT;
  applyFilter(currentFilter);

  // При переключении фильтра применяет его к превью фотографии
  editImageFormElement.addEventListener('change', onFilterChange);

  // Обработчик для уменьшения изображения
  resizeMinusButton.addEventListener('click', function () {
    resizeImage(-RESIZE_STEP);
  });

  // Обработчик для увеличения изображения
  resizePlusButton.addEventListener('click', function () {
    resizeImage(RESIZE_STEP);
  });

  // Обработчик перетаскивания пина
  scaleLineElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Перемещает пин на место нажатия мышкой
    if (evt.target === scaleLineElement || evt.target === scaleLevelElement) {
      scalePinElement.style.left = (evt.offsetX / scaleLineElement.offsetWidth * 100) + '%';
      applyFilter(currentFilter);
    }

    var pinStartCoordinateX = evt.clientX;

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = pinStartCoordinateX - moveEvt.clientX;

      pinStartCoordinateX = moveEvt.clientX;

      var scalePinElementLeft = ((scalePinElement.offsetLeft - shift) / scaleLineElement.offsetWidth * 100);

      if (scalePinElementLeft > 0 && scalePinElementLeft < 100) {
        scalePinElement.style.left = scalePinElementLeft + '%';
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
})();
