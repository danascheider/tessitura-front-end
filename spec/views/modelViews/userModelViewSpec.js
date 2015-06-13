require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    fcontext  = fdescribe;

describe('User Model View', function() {
  var view, newView;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 1 : btoa('testuser:testuser');
    });
  
    view = new Tessitura.UserModelView({model: user});
  });

  afterEach(function() {
    user.destroy();
    view.destroy();
  }); 

  afterAll(function() {
    view = null;
    _.omit(global, fixtures);
  });

  describe('constructor', function() {
    it('assigns the model #modelView #view #travis', function() {
      expect(view.model).toBe(user);
    });

    it('does not call render #modelView #view #travis', function() {
      spyOn(Tessitura.UserModelView.prototype, 'render');
      newView = new Tessitura.UserModelView({model: user});
      expect(Tessitura.UserModelView.prototype.render).not.toHaveBeenCalled();
      newView.destroy();
    });
  });

  describe('properties', function() {
    it('is a Tessitura.View #modelView #view #travis', function() {
      expect(view).toBeA('Tessitura.View');
    });

    it('has klass UserModelView #modelView #view #travis', function() {
      expect(view.klass).toBe('UserModelView');
    });

    it('has family Tessitura.View #modelView #view #travis', function() {
      expect(view.family).toBe('Tessitura.View');
    });

    it('has superFamily Backbone.View #modelView #view #travis', function() {
      expect(view.superFamily).toBe('Backbone.View');
    });
  });

  describe('el', function() {
    beforeEach(function() { view.render(); });

    it('is a div #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toEqual('DIV');
    });

    it('has class .user-model #modelView #view #travis', function() {
      expect(view.$el[0]).toHaveClass('user-model');
    });

    it('displays the user\'s name #modelView #view #travis', function() {
      expect(view.$el.html()).toContain('Test User');
    });
  });

  describe('events', function() {
    describe('save model', function() {
      it('calls renderOnSync #modelView #view #travis', function() {
        spyOn(Tessitura.UserModelView.prototype, 'renderOnSync');
        newView = new Tessitura.UserModelView({model: user});
        user.trigger('sync');
        expect(Tessitura.UserModelView.prototype.renderOnSync).toHaveBeenCalled();
        newView.destroy();
      });
    });
  });

  describe('view elements', function() {
    beforeEach(function() { 
      view.render(); 
    });
  });

  describe('special functions', function() {
    describe('isA', function() {
      it('returns true with arg \'UserModelView\' #modelView #view #travis', function() {
        expect(view.isA('UserModelView')).toBe(true);
      });

      it('returns true with arg \'ModelView\' #modelView #view #travis', function() {
        expect(view.isA('ModelView')).toBe(true);
      });

      it('returns true with arg \'UserView\' #modelView #view #travis', function() {
        expect(view.isA('UserView')).toBe(true);
      });

      it('returns false with another string #modelView #view #travis', function() {
        expect(view.isA('TaskCollection')).toBe(false);
      });
    });
  });

  describe('event callbacks', function() {
    describe('renderOnSync', function() {
      beforeEach(function() { spyOn(view, 'render'); });

      it('calls the render function #modelView #view #travis', function() {
        view.renderOnSync();
        expect(view.render).toHaveBeenCalled();
      });
    });
  });

  describe('core view functions', function() {
    describe('render', function() {
      it('sets the HTML of its el #modelView #view #travis', function() {
        spyOn(view.$el, 'html');
        view.render();
        expect(view.$el.html).toHaveBeenCalledWith(view.template({model: user}));
      });

      it('returns itself #modelView #view #travis', function() {
        expect(view.render()).toBe(view);
      });
    });
  });
});