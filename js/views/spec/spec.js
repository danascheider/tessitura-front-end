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
      require([
        'require', 'chai', 'sinon-chai', 'api', 'chai-backbone', 'mocha', 'jquery'
        ], function(require, Chai, sinonChai, API, chaiBackbone) {

        if (API.base.match(/localhost/)) { throw 'Connect to test API' }

        var should = Chai.should();
        Chai.use(chaiBackbone);
        mocha.setup('bdd');

        require(['spec/specHelper'], function(require) {
          mocha.run();
        });
      });
    }
  });

  return SpecRunner;
});