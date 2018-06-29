'use strict';

(function () {
  var NEW_CARDS_QUANTITY = 10;
  var cardsContainerElement = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var filtersElement = document.querySelector('.img-filters');
  var commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentLoadElement = bigPictureElement.querySelector('.social__loadmore');
  var filterButtons = filtersElement.querySelectorAll('.img-filters__button');
  var cardsData = [];

  // Ищет активный фильтр
  var getActiveFilter = function (filters) {
    var activefilter;
    for (var i = 0; i < filters.length; i++) {
      if (filters[i].classList.contains('img-filters__button--active')) {
        activefilter = filters[i];
        break;
      }
    }
    return activefilter;
  };
  var activeFilter = getActiveFilter(filterButtons);

  // Удаляет все миниатюры
  var deleteCards = function () {
    var cards = document.querySelectorAll('.picture__link');
    for (var i = 0; i < cards.length; i++) {
      cardsContainerElement.removeChild(cards[i]);
    }
  };

  // Обновляет миниатюты
  var updateCards = function (data) {
    var cards = createCards(data);
    deleteCards();
    cardsContainerElement.appendChild(cards);
  };

  // Переключает на выбранный фильтр
  var switchFilter = function (chosenFilter) {
    switch (chosenFilter.id) {
      case 'filter-popular':
        updateCards(cardsData);
        break;
      case 'filter-new':
        updateCards(window.sorting.new(cardsData, NEW_CARDS_QUANTITY));
        break;
      case 'filter-discussed':
        updateCards(window.sorting.discussed(cardsData));
        break;
    }
    activeFilter.classList.remove('img-filters__button--active');
    chosenFilter.classList.add('img-filters__button--active');
    activeFilter = chosenFilter;
  };

  // Вешает обработкик клика на одну кнопку фильтра
  var filterButtonAddListener = function (button) {
    button.addEventListener('click', function () {
      switchFilter(button);
    });
  };

  // Вешает обработкик клика на все кнопки фильтра
  var addListenersForFilterButtons = function () {
    for (var i = 0; i < filterButtons.length; i++) {
      filterButtonAddListener(filterButtons[i]);
    }
  };

  // Навешивает обработчик клика на миниатюру
  var addClickListener = function (card, data) {
    card.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.showPreview(data);
    });
  };

  // Вставляем в фрагмент все карточки
  var createCards = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = window.createPicture(data[i]);
      addClickListener(card, data[i]);
      fragment.appendChild(card);
    }
    return fragment;
  };

  // Вставляет миниатюры на страницу
  var onSuccessLoad = function (data) {
    cardsData = data;
    var cards = createCards(data);
    cardsContainerElement.appendChild(cards);
    addListenersForFilterButtons();
    filtersElement.classList.remove('img-filters--inactive');
  };

  window.backend.getData(onSuccessLoad, window.message.onErrorLoad);
  commentsCountElement.classList.add('hidden');
  commentLoadElement.classList.add('hidden');
})();
