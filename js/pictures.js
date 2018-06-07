'use strict';

var template = document.querySelector('#picture').content;
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
  number = Math.round(Math.random() * (max - min) + min);
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
var picturesContainer = document.querySelector('.pictures');
picturesContainer.appendChild(fragment);
