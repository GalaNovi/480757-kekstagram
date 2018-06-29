'use strict';

(function () {
  window.sorting = {
    new: function (data, quantity) {
      var tempData = data.slice();
      tempData = window.utils.getShuffleArray(tempData);
      return tempData.slice(0, quantity);
    },

    discussed: function (data) {
      var tempData = data.slice();
      tempData.sort(function (left, right) {
        if (left.comments.length < right.comments.length) {
          return 1;
        }
        if (left.comments.length > right.comments.length) {
          return -1;
        }
        return 0;
      });
      return tempData;
    }
  };
})();
