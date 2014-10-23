define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/app/dashboard.html',
  'css!stylesheets/bootstrap.css',
  'css!stylesheets/dashboard.css',
  'css!stylesheets/canto.css',
  'css!stylesheets/font-awesome.css'
  ], function($, _, Backbone, DashboardTemplate, BootstrapStyles, DashStyles, CantoStyles, FAStyles) {
  
  var DashboardView = Backbone.View.extend({
    el     : $('body'),

    events : {
      'click body'                : 'hideDropdownMenus',
      'click navbar-top-links a'  : 'toggleDropdownMenu',
      'click a.dropdown-toggle'   : 'blurParentLi',
      'click ul#side-menu li a'   : 'toggleSecondLevelNav'
    },

    blurParentLi: function() {
      if($(this).parent('li').is(':visible')) {
        $(this).parent('li').blur();
      }
    },

    initialize: function(router) {
      this.router = router;
    },

    render: function() {
      this.$el.html(_.template(DashboardTemplate));
      return this;
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
        li.siblings('li').removeClass('active');
        li.siblings('li').find('ul.nav').slideUp();
      }

      li.children('ul.nav').slideToggle();
    }
  });

  return DashboardView;
});