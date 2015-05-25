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
 *   Tessitura View Properties ...................................... --   *
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

/****************************************************************************
 * BEGIN MODULE                                                             *
/****************************************************************************/

var DashboardTaskView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/dashTasks'],
  id          : 'page-wrapper',

  /* Tessitura View Properties
  /**************************************************************************/

  klass       : 'DashboardTaskView',
  family      : 'Tessitura.View',
  superFamily : 'Backbone.View',
  types       : function() {
    return Tessitura.View.prototype.types().concat(['DashboardTaskView']);
  },

  /* Special Functions
  /**************************************************************************/

  addToBacklog      : function(task) {
    this.backlogColumnView.collection.add([task]);
  },

  changeStatus      : function(task) {
    var newCollection = this.findNewCollection(task);
    newCollection.add([task]);
  },

  findNewCollection : function(task) {
    var that   = this,
        status = task.get('status');

    if(task.get('backlog') === true) { return this.backlogColumnView.collection; }

    _.each([that.newColumnView, that.inProgressColumnView, that.blockingColumnView], function(col) {
      if(col.data.headline === status) {
        col.collection = col.collection || new Tessitura.TaskCollection();
        col.collection.add(task);
      }
    });
  },

  removeFromBacklog : function(task) {
    var that = this;

    if(this.backlogColumnView.collection.models.indexOf(task) > -1) {
      this.backlogColumnView.collection.remove(task);
      var newCollection = this.findNewCollection(task);
      newCollection.add([task]);
    }
  },

  setUser : function(user) {
    this.user = user;
  },

  /* Core View Functions
  /**************************************************************************/

  initialize : function(opts) {
    opts = opts || {};

    this.childViews = [];
    if(!!opts.user) { this.setUser(opts.user); }
  },

  remove     : function() {
    if(this.childViews && this.childViews.length) { 
      _.each(this.childViews, function(view) { view.remove(); });
    }

    Tessitura.View.prototype.remove.call(this);
  },

  render     : function() {
    var that = this;

    this.user.tasks.fetch({
      success: function(collection) {
        collection = new Tessitura.TaskCollection(collection.models);

        that.backlogColumnView = new Tessitura.KanbanColumnView({
          el         : that.$('#backlog-tasks'),
          collection : new Tessitura.TaskCollection(collection.where({backlog: true})),
          color      : 'red',
          icon       : 'fa-exclamation-circle',
          headline   : 'Backlog'
        });

        collection.remove(that.backlogColumnView.collection.models);

        that.newColumnView = new Tessitura.KanbanColumnView({
          el         : that.$('#new-tasks'),
          collection : new Tessitura.TaskCollection(collection.where({status: 'New'})),
          color      : 'blue',
          icon       : 'fa-certificate',
          headline   : 'New'
        });

        that.inProgressColumnView = new Tessitura.KanbanColumnView({
          el         : that.$('#in-progress-tasks'),
          collection : new Tessitura.TaskCollection(collection.where({status: 'In Progress'})),
          color      : 'green',
          icon       : 'fa-road',
          headline   : 'In Progress'
        });

        that.blockingColumnView = new Tessitura.KanbanColumnView({
          el         : that.$('#blocking-tasks'),
          collection : new Tessitura.TaskCollection(collection.where({status: 'Blocking'})),
          color      : 'yellow',
          icon       : 'fa-minus-circle',
          headline   : 'Blocking'
        });

        that.childViews.push(that.backlogColumnView);
        that.childViews.push(that.newColumnView);
        that.childViews.push(that.inProgressColumnView);
        that.childViews.push(that.blockingColumnView);

        _.each(that.childViews, function(col) {
          col.render();
        });

        that.listenTo(that.backlogColumnView.collection, 'change:backlog', that.removeFromBacklog);
        that.listenTo(that.newColumnView.collection, 'change:status', that.changeStatus);
        that.listenTo(that.inProgressColumnView.collection, 'change:status', that.changeStatus);
        that.listenTo(that.blockingColumnView.collection, 'change:status', that.changeStatus);
        that.listenTo(that.newColumnView.collection, 'change:backlog', that.addToBacklog);
        that.listenTo(that.inProgressColumnView.collection, 'change:backlog', that.addToBacklog);
        that.listenTo(that.blockingColumnView.collection, 'change:backlog', that.addToBacklog);
      }
    });

    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = DashboardTaskView