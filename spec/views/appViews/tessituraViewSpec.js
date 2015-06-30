require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var context        = describe,
    fcontext       = fdescribe;

describe('Tessitura.View', function() {
  var view;

  beforeEach(function() { view = new Tessitura.View(); });
  afterEach(function()  { view.destroy(); });
  afterAll(function()   { view = null; });

  describe('types', function() {
    it('includes Backbone.View #appView #view #travis', function() {
      expect(view.types()).toContain('Backbone.View');
    });

    it('includes Tessitura.View #appView #view #travis', function() {
      expect(view.types()).toContain('Tessitura.View');
    });
  });

  describe('isA', function() {
    it('returns true with argument Backbone.View #appView #view #travis', function() {
      expect(view.isA('Backbone.View')).toBe(true);
    });

    it('returns true with argument Tessitura.View #appView #view #travis', function() {
      expect(view.isA('Tessitura.View')).toBe(true);
    });

    it('returns false with another argument #appView #view #travis', function() {
      expect(view.isA('Corvette')).toBe(false);
    });
  });

  describe('render', function() {
    beforeEach(function() {
      view.helloWorld = function() { console.log('Hello World!'); };
      spyOn(view, 'helloWorld');
    });

    it('sets the html of its el with code passed into it #appView #view #travis', function() {
      view.render('<div id="inner-html"></div>', view.helloWorld);
      expect(view.$el.html()).toEqual('<div id="inner-html"></div>');
    });

    it('calls delegateEvents on itself #appView #view #travis', function() {
      spyOn(view, 'delegateEvents');
      view.render('<div></div>', view.helloWorld);
      expect(view.delegateEvents).toHaveBeenCalled();
    });

    it('executes an arbitrary function #appView #view #travis', function() {
      view.render('<div></div>', view.helloWorld);
      expect(view.helloWorld).toHaveBeenCalled();
    });

    it('returns itself #appView #view #travis', function() {
      expect(view.render('<div></div>', view.helloWorld)).toBe(view);
    });
  });

  describe('inheritance', function() {
    var ChildClass;

    beforeEach(function() { 
      ChildClass = Tessitura.View.extend({
        tagName    : 'span',
        template   : _.template('<p>Hello, <%= recipient %>!</p>'),
        setMessage : function(message) {
          this.$el.append('<p>' + message + '</p>');
        },
        initialize : function() {
        },
        render     : function() {
          var that = this;

          return Tessitura.View.prototype.render.call(this, this.template({recipient: 'world'}), function(args) {
            return that.setMessage(args)
          }, 'Hope you\'re doing well today!');
        }
      }); 
    });

    afterAll(function() { ChildClass = null; });

    it('inherits its types #appView #view #travis', function() {
      var newView = new ChildClass();
      expect(newView.isA('Tessitura.View')).toBe(true);
    });

    describe('render', function() {
      var newView;

      beforeEach(function() {
        newView = new ChildClass();
      });

      // it('sets its el\'s HTML #appView #view #travis', function() {
      //   newView.render();
      //   expect(newView.$el.html()).toEqual('<p>Hello, world!</p>');
      // });

      it('calls setMessage with the message #appView #view #travis', function() {
        spyOn(newView, 'setMessage');
        newView.render();
        expect(newView.setMessage).toHaveBeenCalledWith('Hope you\'re doing well today!');
      });

      it('returns itself #appView #view #travis', function() {
        expect(newView.render()).toBe(newView);
      });
    });
  });
});