/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = _.extend(require('jasmine-jquery-matchers'), require(process.cwd() + '/spec/support/matchers/toBeA.js')),
    fixtures       = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context        = describe,
    fcontext       = fdescribe;

/* Dashboard Profile View Spec
/****************************************************************************/

describe('Tessitura.DashboardProfileView', function() {
  var view;

  /* Filters
  /**************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  })

  beforeEach(function() {
    view = new Tessitura.DashboardProfileView();
  });

  afterEach(function() {
    restoreFixtures();
  });

  afterAll(function() {
    view.remove();
    view = null;
    global = _.omit(global, fixtures);
  });

  /* Static Properties
  /**************************************************************************/

  describe('properties', function() {
    it('has klass DashboardProfileView #partialView #view #travis', function() {
      expect(view.klass).toEqual('DashboardProfileView');
    });

    it('has family Tessitura.View #partialView #view #travis', function() {
      expect(view.family).toEqual('Tessitura.View');
    });

    it('has superFamily Backbone.View #partialView #view #travis', function() {
      expect(view.superFamily).toEqual('Backbone.View');
    });
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardProfileView.prototype, 'render');
      var newView = new Tessitura.DashboardProfileView();
      expect(Tessitura.DashboardProfileView.prototype.render).not.toHaveBeenCalled();
    });

    it('calls setUser if a user is given #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardProfileView.prototype, 'setUser');
      var newView = new Tessitura.DashboardProfileView({model: user});
      expect(Tessitura.DashboardProfileView.prototype.setUser).toHaveBeenCalled();
    });

    it('doesn\'t call setUser if no user is given #partialView #view #travis', function() {
      spyOn(Tessitura.DashboardProfileView.prototype, 'setUser');
      var newView = new Tessitura.DashboardProfileView();
      expect(Tessitura.DashboardProfileView.prototype.setUser).not.toHaveBeenCalled();
    });
  });

  /* Elements
  /**************************************************************************/

  describe('view elements', function() {
    beforeEach(function() { 
      view.setUser(user).render(); 
    });

    it('has ID #page-wrapper #partialView #view #travis', function() {
      expect(view.$el[0].id).toEqual('page-wrapper');
    });

    it('has class .user-profile #partialView #view #travis', function() {
      expect(view.$el[0].className).toEqual('user-profile');
    });
  });

  /* Event Wiring
  /**************************************************************************/

  describe('view events', function() {
    describe('click', function() {
      it('calls hideInputs #partialView #view #travis', function() {
        spyOn(Tessitura.DashboardProfileView.prototype, 'hideInputs');
        newView = new Tessitura.DashboardProfileView({model: user});
        newView.$el.click();
        expect(Tessitura.DashboardProfileView.prototype.hideInputs).toHaveBeenCalled();
      });
    });
  });

  /* Event Callbacks
  /**************************************************************************/

  describe('event callbacks', function() {
    describe('hideInputs', function() {
      beforeEach(function() { 
        view.setUser(user); 
        spyOn(view.profileView, 'hideInputs');
      });

      context('when the target is not an input', function() {
        beforeEach(function() {
          spyOn($.prototype, 'is').and.returnValue(false);
          e = $.Event('click', {target: view.$('#profile-info')});
        });

        it('calls hideInputs on its model view #partialView #view #travis', function() {
          view.hideInputs(e);
          expect(view.profileView.hideInputs).toHaveBeenCalled();
        });
      });

      context('when the target is an input', function() {
        beforeEach(function() {
          spyOn($.prototype, 'is').and.returnValue(true);
          e = $.Event('click', {target: view.$('input')});
        });

        it('doesn\'t call hideInputs on its model view #partialView #view #travis', function() {
          view.hideInputs(e);
          expect(view.profileView.hideInputs).not.toHaveBeenCalled();
        });
      });
    });
  });

  /* Core View Functions
  /**************************************************************************/

  describe('core view functions', function() {
    describe('render()', function() {
      beforeEach(function() {
        view.setUser(user);
      });

      it('renders its model view', function() {
        spyOn(view.partialView, 'render');
        view.render();
        expect(view.partialView.render).toHaveBeenCalled();
      });

      it('attaches the model view to its el', function() {
        view.render();
        expect(view.$el.html()).toContain(view.partialView.$el.html());
      });
    });
  });

  /* Special Functions
  /**************************************************************************/

  describe('special functions', function() {
    describe('isA()', function() {
      it('returns true with argument DashboardProfileView #partialView #view #travis', function() {
        expect(view.isA('DashboardProfileView')).toBe(true);
      });

      it('returns true with argument DashboardView #partialView #view #travis', function() {
        expect(view.isA('DashboardView')).toBe(true);
      });
      
      it('returns false with another argument #partialView #view #travis', function() {
        expect(view.isA('Corvette')).toBe(false);
      });
    });

    describe('setUser()', function() {

      // In this instance, the user is being passed as {model: user}, so Backbone
      // sets the user automatically, but the setUser method is still being used
      // to instantiate the child view.

      it('instantiates a userProfileView #partialView #view #travis', function(done) {
        view.setUser(user);
        expect(view.profileView.klass).toBe('UserProfileView');
        done();
      });

      it('puts the partialView in the childViews array #partialView #view #travis', function() {
        view.setUser(user);
        expect(view.childViews).toEqual([view.profileView]);
      });

      it('returns itself #partialView #view #travis', function() {
        expect(view.setUser(user)).toBe(view);
      });
    });
  });
});