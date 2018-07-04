'use strict';

(function () {
  var NEW_CARDS_QUANTITY = 10;
  var cardsContainerElement = document.querySelector('.pictures');
  var cardsData = [];

  // Удаляет все миниатюры
  var deleteCards = function () {
    var cards = cardsContainerElement.querySelectorAll('.picture__link');
    cards.forEach(function (card) {
      cardsContainerElement.removeChild(card);
    });
  };

  // Отрисовывает миниатюты
  var renderCards = function (data) {
    var cards = createCards(data);
    deleteCards();
    cardsContainerElement.appendChild(cards);
  };

  // Отфильтровывает миниатюры
  var updateCards = function (filterButton) {
    switch (filterButton.id) {
      case 'filter-popular': renderCards(cardsData);
        break;
      case 'filter-new': renderCards(window.sorting.new(cardsData, NEW_CARDS_QUANTITY));
        break;
      case 'filter-discussed': renderCards(window.sorting.discussed(cardsData));
        break;
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
    var tempData = Array.from(data);
    tempData.forEach(function (element) {
      var card = window.createPicture(element);
      addClickListener(card, element);
      fragment.appendChild(card);
    });
    return fragment;
  };

  // Вставляет миниатюры на страницу
  var onSuccessLoad = function (data) {
    cardsData = data;
    renderCards(cardsData);
    window.filtersEnable(updateCards);
  };

  var onErrorLoad = function (errorText) {
    window.message.showError(errorText);
  };

  window.backend.getData(onSuccessLoad, onErrorLoad);
})();
