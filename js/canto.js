requirejs.config({
  paths: {
    jquery:     './lib/jquery-2.1.1',
    underscore: './lib/underscore',
    backbone:   './lib/backbone',
    relational: './lib/backbone-relational',
    basic:      './lib/backbone.basicauth',
    bootstrap:  './lib/bootstrap',

    // Canto-specific code
    users:      './models/users',
    tasks:      './models/tasks',
    taskLists:  './models/task-lists'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    bootstrap: {
      deps: ['jquery']
    }
  }
});

// Require external libraries
requirejs(['jquery', 
           'underscore', 
           'backbone', 
           'relational', 
           'basic', 
           'bootstrap',
           'sb-admin'], 
          function($, _, backbone, rel, basic) {
  requirejs(['users', 'taskLists', 'tasks'], function(main) {

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

    var makeBasicAuth = function(username, password) {
      var tok = username + ':' + password
      var hash=btoa(tok);
      return 'Basic ' + hash
    }

    //Expand second-level nav stuff
    $('ul#side-menu li a').click(function() {
      var li = $(this).parent('li');
      li.toggleClass('active');

      if(li.hasClass('active')) {
        li.siblings('li').removeClass('active');
        li.siblings('li').find('ul.nav').slideUp();
      }

      li.children('ul.nav').slideToggle();
    })

    // Login page
    $('.login-form button:submit').click(function(e) {
      e.preventDefault();
      var form = $(this).parent('form');
      var data = getAttributes(form);

      $.ajax({
        url: 'http://localhost:9292/login',
        type: 'POST',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', makeBasicAuth(data['username'], data['password']));
        },
        success: function(data, status, xhr) {
          window.location = 'file:///home/dscheider/Development/canto-front-end/dashboard.html';
        },
        error: function() {
          console.log('Error');
        }
      });
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
  });
});