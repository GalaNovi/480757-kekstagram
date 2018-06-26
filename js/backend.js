'use strict';

(function () {
  var GET_TIMEOUT = 5000;
  var SEND_TIMEOUT = 10000;
  var LOAD_SUCCESS = 200;
  var FILE_TYPE_ERROR = 400;

  window.backend = {
    getData: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = GET_TIMEOUT;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case LOAD_SUCCESS:
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
      xhr.timeout = SEND_TIMEOUT;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case LOAD_SUCCESS:
            onLoad();
            break;
          case FILE_TYPE_ERROR:
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
