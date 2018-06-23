'use strict';

(function () {
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

  // Получаем массив с созданными объектами
  var getPhotoInfoArray = function (urlsArray, commentsArray, descriptionsArray) {
    var photoParametersTemp = [];
    urlsArray = window.utils.getShuffleArray(urlsArray);
    commentsArray = window.utils.getShuffleArray(commentsArray);
    for (var i = 0; i < urlsArray.length; i++) {
      var urlTemp = 'photos/' + urlsArray[i] + '.jpg';
      var likesTemp = window.utils.getRandomNumber(MIN_LIKES, MAX_LIKES);
      var commentsTemp = [];
      commentsArray = window.utils.getShuffleArray(commentsArray);
      // Рандомим количество комментов
      for (var j = 0; j < window.utils.getRandomNumber(MIN_QUANTITY_COMMENTS, MAX_QUANTITY_COMMENTS); j++) {
        commentsTemp[j] = commentsArray[j];
      }
      var descriptionTemp = descriptionsArray[window.utils.getRandomNumber(0, descriptionsArray.length - 1)];
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

  window.data = {
    photoParameters: getPhotoInfoArray(urls, comments, descriptions)
  };
})();
