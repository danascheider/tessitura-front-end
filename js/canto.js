requirejs.config({
  paths: {
    // Maintain directory structure for external libraries
    lib: '../lib',
  }
});

// Require external libraries
requirejs(['lib/jquery-2.1.1', 
           'lib/underscore', 
           'lib/backbone', 
           'lib/backbone-relational', 
           'lib/backbone.basicauth', 
           'lib/bootstrap.js',
           'lib/sb-admin.js'], 
          function($, _, backbone, rel, basic) {
  requirejs(['backbone-main.js'])
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

  // Dashboard task display & forms
  $('a.create-task').click(function() {
    $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
    $(this).parent('.panel-body').find('form.task-form').slideToggle();
  })

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
});