define(function() {

  var FormUtils = {

    // Functions //

    getAttributes: function(form) {
      var formData = form.serializeArray();
      var attributes = {};

      for(var key in formData) {
        var chiave = formData[key]['name'];
        if(formData[key]['value'] != '') {
          attributes[chiave] = formData[key]['value'];
        }
      }

      return attributes;
    }
  };

  return FormUtils;
});