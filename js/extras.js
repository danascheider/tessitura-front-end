define(['jquery'], function($) {
  var extras = {
    getAttributes: function(form) {
      var formData = form.serializeArray();
      var attributes = {};

      for(key in formData) {
        var chiave = formData[key]['name'];
        if(formData[key]['value'] != '') {
          attributes[chiave] = formData[key]['value'];
        }
      }

      return attributes;
    }
  };

  return extras;
});