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
    it('#travis has klass Canto.View', function() {
      expect(view.klass).toEqual('Canto.View');
    });

    it('#travis has family Backbone.View', function() {
      expect(view.family).toEqual('Backbone.View');
    });

    it('#travis has blank superFamily', function() {
      expect(view.superFamily).toEqual('');
    });
  });

  describe('types', function() {
    it('#travis includes Backbone.View', function() {
      expect(view.types()).toContain('Backbone.View');
    });

    it('#travis includes Canto.View', function() {
      expect(view.types()).toContain('Canto.View');
    });
  });

  describe('isA', function() {
    it('#travis returns true with argument Backbone.View', function() {
      expect(view.isA('Backbone.View')).toBe(true);
    });

    it('#travis returns true with argument Canto.View', function() {
      expect(view.isA('Canto.View')).toBe(true);
    });

    it('#travis returns false with another argument', function() {
      expect(view.isA('Corvette')).toBe(false);
    });
  });

  describe('render', function() {
    beforeEach(function() {
      view.helloWorld = function() { console.log('Hello World!'); };
      spyOn(view, 'helloWorld');
    });

    it('#travis sets the html of its el with code passed into it', function() {
      view.render('<div id="inner-html"></div>', view.helloWorld);
      expect(view.$el.html()).toEqual('<div id="inner-html"></div>');
    });

    it('#travis calls delegateEvents on itself', function() {
      spyOn(view, 'delegateEvents');
      view.render('<div></div>', view.helloWorld);
      expect(view.delegateEvents).toHaveBeenCalled();
    });

    it('#travis executes an arbitrary function', function() {
      view.render('<div></div>', view.helloWorld);
      expect(view.helloWorld).toHaveBeenCalled();
    });

    it('#travis returns itself', function() {
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

    it('#travis inherits its types', function() {
      var newView = new ChildClass();
      expect(newView.isA('Canto.View')).toBe(true);
    });

    describe('render', function() {
      var newView;

      beforeEach(function() {
        newView = new ChildClass();
      });

      it('#travis sets its el\'s HTML', function() {
        spyOn(newView.$el, 'html');
        newView.render();
        expect(newView.$el.html).toHaveBeenCalledWith('<p>Hello, world!</p>');
      });

      it('#travis calls setMessage with the message', function() {
        spyOn(newView, 'setMessage');
        newView.render();
        expect(newView.setMessage).toHaveBeenCalledWith('Hope you\'re doing well today!');
      });

      it('#travis returns itself', function() {
        expect(newView.render()).toBe(newView);
      });
    });
  });
});