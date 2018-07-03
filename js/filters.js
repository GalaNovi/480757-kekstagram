'use strict';

(function () {
  var filtersElement = document.querySelector('.img-filters');
  var filterButtons = Array.from(filtersElement.querySelectorAll('.img-filters__button'));
  var filterButtonClickCallback = null;

  // Ищет активный фильтр
  var getActiveFilter = function (filters) {
    return filters.find(function (element) {
      return element.classList.contains('img-filters__button--active');
    });
  };
  var activeFilterButton = getActiveFilter(filterButtons);

  // Вешает обработкик клика на одну кнопку фильтра
  var filterButtonAddListener = function (filterButton) {
    filterButton.addEventListener('click', function () {
      activeFilterButton.classList.remove('img-filters__button--active');
      filterButton.classList.add('img-filters__button--active');
      activeFilterButton = filterButton;
      filterButtonClickCallback(filterButton);
    });
  };

  // Вешает обработчик клика на все кнопки фильтра
  var addListenersForFilterButtons = function () {
    for (var i = 0; i < filterButtons.length; i++) {
      filterButtonAddListener(filterButtons[i]);
    }
  };

  window.filtersEnable = function (callback) {
    filterButtonClickCallback = window.debounce(callback);
    addListenersForFilterButtons();
    filtersElement.classList.remove('img-filters--inactive');
  };
})();
