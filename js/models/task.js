define([
  'underscore',
  'backbone',
  'api',
  'utils',
  'cookie'
  ], function(_, Backbone, API, Utils) {
  
  var TaskModel = Backbone.Model.extend({
    urlRoot: function() {
      return API.tasks.collection($.cookie('userID'));
    },

    complete: function() {
      return Boolean(this.get('status') === 'Complete');
    },

    create: function(attributes, options) {
      attributes = attributes || this.attributes;
      options = options || {};

      options.url = this.urlRoot();
      options.type = 'POST',
      options.beforeSend = (options.beforeSend) || function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ', $.cookie('auth'));
      }

      return Backbone.Model.prototype.save.call(this, attributes, options);
    },

    // FIX: The displayTitle function would probably be better if it took a 
    //      `length` argument and adjusted based on that instead of going with
    //      60 every time
    
    displayTitle: function() {
      var title = this.escape('title');

      if(title.length > 60) {
        var shorter = title.substring(0,59).split(' ');
        shorter.pop();
        return shorter.join(' ') + ' ...';
      } else {
        return title;
      }
    },

    fetch: function(options) {
      options = options || {};
      options.url = API.tasks.single(this.get('id'));
      options.beforeSend = Utils.authHeader;

      Backbone.Model.prototype.fetch.call(this, options);
    },

    incomplete: function() {
      return Boolean(this.get('status') !== 'Complete');
    },

    initialize: function() {
      this.on('invalid', function(model, error) {
        console.log('**Validation error: ' + error + '**');
      });
    },

    prettyDeadline: function() {
      // Without being prettified, deadlines show up in the view like this:
      // 2014-11-10 00:00:00 -0800. They should instead say 11/10/2014.
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
      var date = new Date(this.escape('deadline'));
      var pretty = days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
      return pretty;
    },

    validate  : function(attrs) {
      if (!attrs.title) {
        return 'Title is required';
      }
    }
  });

  return TaskModel;
});