/***************************************************************************
 *                                                                         *
 * DASHBOARD TASK VIEW                                                     *
 *                                                                         *
 * The dashboard task view is the page that shows detailed information     *
 * about the user's tasks. Currently, it takes the form of a Kanban        *
 * board, but I'm considering other possibilities as well.                 *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Core Requires .................................................... 84   *
 * Module ........................................................... 91   *
 *   Backbone View Properties ....................................... 96   *
 *     template ..................................................... 96   *
 *     id ........................................................... 97   *
 *   Canto View Properties .......................................... --   *
 *     klass ........................................................ --   *
 *     family ....................................................... --   *
 *     superFamily .................................................. --   *
 *     types ........................................................ --   *
 *   View Events .................................................... --   *
 *     click $el .................................................... --   *
 *     click li.dropdown ............................................ --   *
 *   Event Callbacks ................................................ --   *
 *     hideDropdownMenus() .......................................... --   *
 *       when no menus are open .................................... ---   *
 *       when a menu is visible .................................... ---   *
 *       when the clicked-on object is inside the menu ............. ---   *
 *     toggleDropdownMenu() ........................................ ---   *
 *       when none of the menus is open ............................ ---   *
 *         adds the .open class to the target menu ................. ---   *
 *         doesn't add the .open class to the other menus .......... ---   *
 *       when another menu is open ................................. ---   *
 *         removes the .open class from the open menu .............. ---   *
 *         adds the .open class to the target menu ................. ---   *
 *       when the target menu is open .............................. ---   *
 *         removes the .open class from the target menu ............ ---   *
 *         doesn't open any other menus ............................ ---   *
 *     showHomeView() .............................................. ---   *
 *       when the main dash and home view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         renders the home view ................................... ---   *
 *         attaches the home view to the DOM ....................... ---   *
 *       when the main dash and task view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         removes the task view ................................... ---   *
 *         renders the home view ................................... ---   *
 *         attaches the home view to the DOM ....................... ---   *
 *       when the main dash isn't visible .......................... ---   *
 *         renders the main dash view .............................. ---   *
 *         renders the home view ................................... ---   *
 *         attaches the home view to the DOM ....................... ---   *
 *     showTaskView() .............................................. ---   *
 *       when the main dash and home view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         removes the home view ................................... ---   *
 *         renders the task view ................................... ---   *
 *         attaches the task view to the DOM ....................... ---   *
 *       when the main dash and task view are visible .............. ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         renders the task view ................................... ---   *
 *         attaches the task view to the DOM ....................... ---   *
 *       when the main dash isn't visible .......................... ---   *
 *         doesn't re-render the main dash ......................... ---   *
 *         renders the task view ................................... ---   *
 *         attaches the task view to the DOM ....................... ---   *
 *   Special Functions .............................................. 97   *
 *     initialize() ................................................. --   *
 *     remove() .................................................... 105   *
 *     render() ..................................................... 97   *
 *   Special Functions .............................................. 69   *
 *     isA() ....................................................... ---   *
 *       returns true with argument DashboardTaskView .............. ---   *
 *       returns false with another argument ....................... ---   *
 *     setUser() .................................................... 69   *
 *       sets this.user ............................................ ---   *
 *       calls setUser on the home view ............................ ---   *
 *       calls setUser on the task view ............................ ---   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/***************************************************************************/

Canto      = Canto      || require('../../dependencies.js');
Canto.View = Canto.View || require('../appViews/cantoView.js');

/* Module-Specific Requires
/***************************************************************************/

var KanbanColumnView = require('./kanbanColumnView.js'),
    TaskCollection   = require('../../collections/taskCollection.js');

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var DashboardTaskView = Canto.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/dashTasks'],
  id          : 'page-wrapper',

  /* Canto View Properties
  /**************************************************************************/

  klass       : 'DashboardTaskView',
  family      : 'Canto.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Canto.View.prototype.types().concat(['DashboardTaskView']);
  },

  /* Special Functions
  /**************************************************************************/

  setUser : function(user) {
    this.user = user;
  },

  /* Core View Functions
  /**************************************************************************/

  initialize : function(opts) {
    opts = opts || {};

    if(!!opts.user) { this.setUser(opts.user); }
  },

  remove     : function() {
    if(!!this.backlogColumnView)    { this.backlogColumnView.remove();    }
    if(!!this.newColumnView)        { this.newColumnView.remove();        }
    if(!!this.inProgressColumnView) { this.inProgressColumnView.remove(); }
    if(!!this.blockingColumnView)   { this.blockingColumnView.remove();   }
    
    Canto.View.prototype.remove.call(this);
  },

  render     : function() {
    var that = this;

    this.user.tasks.fetch({
      success: function(collection) {
        collection = new TaskCollection(collection);

        that.backlogColumnView = new KanbanColumnView({
          el         : that.$('#backlog-tasks'),
          collection : new TaskCollection(collection.where({backlog: true})),
          color      : 'red',
          icon       : 'fa-exclamation-circle',
          headline   : 'Backlog'
        });

        collection.remove(that.backlogColumnView.collection.models);

        that.newColumnView = new KanbanColumnView({
          el         : that.$('#new-tasks'),
          collection : new TaskCollection(collection.where({status: 'New'})),
          color      : 'blue',
          icon       : 'fa-certificate',
          headline   : 'New'
        });

        that.inProgressColumnView = new KanbanColumnView({
          el         : that.$('#in-progress-tasks'),
          collection : new TaskCollection(collection.where({status: 'In Progress'})),
          color      : 'green',
          icon       : 'fa-road',
          headline   : 'In Progress'
        });

        that.blockingColumnView = new KanbanColumnView({
          el         : that.$('#blocking-tasks'),
          collection : new TaskCollection(collection.where({status: 'Blocking'})),
          color      : 'yellow',
          icon       : 'fa-minus-circle',
          headline   : 'Blocking'
        });

        _.each([that.backlogColumnView, that.newColumnView, that.inProgressColumnView, that.blockingColumnView], function(col) {
          col.render();
        });
      }
    });

    return Canto.View.prototype.render.call(this, this.template());
  }
});

module.exports = DashboardTaskView