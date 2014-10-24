define([
  'jquery',
  'underscore',
  'backbone',
  'views/tasks/task-panel',
  'text!templates/app/dashboard.html',
  'text!templates/tasks/create-form.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function(
    $, _, 
    Backbone, 
    TaskPanelView,
    DashboardTemplate, 
    EmptyTaskPanelTemplate,
    TaskCreateFormTemplate,
    BootstrapStyles, 
    DashStyles, 
    CantoStyles, 
    FAStyles) {
  
  var DashboardView = Backbone.View.extend({

    // Core View Attributes //

    el       : $('body'),

    events   : {
      'click body'                : 'hideDropdownMenus',
      'click navbar-top-links a'  : 'toggleDropdownMenu',
      'click a.dropdown-toggle'   : 'blurParentLi',
      'click ul#side-menu li a'   : 'toggleSecondLevelNav'
    },

    template : _.template(DashboardTemplate),

    // Event Callbacks // 

    blurParentLi: function() {
      if($(this).parent('li').is(':visible')) {
        $(this).parent('li').blur();
      }
    },

    hideDropdownMenus: function(e) {
      var menu = $('.dropdown-menu');
      if(!menu.is(e.target) && menu.has(e.target).length === 0) {
        menu.hide();
      }
    },

    toggleDropdownMenu: function(e) {
      $.each($(this).parent('li').siblings(), function() {
        if ($(this).find('.dropdown-menu').is(':visible')) {
          $(this).find('.dropdown-menu').hide();
        }
      });
      $(this).parent('li').find('.dropdown-menu').toggle();
    },

    toggleSecondLevelNav: function(e) {
      e.preventDefault();
      var li = $(e.target).parent('li');

      li.toggleClass('active');

      if (li.hasClass('active')) {

        // Only one li can be active at a time.

        li.siblings('li').removeClass('active');
        li.siblings('li').find('ul.nav').slideUp();
      } else {

        // When the li is no longer active, its children should not
        // be active, either.

        li.find('li.active').removeClass('active');
      }

      li.children('ul.nav').slideToggle();

      // Stop the menu from immediately sliding up again.
      e.stopPropagation();
    },

    // Core View Methods //

    initialize: function(options) {
      this.options = options || {};
    },

    render: function() {
      $('body').attr('id', 'dashboard');
      var html = this.template({user: this.options.user});
      this.$el.append(html);
      var taskPanel = new TaskPanelView({el: this.$('#task-panel')});
      taskPanel.render();
      return this;
    }
  });

  return DashboardView;
});