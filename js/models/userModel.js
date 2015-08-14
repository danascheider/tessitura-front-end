Tessitura.UserModel = Tessitura.Model.extend({
  urlRoot        : Tessitura.API.users.collection,
  klass          : 'UserModel',
  types          : function() {
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

  prettyCreateDate: function() {
    return Tessitura.Utils.prettyDate(this.escape('created_at'));
  },

  /* Core Model Functions
  /**************************************************************************************/

  fetch          : function(settings) {
    settings = settings || {};
    var that = this;

    settings.url = Tessitura.API.users.single(this.get('id'));

    settings.beforeSend = (settings.beforeSend) || function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
    };

    var successFunction = settings.success || function() {};

    settings.success = function(model, response, options) {
      successFunction(model, response, options);
      if (model.get('fach_id')) {
        that.Fach = new Tessitura.FachModel({id: model.get('fach_id')});
        that.Fach.fetch();
      }
    }

    return Backbone.Model.prototype.fetch.call(this, settings);
  },

  initialize     : function(attrs) {
    this.tasks = new Tessitura.TaskCollection();
  }
});

module.exports = Tessitura.UserModel;