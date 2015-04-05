Canto = Canto || require('../dependencies.js');

var ProtectedResource = require('./protectedResourceModel');

var TaskModel = ProtectedResource.extend({
  urlRoot : function() {
    return Canto.API.tasks.collection($.cookie('userID'));
  },

  url     : function() {
    return Canto.API.tasks.single(this.get('id'));
  },

  // ---------------------- //
  // Canto Model Properties //
  // ---------------------- //

  klass   : 'TaskModel',
  parent  : 'ProtectedResourceModel',
  types   : function() {
    return ProtectedResource.prototype.types().concat(['TaskModel', 'Task']);
  },

  // ----------------- //
  // Special Functions //
  // ----------------- //

  complete       : function() {
    return this.get('status') === 'Complete';
  },

  displayTitle   : function(chars) {
    var chars = chars || 60;
    var title = this.escape('title');

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

  // -------------------- //
  // Core Model Functions //
  // -------------------- //

  fetch      : function(opts) {
    opts = opts || {};
    opts.url = opts.url || this.url();
    return ProtectedResource.prototype.fetch.call(this, opts);
  },

  initialize : function() {
    // FIX: This should do something to handle validation errors
  },

  save       : function(attrs, opts) {
    attrs = attrs || this.attributes;
    opts  = opts || {};

    opts.url = this.isNew() ? this.urlRoot() : this.url();

    return ProtectedResource.prototype.save.call(this, attrs, opts);
  },

  validate   : function(attrs) {
    if (!attrs.title) {
      return 'Title is required';
    }
  }
});

module.exports = TaskModel;