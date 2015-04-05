require(process.cwd() + '/js/dependencies.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

Canto.View         = require(process.cwd() + '/js/views/appViews/cantoView.js');

var custom         = require(process.cwd() + '/spec/support/matchers/toBeA.js'),
    context        = describe,
    fcontext       = fdescribe;

Backbone.$         = $;

describe('Canto.View', function() {
  var view;

  beforeEach(function() {
    view = new Canto.View();
  });

  afterAll(function() {
    view = null;
  });

  describe('properties', function() {
    it('has klass Canto.View', function() {
      expect(view.klass).toEqual('Canto.View');
    });

    it('has family Backbone.View', function() {
      expect(view.family).toEqual('Backbone.View');
    });

    it('has blank superFamily', function() {
      expect(view.superFamily).toEqual('');
    });
  });

  describe('types', function() {
    it('includes Backbone.View', function() {
      expect(view.types()).toContain('Backbone.View');
    });

    it('includes Canto.View', function() {
      expect(view.types()).toContain('Canto.View');
    });
  });

  describe('isA', function() {
    it('returns true with argument Backbone.View', function() {
      expect(view.isA('Backbone.View')).toBe(true);
    });

    it('returns true with argument Canto.View', function() {
      expect(view.isA('Canto.View')).toBe(true);
    });

    it('returns false with another argument', function() {
      expect(view.isA('Corvette')).toBe(false);
    });
  });

  describe('render', function() {
    beforeEach(function() {
      view.helloWorld = function() { console.log('Hello World!'); };
      spyOn(view, 'helloWorld');
    });

    it('sets the html of its el with code passed into it', function() {
      view.render('<div id="inner-html"></div>', view.helloWorld);
      expect(view.$el.html()).toEqual('<div id="inner-html"></div>');
    });

    it('calls delegateEvents on itself', function() {
      spyOn(view, 'delegateEvents');
      view.render('<div></div>', view.helloWorld);
      expect(view.delegateEvents).toHaveBeenCalled();
    });

    it('executes an arbitrary function', function() {
      view.render('<div></div>', view.helloWorld);
      expect(view.helloWorld).toHaveBeenCalled();
    });

    it('returns itself', function() {
      expect(view.render('<div></div>', view.helloWorld)).toBe(view);
    });
  });

  describe('inheritance', function() {
    var ChildClass;

    beforeEach(function() { 
      ChildClass = Canto.View.extend({
        tagName    : 'span',
        template   : _.template('<p>Hello, <%= recipient %>!</p>'),
        setMessage : function(message) {
          this.$el.append('<p>' + message + '</p>');
        },
        render     : function() {
          var that = this;

          return Canto.View.prototype.render.call(this, this.template({recipient: 'world'}), function(args) {
            return that.setMessage(args)
          }, 'Hope you\'re doing well today!');
        }
      }); 
    });
    afterAll(function() { ChildClass = null; });

    it('inherits its types', function() {
      var newView = new ChildClass();
      expect(newView.isA('Canto.View')).toBe(true);
    });

    describe('render', function() {
      var newView;

      beforeEach(function() {
        newView = new ChildClass();
      });

      it('sets its el\'s HTML', function() {
        spyOn(newView.$el, 'html');
        newView.render();
        expect(newView.$el.html).toHaveBeenCalledWith('<p>Hello, world!</p>');
      });

      it('calls setMessage with the message', function() {
        spyOn(newView, 'setMessage');
        newView.render();
        expect(newView.setMessage).toHaveBeenCalledWith('Hope you\'re doing well today!');
      });

      it('returns itself', function() {
        expect(newView.render()).toBe(newView);
      });
    });
  });
});