$('a.create-task').click(function() {
  $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  $(this).parent('.panel-body').find('form.task-form').slideToggle();
})

$('.task-form button:submit').click(function(e) {
  var form = $(this).parent('form');
  var formData = form.serializeArray();
  var postData = {};

  for(key in formData) {
    var chiave = formData[key]['name'];
    if(formData[key]['value'] != '') {
      postData[chiave] = formData[key]['value']
    }
  }

  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: 'http://localhost:9292/users/1/tasks', 
    username: 'danascheider',
    password: 'danascheider',
    xhrFields: {
      withCredentials: true
    },
    data: JSON.stringify(postData),
    success: function(data, status, error) {
      $('a.create-task').find('i.fa').toggleClass('fa-caret-down fa-caret-right');
      form.slideUp();
    }
  });
})