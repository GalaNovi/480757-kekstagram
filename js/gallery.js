'use strict';

(function () {
  var NEW_CARDS_QUANTITY = 10;
  var cardsContainerElement = document.querySelector('.pictures');
  var cardsData = [];

  // Удаляет все миниатюры
  var deleteCards = function () {
    var cards = document.querySelectorAll('.picture__link');
    for (var i = 0; i < cards.length; i++) {
      cardsContainerElement.removeChild(cards[i]);
    }
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
      case 'filter-popular':
        renderCards(cardsData);
        break;
      case 'filter-new':
        renderCards(window.sorting.new(cardsData, NEW_CARDS_QUANTITY));
        break;
      case 'filter-discussed':
        renderCards(window.sorting.discussed(cardsData));
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
  };

  window.backend.getData(onSuccessLoad, window.message.errorText);
})();
