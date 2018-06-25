'use strict';

(function () {
  window.backend = {
    getData: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = 5000;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          default:
            onError('Произошла ошибка ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка при соединении');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + 'с');
      });

      xhr.open('GET', URL);
      xhr.send();
    },

    sendData: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad();
            break;
          case 400:
            onError('Отправлять можно только изображение!');
            break;
          default:
            onError('Произошла ошибка ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка при соединении');
      });

      xhr.addEventListener('timeout', function () {
        onError('Данные не успели отправиться за ' + (xhr.timeout / 1000) + 'с');
      });

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
