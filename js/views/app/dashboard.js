define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/app/dashboard.html',
  ], function($, _, Backbone, DashboardTemplate) {
  
  var DashboardView = Backbone.View.extend({
    el     : $('#wrapper'),

    events : {
      'click body'               : 'hideDropdownMenus',
      'click navbar-top-links a' : 'toggleDropdownMenu',
      'click a.dropdown-toggle'  : 'blurParentLi'
    },

    blurParentLi: function() {
      if($(this).parent('li').is(':visible')) {
        $(this).parent('li').blur();
      }
    },

    render: function() {
      var data = {};
      var compiledTemplate = _.template(DashboardTemplate, data);
      this.$el.html(compiledTemplate);
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
    }
  })
});