define([
  'jquery', 
  'underscore',
  'backbone',
  'css!lib/mocha/mocha.css'
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
      require(['require', 'chai', 'mocha', 'jquery', 'chai-jquery', 'sinon'], function(require, chai) {
        var should = chai.should();
        mocha.setup('bdd');

        require(['spec/userSpec'], function(require) {
          mocha.run();
        });
      });
    }
  });

  return SpecRunner;
});