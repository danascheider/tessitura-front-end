define([
  'jquery', 
  'underscore',
  'backbone',
  'css!lib/mocha/mocha.css',
], function($, _, Backbone) {

  var SpecRunner = Backbone.View.extend({
    template  : _.template("<div id='mocha'></div>"),

    initialize: function() {
      this.render();
    },


    render: function() {
      this.runSpecs();
      this.$el.html(this.template());
    },

    runSpecs: function() {
      require(['require', 'chai', 'api', 'mocha', 'jquery', 'chai-jquery', 'sinon'], function(require, chai, API) {
        if (API.base.match(/localhost/)) { throw 'Connect to test API' }

        var should = chai.should();
        mocha.setup('bdd');

        require(['spec/userSpec', 'spec/taskSpec', 'spec/appPresenterSpec'], function(require) {
          mocha.run();
        });
      });
    }
  });

  return SpecRunner;
});