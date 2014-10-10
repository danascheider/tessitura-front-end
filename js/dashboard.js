/* This is a temporary thing that fetches all the tasks from the server
   when the dashboard is loaded. Eventually, it will dynamically render
   the dashboard views so users can see their data when they log in. 
*/

// FIX: This function is defined in two different places
//      due to scoping issues.
var makeBasicAuth = function(username, password) {
  var tok = username + ':' + password
  var hash=btoa(tok);
  return 'Basic ' + hash
}

$(function() {
  $.ajax({
    url: 'http://localhost:9292/users/1/tasks',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', makeBasicAuth('danascheider', 'danascheider'));
    },
    xhrFields: {
      withCredentials: true
    },
    success: function(data, status, xhr) {
      for(task in data) {
        var view = new DashboardTaskView({
          model: task
        });
        view.render();
      }
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
});