module.exports = {
  getAttributes: /* istanbul ignore next */ function(form) {
    var formData = form.serializeArray();
    var attributes = {};

    /* istanbul ignore next */
    for(var key in formData) {
      if (formData.hasOwnProperty(key)) {
        var chiave = formData[key].name;
        if(formData[key].value !== '') {
          attributes[chiave] = formData[key].value;
        }
      }
    }

    return attributes;
  },
}