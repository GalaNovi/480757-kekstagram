'use strict';

(function () {
  // ======================= Применение фильтров ============================
  var SCALE_PIN_VALUE_DEFAULT = '100%';
  var RESIZE_STEP = 25;
  var MAX_SIZE_VALUE = 100;
  var MIN_SIZE_VALUE = 25;
  var editImageFormElement = document.querySelector('.img-upload__overlay');
  var previewElement = editImageFormElement.querySelector('.img-upload__preview-image');
  var imagePreviewElement = editImageFormElement.querySelector('.img-upload__preview');
  var scaleBarElement = editImageFormElement.querySelector('.img-upload__scale');
  var scalePinElement = scaleBarElement.querySelector('.scale__pin');
  var scaleLevelElement = scaleBarElement.querySelector('.scale__level');
  var scaleValueElement = scaleBarElement.querySelector('.scale__value');
  var scaleLineElement = scaleBarElement.querySelector('.scale__line');
  var resizeValueElement = editImageFormElement.querySelector('.resize__control--value');
  var resizeMinusButtonElement = editImageFormElement.querySelector('.resize__control--minus');
  var resizePlusButtonElement = editImageFormElement.querySelector('.resize__control--plus');
  var effectsListElement = editImageFormElement.querySelector('.effects__list');
  var defaultEffect = effectsListElement.querySelector('input[type="radio"]:checked').value;
  var currentEffect = defaultEffect;

  // Определяет уровень применения нужного фильтра
  var getLevelEffect = function (effect) {
    switch (effect) {
      case 'chrome': return 'grayscale(' + 1 / 100 * scaleValueElement.value + ')';
      case 'sepia': return 'sepia(' + 1 / 100 * scaleValueElement.value + ')';
      case 'marvin': return 'invert(' + scaleValueElement.value + '%)';
      case 'phobos': return 'blur(' + 3 / 100 * scaleValueElement.value + 'px)';
      case 'heat': return 'brightness(' + ((2 / 100 * scaleValueElement.value) + 1) + ')';
      default: return '';
    }
  };

  // Передает положение пина для вычисления уровня насыщенности
  // Линия уровня меняется в зависимости от положения пина
  var changeScaleValueElement = function (newValue) {
    scalePinElement.style.left = newValue;
    scaleValueElement.value = parseInt(newValue, 10);
    scaleLevelElement.style.width = newValue;
  };

  // Применяет фильтр
  var applyEffect = function (effect, value) {
    changeScaleValueElement(value);
    imagePreviewElement.style.filter = getLevelEffect(effect);
  };

  // Прячет слайдер если фильтра нет. Если есть - показывает.
  var switchEffectPanel = function (selectedEffect) {
    scaleBarElement.style.display = selectedEffect === 'none' ? 'none' : 'block';
  };

  // Меняет фильтр на выбранный
  var changeEffect = function (effectType) {
    switchEffectPanel(effectType);
    scalePinElement.style.left = SCALE_PIN_VALUE_DEFAULT;
    imagePreviewElement.classList.remove('effects__preview--' + currentEffect);
    imagePreviewElement.classList.add('effects__preview--' + effectType);
    applyEffect(effectType, SCALE_PIN_VALUE_DEFAULT);
    currentEffect = effectType;
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

  // Задает стандартные фильтр
  var setDefaultEffect = function () {
    imagePreviewElement.classList.remove('effects__preview--' + currentEffect);
    imagePreviewElement.classList.add('effects__preview--' + defaultEffect);
    currentEffect = defaultEffect;
    scalePinElement.style.left = SCALE_PIN_VALUE_DEFAULT;
    imagePreviewElement.style.transform = '';
    applyEffect(defaultEffect, SCALE_PIN_VALUE_DEFAULT);
    previewElement.src = '#';
  };

  // Функция смены фильта
  var onEffectChange = function (evt) {
    evt.preventDefault();
    var effectType = evt.target.value;
    changeEffect(effectType);
  };

  // При переключении фильтра применяет его к превью фотографии
  effectsListElement.addEventListener('change', onEffectChange);

  // Обработчик для уменьшения изображения
  resizeMinusButtonElement.addEventListener('click', function () {
    resizeImage(-RESIZE_STEP);
  });

  // Обработчик для увеличения изображения
  resizePlusButtonElement.addEventListener('click', function () {
    resizeImage(RESIZE_STEP);
  });

  // Обработчик перетаскивания пина
  scaleLineElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // Перемещает пин на место нажатия мышкой
    if (evt.target === scaleLineElement || evt.target === scaleLevelElement) {
      var newValue = evt.offsetX / scaleLineElement.offsetWidth * 100 + '%';
      applyEffect(currentEffect, newValue);
    }

    var pinStartCoordinateX = evt.clientX;

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = pinStartCoordinateX - moveEvt.clientX;

      pinStartCoordinateX = moveEvt.clientX;

      var scalePinElementLeft = ((scalePinElement.offsetLeft - shift) / scaleLineElement.offsetWidth * 100);

      if (scalePinElementLeft > 0 && scalePinElementLeft < 100) {
        newValue = scalePinElementLeft + '%';
        applyEffect(currentEffect, newValue);
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

  setDefaultEffect();

  window.resetEffects = setDefaultEffect;
})();
