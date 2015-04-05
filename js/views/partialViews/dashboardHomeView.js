/***************************************************************************
 *                                                                         *
 * DASHBOARD HOME VIEW                                                     *
 *                                                                         *
 * The DashboardHomeView is the view the user sees when they first log     *
 * into their dashboard. It contains summary information about all their   *
 * activities and obligations.                                             *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Core Requires .................................................... 33   *
 * Module-Specific Requires ......................................... 39   *
 * Module ........................................................... 47   *
 *   Backbone View Properties ....................................... 52   *
 *   Canto View Properties .......... ............................... 59   *
 *     klass                                                               *
 *     family                                                              *
 *     superFamily                                                         *
 *     types                                                               *
 *   Special Functions .............................................. 69   *
 *     renderTaskPanelView() ........................................ 69   *
 *     renderTopWidgetView() ........................................ 74   *
 *     setUser() .................................................... 85   *
 *   Core Functions ................................................. 97   *
 *     initialize() ................................................. 97   *
 *     remove() .................................................... 105   * 
 *     render() .................................................... 111   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/****************************************************************************/

Canto      = Canto || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

/* Module-Specific Requires
/****************************************************************************/

var User          = require('../../models/userModel.js'),
    TopWidgetView = require('./dashboardTopWidgetView.js'),
    TaskPanelView = require('./taskPanelView.js');

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var DashboardHomeView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template         : JST['partials/dashHome'],
  id               : 'page-wrapper',
  className        : 'dashboard-home',

  /* Canto View Properties
  /**************************************************************************/

  klass            : 'DashboardHomeView',
  family           : 'Canto.View',
  superFamily      : 'Backbone.View',
  types            : function() {
    return Canto.View.prototype.types().concat(['DashboardHomeView', 'PartialView']);
  },

  /* Special Functions
  /**************************************************************************/

  renderTaskPanelView : function() {
    this.taskPanelView.render();
    this.$('div.col-lg-6').first().html(this.taskPanelView.$el);
  },

  renderTopWidgetView : function() {
    this.topWidgetView.render();

    // Remove the top widget view if it is already in the DOM in order to 
    // maintain idempotency when using prepend() for DOM insertion

    if($.contains(this.$el, this.topWidgetView.$el)) { this.topWidgetView.remove(); }

    this.$el.prepend(this.topWidgetView.$el);
  },

  setUser             : function(user) {
    this.user       = user;
    this.collection = this.user.tasks;

    // Create view elements
    var that = this;

    this.taskPanelView = new TaskPanelView({collection: this.collection});
    this.topWidgetView    = new TopWidgetView({
      taskCollection: that.user.tasks,
      deadlineCount: 7,
      appointmentCount: 4,
      recommendationCount: 14
    });
  },

  /* Core View Functions
  /**************************************************************************/

  initialize          : function(opts) {
    opts = opts || {};
    if(!!opts.user) {
      this.setUser(opts.user);
    }
  },

  remove              : function() {
    try {
      this.taskPanelView.remove();
      this.topWidgetView.remove();
    } catch(e) {
      if(!(this.taskPanelView && this.topWidgetView)) { return; }
    }

    Canto.View.prototype.remove.call(this);
  },

  render              : function() {
    var that = this;

    return Canto.View.prototype.render.call(this, this.template(), function() {
      that.renderTaskPanelView();
      that.renderTopWidgetView();
    });
  }

});

module.exports = DashboardHomeView;