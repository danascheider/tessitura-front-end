require('../dependencies.js');

var UserModel = Tessitura.Model.extend({
  urlRoot: Tessitura.API.users.collection,
  klass  : 'UserModel',
  types  : function() {
    return Tessitura.Model.prototype.types().concat(['UserModel', 'User']);
  },

  /* Special Functions
  /**************************************************************************************/

  login          : function(settings) {
    settings = settings || {};
    var that = this;

    settings.type       = settings.type || 'POST';
    settings.url        = Tessitura.API.login;
    settings.beforeSend = function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(that.get('username') + ':' + that.get('password')));
    }

    return Tessitura.Model.prototype.fetch.call(this, settings);
  },

  protectedFetch : function(settings) {
    settings = settings || {};
    var that = this;

    settings.url = Tessitura.API.users.single(this.get('id'));

    settings.beforeSend = (settings.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
    };

    return Backbone.Model.prototype.fetch.call(this, settings);
  },

  /* Core Model Functions
  /**************************************************************************************/

  fetch          : function(settings) {
    settings = settings || {};

    var string = this.get('username') + ':' + this.get('password');
    var token  = 'Basic ' + new Buffer(string).toString('base64');

    settings.beforeSend = (settings.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', token);
    };

    return Backbone.Model.prototype.fetch.call(this, settings);
  },

  initialize     : function(attrs, opts) {
    opts = opts || {};

    this.tasks = new Tessitura.TaskCollection();

    if(this.get('id') && !(opts.sync === false)) { this.protectedFetch(); }
  }
});

module.exports = UserModel;