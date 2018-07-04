'use strict';

(function () {
  window.utils = {
    // Возвращает рандомное число в нужном диапазоне
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    // Перетасовывает массив
    getShuffleArray: function (array) {
      array.forEach(function (element, i, arr) {
        var j = window.utils.getRandomNumber(0, i);
        arr[i] = arr[j];
        arr[j] = element;
      });
      return array;
    },
  };
})();
