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
        if (left.comments.length === right.comments.length) {
          return 0;
        }
        return left.comments.length < right.comments.length ? 1 : -1;
      });
      return tempData;
    }
  };
})();
