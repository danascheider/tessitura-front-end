var Fixtures = require('../../../spec/support/fixtures/fixtures.js');

var SpecWrapper = Backbone.View.extend({
  el         : 'body',
  template   : JST['spec/taskPanel'],

  events     : {
    'click a[data-method=toggleWidget]'     : 'callToggleWidget',
    'click a[data-method=remove]'           : 'remove',
    'click a[data-method=render]'           : 'render',
    'click a[data-method=displayPanelBody]' : 'displayPanelBody',
    'click a[data-method=hidePanelBody]'    : 'hidePanelBody'
  },

  callToggleWidget: function(e) {
    e.preventDefault();
    var event = $.Event('click', {target: this.view.$('.panel-heading i').last()});
    this.view.toggleWidget(event);
  },

  displayPanelBody: function() {
    if(!this.$('#task-panel .panel-body').is(':visible')) { this.$('.panel-body').slideDown(); }
  },

  hidePanelBody: function() {
    if(this.$('#task-panel .panel-body').is(':visible')) { this.$('.panel-body').slideUp(); }
  },

  initialize : function() {
    this.view = new Canto.TaskPanelView({collection: Fixtures.collection});
    this.render();
  },

  render   : function() {
    this.$el.html(this.template());
    this.$el.addClass('test').attr('id', 'dashboard-wrapper');
    this.delegateEvents();
    this.view.render();
    this.$('#view').html(this.view.$el);
    this.view.delegateEvents();

    return this;
  }
});

module.exports = SpecWrapper;