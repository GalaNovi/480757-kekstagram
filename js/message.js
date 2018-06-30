'use strict';

(function () {
  var ERROR_COLOR = 'tomato';
  var SUCCESS_COLOR = '#2AA670';

  var message = function (text, color) {
    var node = document.createElement('div');
    node.style = 'position: absolute; z-index: 100; padding: 20px 50px; text-align: center; background-color: white';
    node.style.border = '5px solid ' + color;
    node.style.borderRadius = '10px';
    node.style.boxShadow = '10px 20px 5px 0 rgba(0, 0, 0, 0.7)';
    node.style.top = '90px';
    node.style.left = '50%';
    node.style.color = color;
    node.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.7)';
    node.style.fontSize = '24px';
    node.style.fontFamily = 'Times New Roman';
    node.style.transform = 'translateX(-50%)';
    node.style.transition = 'opacity 1s';
    node.textContent = text;
    node.classList.add('message');
    document.body.insertAdjacentElement('afterbegin', node);
    setTimeout(function () {
      document.querySelector('.message').style.opacity = '0';
    }, 2000);
    setTimeout(function () {
      document.body.removeChild(document.querySelector('.message'));
    }, 3000);
  };

  window.message = {
    errorText: function (text) {
      message(text, ERROR_COLOR);
    },

    text: function (text) {
      message(text, SUCCESS_COLOR);
    }
  };
})();
