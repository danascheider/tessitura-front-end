Tessitura                        = Tessitura || require('../dependencies.js');
Tessitura.ProtectedResourceModel = Tessitura.ProtectedResourceModel || require('./protectedResourceModel.js');

var TaskModel = Tessitura.ProtectedResourceModel.extend({
  urlRoot : function() {
    return Tessitura.API.tasks.collection($.cookie('userID'));
  },

  url     : function() {
    return Tessitura.API.tasks.single(this.get('id'));
  },

  defaults: {
    priority: 'Normal',
    status  : 'New'
  },

  /* Special Functions 
  /**************************************************************************************/

  klass   : 'TaskModel',
  parent  : 'ProtectedResourceModel',
  types   : function() {
    return Tessitura.ProtectedResourceModel.prototype.types().concat(['TaskModel', 'Task']);
  },

  /* Special Functions 
  /**************************************************************************************/

  complete       : function() {
    return this.get('status') === 'Complete';
  },

  displayTitle   : function(chars) {
    var chars = chars || 60;
    var title = this.get('title');

    if(title.length > chars) {
      var shorter = title.substring(0,chars - 1).split(' ');
      shorter.pop();
      return shorter.join(' ') + ' ...';
    } 

    return title;
  },

  incomplete     : function() {
    return this.get('status') != 'Complete';
  },

  prettyDeadline : function() {
    // Without being prettified, deadlines show up in the view like this:
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
    var date = new Date(this.escape('deadline'));
    var pretty = days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    return pretty;
  },

  /* Special Functions 
  /**************************************************************************************/

  fetch      : function(opts) {
    opts = opts || {};
    opts.url = opts.url || this.url();
    return Tessitura.ProtectedResourceModel.prototype.fetch.call(this, opts);
  },

  initialize : function() {
    // FIX: This should do something to handle validation errors
  },

  save       : function(attrs, opts) {
    attrs = attrs || this.attributes;
    opts  = opts || {};

    opts.url = this.isNew() ? this.urlRoot() : this.url();

    return Tessitura.ProtectedResourceModel.prototype.save.call(this, attrs, opts);
  },

  validate   : function(attrs) {
    if (!attrs.title) {
      return 'Title is required';
    }
  }
});

module.exports = TaskModel;