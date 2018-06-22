'use strict';

(function () {
  window.utils = {
    // Возвращает рандомное число в нужном диапазоне
    getRandomNumber: function (min, max) {
      var number = 0;
      number = Math.floor(Math.random() * (max + 1 - min) + min);
      return number;
    },
    // Перетасовывает массив
    getShuffleArray: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = window.utils.getRandomNumber(0, i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
  };
})();
