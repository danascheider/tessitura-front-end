// General functions
var getAttributes = function(form) {
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

$(function() {
  console.log(JSON.stringify(currentSession));
});

//Expand second-level nav stuff
$('ul#side-menu li a').click(function() {
  var li = $(this).parent('li');
  li.toggleClass('active');

  if(li.hasClass('active')) {
    li.siblings('li').removeClass('active');
    li.siblings('li').find('ul.nav').slideUp();
  }

  li.children('ul.nav').slideToggle();
});

// Dashboard task display & forms
$('a.create-task').click(function() {
  $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  $(this).parent('.panel-body').find('form.task-form').slideToggle();
});

$('.task-form button:submit').click(function(e) {
  e.preventDefault();
  var form = $(this).parent('form');
  var attrs = getAttributes(form);

  var newTask = new Task(attrs);
  newTask.credentials = {
    username: 'danascheider',
    password: 'danascheider'
  }

  newTask.save(newTask.attributes, {
    success: function(model, response, options) {
      $('a.create-task').find('i.fa').toggleClass('fa-caret-down fa-caret-right');
      form.slideUp();
      console.log('Success: Model saved');
    },
    error: function(model, xhr, options) {
      console.log('Error: Failed to save model ' + JSON.stringify(model) + ' - xhr: ' + JSON.stringify(xhr) + ', options: ' + JSON.stringify(options));
    }
  });
});
