require(process.cwd() + '/js/canto.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var context        = describe,
    fcontext       = fdescribe;

describe('Canto.View', function() {
  var view;

  beforeEach(function() {
    view = new Canto.View();
  });

  afterEach(function() {
    view.remove();
  })

  afterAll(function() {
    view = null;
  });

  describe('properties', function() {
    it('has klass Canto.View #travis', function() {
      expect(view.klass).toEqual('Canto.View');
    });

    it('has family Backbone.View #travis', function() {
      expect(view.family).toEqual('Backbone.View');
    });

    it('has blank superFamily #travis', function() {
      expect(view.superFamily).toEqual('');
    });
  });

  describe('types', function() {
    it('includes Backbone.View #travis', function() {
      expect(view.types()).toContain('Backbone.View');
    });

    it('includes Canto.View #travis', function() {
      expect(view.types()).toContain('Canto.View');
    });
  });

  describe('isA', function() {
    it('returns true with argument Backbone.View #travis', function() {
      expect(view.isA('Backbone.View')).toBe(true);
    });

    it('returns true with argument Canto.View #travis', function() {
      expect(view.isA('Canto.View')).toBe(true);
    });

    it('returns false with another argument #travis', function() {
      expect(view.isA('Corvette')).toBe(false);
    });
  });

  describe('render', function() {
    beforeEach(function() {
      view.helloWorld = function() { console.log('Hello World!'); };
      spyOn(view, 'helloWorld');
    });

    it('sets the html of its el with code passed into it #travis', function() {
      view.render('<div id="inner-html"></div>', view.helloWorld);
      expect(view.$el.html()).toEqual('<div id="inner-html"></div>');
    });

    it('calls delegateEvents on itself #travis', function() {
      spyOn(view, 'delegateEvents');
      view.render('<div></div>', view.helloWorld);
      expect(view.delegateEvents).toHaveBeenCalled();
    });

    it('executes an arbitrary function #travis', function() {
      view.render('<div></div>', view.helloWorld);
      expect(view.helloWorld).toHaveBeenCalled();
    });

    it('returns itself #travis', function() {
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

    it('inherits its types #travis', function() {
      var newView = new ChildClass();
      expect(newView.isA('Canto.View')).toBe(true);
    });

    describe('render', function() {
      var newView;

      beforeEach(function() {
        newView = new ChildClass();
      });

      it('sets its el\'s HTML #travis', function() {
        spyOn(newView.$el, 'html');
        newView.render();
        expect(newView.$el.html).toHaveBeenCalledWith('<p>Hello, world!</p>');
      });

      it('calls setMessage with the message #travis', function() {
        spyOn(newView, 'setMessage');
        newView.render();
        expect(newView.setMessage).toHaveBeenCalledWith('Hope you\'re doing well today!');
      });

      it('returns itself #travis', function() {
        expect(newView.render()).toBe(newView);
      });
    });
  });
});