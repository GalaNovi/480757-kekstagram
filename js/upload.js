'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileChooserElement = document.querySelector('.img-upload__input');
  var previewElement = document.querySelector('.img-upload__preview-image');

  fileChooserElement.addEventListener('change', function () {
    var file = fileChooserElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        previewElement.src = reader.result;
      });
      reader.readAsDataURL(file);
      window.openForm();
    } else {
      window.message.showError('Файл не является изображением');
    }
  });
})();
