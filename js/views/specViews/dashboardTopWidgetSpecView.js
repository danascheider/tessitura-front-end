Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

var Fixtures      = require('../../../spec/support/fixtures/fixtures.js');
var TopWidgetView = require('../partialViews/dashboardTopWidgetView.js');

var SpecWrapper = Backbone.View.extend({
  el         : 'body',
  template   : JST['spec/topWidgets'],

  events     : {
    'click a[data-method=changeLinkColor]'     : 'callChangeLinkColor',
    'click a[data-method=changeLinkColorBack]' : 'callChangeLinkColorBack',
    'click a[data-method=makeLinkColored]'     : 'makeLinkColored',
    'click a[data-method=makeLinkGray]'        : 'makeLinkGray'
  },

  // --------------- //
  // Event Callbacks //
  // --------------- //

  callChangeLinkColor     : function(e) {
    e.preventDefault();
    var that  = this;
    var event = $.Event('mouseenter', {target: that.view.$('.dash-widget').first()});

    this.view.callChangeLinkColor(event);
  },

  callChangeLinkColorBack : function(e) {
    e.preventDefault();
    var that  = this;
    var event = $.Event('mouseleave', {target: that.view.$('.dash-widget').first()});

    this.view.callChangeLinkColorBack(event);
  },

  makeLinkColored         : function(e) {
    e.preventDefault();
    var that  = this;
    var color = this.view.$('panel-heading').css('background-color');

    if(!this.view.$('.dash-widget').first().css('background-color') === color) {
      var event = $.Event('mouseenter', {target: that.view.$('.dashwidget').first()});
      this.view.callChangeLinkColor(event);
    }
  },

  makeLinkGray            : function(e) {
    e.preventDefault();
    var that  = this;
    var color = this.view.$('panel-heading').css('background-color');

    if(this.view.$('.dash-widget').first().css('background-color') === color) {
      var event = $.Event('mouseLeave', {target: that.view.$('.dashwidget').first()});
      this.view.callChangeLinkColorBack(event);
    }
  },

  // ------------------- //
  // Core View Functions //
  // ------------------- //

  initialize : function() {
    var data = {
      taskCollection      : Fixtures.collection,
      deadlineCount       : 6,
      appointmentCount    : 2,
      recommendationCount : 12
    };

    this.view = new TopWidgetView(data);
    this.render();
  },

  render   : function() {
    this.$el.html(this.template());
    this.$el.addClass('test');
    this.view.render();
    this.$('#view').html(this.view.$el);
    this.delegateEvents();
    return this;
  }
});

module.exports = SpecWrapper;