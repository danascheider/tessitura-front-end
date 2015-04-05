Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var fixtures = require('../../../spec/support/fixtures/fixtures.js');
var DashboardHomeView = require('../partialViews/dashboardHomeView.js');

var SpecWrapper = Canto.View.extend({
  template: JST['spec/dashHome'],
  el      : 'body',

  /* Core View Functions
  /***************************************************************************/

  initialize : function() {
    this.view = new DashboardHomeView({user: fixtures.user});
    this.render();
  },

  render  : function() {
    var that = this;

    return Canto.View.prototype.render.call(this, this.template(), function() {
      that.$el.addClass('test');
      that.view.render();
      that.$('#view').html(that.view.$el);
    });
  }
});

module.exports = SpecWrapper;