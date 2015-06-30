Tessitura.DashboardTaskView = Tessitura.View.extend({

  /* Backbone View Properties
  /**************************************************************************/

  template    : JST['partials/dashTasks'],
  id          : 'page-wrapper',

  /* Special Functions
  /**************************************************************************/

  allocate          : function(task) {
    var newView = this.findNewCollection(task);
    newView.models.unshift(task);
    newView.render();
  },

  changeStatus      : function(task) {
    if(task.get('status') === 'Complete') { this.collection.remove(task); }
    
    var newCollection = this.findNewCollection(task) || new Tessitura.TaskCollection();
    newCollection.models.push([task]);
  },

  findNewCollection : function(task) {
    var that   = this,
        status = task.get('status'),
        view;

    if(task.get('backlog') === true) { 
      return this.backlogColumnView; 
    }

    _.each([that.newColumnView, that.inProgressColumnView, that.blockingColumnView], function(col) {
      if(col.headline === status) { view = col; }
    });

    return view;
  },

  changeBacklog : function(task) {
    this.render();
  },

  removeAndRender: function(task) {
    var view = this.findNewCollection(task);
    view.models.splice(view.models.indexOf(task), 1);
    view.render();
  },

  setUser : function(user) {
    this.user = user;
    this.user.tasks = this.user.tasks || new Tessitura.TaskCollection();
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
        that.backlogColumnView = new Tessitura.KanbanColumnView({
          collection : that.user.tasks,
          el         : that.$('#backlog-tasks'),
          models     : that.user.tasks.where({backlog: true}),
          color      : 'red',
          icon       : 'fa-exclamation-circle',
          headline   : 'Backlog',
          groupedBy  : {backlog: true}
        });

        that.newColumnView = new Tessitura.KanbanColumnView({
          collection : that.user.tasks,
          el         : that.$('#new-tasks'),
          models     : that.user.tasks.where({status: 'New'}),
          color      : 'blue',
          icon       : 'fa-certificate',
          headline   : 'New',
          groupedBy  : {status: 'New'}
        });

        that.inProgressColumnView = new Tessitura.KanbanColumnView({
          collection : that.user.tasks,
          el         : that.$('#in-progress-tasks'),
          models     : that.user.tasks.where({status: 'In Progress'}),
          color      : 'green',
          icon       : 'fa-road',
          headline   : 'In Progress',
          groupedBy  : {status: 'In Progress'}
        });

        that.blockingColumnView = new Tessitura.KanbanColumnView({
          collection : that.user.tasks,
          el         : that.$('#blocking-tasks'),
          models     : that.user.tasks.where({status: 'Blocking'}),
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
        });

        that.listenTo(that.user.tasks, 'change:backlog', that.changeBacklog);
        that.listenTo(that.user.tasks, 'change:status', that.changeStatus);
        that.listenTo(that.user.tasks, 'remove', that.renderOnRemove);
        that.listenTo(that.user.tasks, 'add', that.allocate);
        that.listenTo(that.user.tasks, 'remove', that.removeAndRender);
      }
    });

    return Tessitura.View.prototype.render.call(this, this.template());
  }
});

module.exports = Tessitura.DashboardTaskView