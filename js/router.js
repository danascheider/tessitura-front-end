define([
  'jquery', 
  'underscore', 
  'backbone', 
  'views/tasks/collection',
  'views/task-lists/collection',
  'views/users/collection'
  ], function($, _, Backbone, TaskCollectionView, TaskListCollectionView, UserCollectionView) {
  
  var CantoRouter = Backbone.Router.extend({
    routes: {
      '/users'     : 'listUsers',
      '/tasks'     : 'listTasks',
      '/task-lists': 'listTaskLists',
      '*actions'   : 'defaultAction'
    }
  });

  var initialize = function() {
    var cantoRouter = new CantoRouter;
    cantoRouter.on('listUsers', function() {
      var userCollectionView = new UserCollectionView();
      userCollectionView.render();
    });

    cantoRouter.on('listTasks', function() {
      var taskCollectionView = new TaskCollectionView();
      taskCollectionView.render();
    });

    cantoRouter.on('listTaskLists', function() {
      var taskListCollectionView = new TaskListCollectionView();
      taskListCollectionView.render();
    });

    cantoRouter.on('defaultAction', function(actions) {
      console.log('No route: ', actions);
    });

    Backbone.history.start();
  }

  return {
    initialize: initialize
  };
});