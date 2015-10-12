module.exports = {
  getAttributes: function(form) {
    var formData = form.serializeArray();
    var attributes = {};

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

  prettyDate   : /* istanbul ignore next */ function(date) {
    if(!date) { return ''; }

    // Without being prettified, dates show up in the view like this:
    // 2014-11-10 00:00:00 -0800. They should instead say Monday, November 10, 20whatever.
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May', 
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December'
                 ];
    var dateObj = new Date(date);
    var pretty = days[dateObj.getDay()] + ', ' + months[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear();
    return pretty;
  }
}