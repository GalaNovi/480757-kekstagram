'use strict';

(function () {
  // ======================= Применение фильтров ============================
  var SCALE_PIN_VALUE_DEFAULT = '100%';
  var editImageForm = document.querySelector('.img-upload__overlay');
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
})();
