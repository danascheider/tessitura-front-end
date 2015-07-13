Tessitura.DashboardTaskView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************************/

  template          : JST['partials/dashTasks'],
  id                : 'page-wrapper',
  className         : 'dashboard-tasks',

  /* Event Callbacks
  /**************************************************************************************/

  showTaskCreateForm: function(collection, opts) {
    this.trigger('showTaskCreateForm', collection, opts);
  },

  showEditForm      : function(task) {
    this.trigger('showEditForm', task);
  },

  /* Special Functions
  /**************************************************************************************/

  allocate          : function(task) {
    var newView = this.findNewView(task);
    newView.collection.add(task);
  },

  changeStatus      : function(task) {
    var that = this;
    if(task.get('status') !== 'Complete') {
      var newView =  this.findNewView(task);

      /* istanbul ignore else */
      if (newView.collection) { 
        newView.collection.add([task]); 
      }
    }
  },

  findNewView       : function(task) {
    var that   = this,
        status = task.get('status'),
        view;

    /* istanbul ignore if */
    if(task.get('backlog') === true) { 
      return this.backlogColumnView; 
    }

    _.each([that.newColumnView, that.inProgressColumnView, that.blockingColumnView], function(col) {
    /* istanbul ignore if */
      if(col.headline === status) { view = col; }
    });

    return view;
  },

  setUser : function(user) {
    this.user = user;
    this.collection = this.user.tasks || /* istanbul ignore next */ new Tessitura.TaskCollection();
    var collections = {
      newCollection        : new Tessitura.TaskCollection(this.collection.where({status: 'New'})),
      inProgressCollection : new Tessitura.TaskCollection(this.collection.where({status: 'In Progress'})),
      blockingCollection   : new Tessitura.TaskCollection(this.collection.where({status: 'Blocking'})),
      backlogCollection    : new Tessitura.TaskCollection(this.collection.where({backlog: true}))
    };

    this.collection.setChildren(collections);
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

    this.collection.fetch({
      success: function(collection) {
        that.backlogColumnView = new Tessitura.KanbanColumnView({
          collection : that.collection.children.backlogCollection,
          el         : that.$('#backlog-tasks'),
          color      : 'red',
          icon       : 'fa-exclamation-circle',
          headline   : 'Backlog',
          groupedBy  : {backlog: true}
        });

        that.newColumnView = new Tessitura.KanbanColumnView({
          collection : that.collection.children.newCollection,
          el         : that.$('#new-tasks'),
          color      : 'blue',
          icon       : 'fa-certificate',
          headline   : 'New',
          groupedBy  : {status: 'New'}
        });

        that.inProgressColumnView = new Tessitura.KanbanColumnView({
          collection : that.collection.children.inProgressCollection,
          el         : that.$('#in-progress-tasks'),
          color      : 'green',
          icon       : 'fa-road',
          headline   : 'In Progress',
          groupedBy  : {status: 'In Progress'}
        });

        that.blockingColumnView = new Tessitura.KanbanColumnView({
          collection : that.collection.children.blockingCollection,
          el         : that.$('#blocking-tasks'),
          color      : 'yellow',
          icon       : 'fa-minus-circle',
          headline   : 'Blocking',
          groupedBy  : {status: 'Blocking'}
        });

        that.childViews.push(that.backlogColumnView);
        that.childViews.push(that.newColumnView);
        that.childViews.push(that.inProgressColumnView);
        that.childViews.push(that.blockingColumnView);

        _.each(that.childViews, function(col) {
          col.render();
          that.listenTo(col, 'showEditForm', that.showEditForm);
          that.listenTo(col, 'showTaskCreateForm', that.showTaskCreateForm);
        });

        that.listenTo(that.collection, 'change:status', that.changeStatus);
        that.listenTo(that.collection, 'change:backlog add', that.allocate);
      }
    });

    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.DashboardTaskView;