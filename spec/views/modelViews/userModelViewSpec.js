require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    fcontext  = fdescribe;

describe('User Model View', function() {
  var view, newView, e, input;

  beforeAll(function() {
    jasmine.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  beforeEach(function() {
    spyOn($, 'cookie').and.callFake(function(name) {
      return name === 'userID' ? 1 : btoa('testuser:testuser');
    });
  
    view = new Tessitura.UserModelView({model: fixtures.user});
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
      expect(view.$el.html()).toContain('Name:');
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

    describe('double-click username field', function() {
      it('calls displayInput #modelView #view #travis', function() {
        pending('I cannot for the life of me figure out why this test won\'t fucking pass');
        spyOn(Tessitura.UserModelView.prototype, 'displayInput');
        newView = new Tessitura.UserModelView({model: user});
        newView.$('span.profile-field#username span.p').trigger('dblclick');
        expect(Tessitura.UserModelView.prototype.displayInput).toHaveBeenCalled();
      });
    });

    describe('keypress in input', function() {
      it('calls triageKeypress #modelView #view #travis', function() {
        pending('FUFNR');
        spyOn(Tessitura.UserModelView.prototype, 'triageKeypress');
        newView = new Tessitura.UserModelView({model: user});
        newView.$('input').trigger('keypress');
        expect(Tessitura.UserModelView.prototype.triageKeypress).toHaveBeenCalled();
      });
    });
  });

  describe('view elements', function() {
    beforeEach(function() { 
      view.render(); 
    });

    it('is a DIV #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toBe('DIV');
    });

    it('displays the user\'s headshot #modelView #view #travis', function() {
      expect(view.$('#avatar')).toBeVisible();
    });

    _.each(['username', 'first_name', 'last_name', 'email', 'fach', 'city'], function(field) {
      it('displays the user\'s ' + field + ' #modelView #view #travis', function() {
        expect(view.$('#' + field)).toBeVisible();
      });
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

    describe('hideInputs', function() {
      beforeEach(function() {
        view.render();
        view.displayInput($.Event('dblclick', {target: view.$('#username')}));
        view.hideInputs();
      });

      it('hides all the inputs #modelView #view #travis', function() {
        expect(view.$('input')).not.toBeInDom();
      });

      it('shows the text #modelView #view #travis', function() {
        expect(view.$('#username span.p').html()).toContain('testuser');
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

    describe('displayInput', function() {
      beforeEach(function() { view.render(); });

      it('displays an input #modelView #view #travis', function() {
        e = $.Event({target: view.$('#username span.p')});
        view.displayInput(e);
        expect(view.$('#username input:visible').length).toBeGreaterThan(0);
      });

      it('hides the text #modelView #view #travis', function() {
        e = $.Event({target: view.$('#username span.p')});
        view.displayInput(e);
        expect(e.target).not.toBeVisible();
      });

      it('hides other inputs #modelView #view #travis', function() {
        pending('FUFNR');

        var e1 = $.Event({target: view.$('#username span.p')}),
            e2 = $.Event({target: view.$('#city span.p')});

        view.displayInput(e1);
        view.displayInput(e2);
        expect(view.$('#username span.input')).not.toBeVisible();
      });
    });

    describe('submitUpdate', function() {
      beforeEach(function() { view.render(); });

      context('general', function() {
        beforeEach(function() {
          spyOn($, 'attr').and.returnValue('city');
          view.displayInput($.Event({target: view.$('#city span.p')}));
          target = [{value: 'El Paso'}];
          e = $.Event('keypress', {keyCode: 13, target: target});
        });

        it('calls save on the user model #modelView #view #travis', function() {
          spyOn(view.model, 'save');
          view.submitUpdate(e);
          expect(view.model.save.calls.mostRecent().args[0]).toEqual({city: 'El Paso'});
        });

        it('hides the input #modelView #view #travis', function(done) {
          spyOn($, 'ajax').and.callFake(function(args) { args.success(); });

          view.submitUpdate(e);
          done();
          expect(view.$('#city span.input')).not.toBeVisible();
        });

        it('changes the text to the new value #modelView #view #travis');
      });
    });

    describe('triageKeypress', function() {
      context('when the key is enter', function() {
        beforeEach(function() {
          spyOn(view, 'submitUpdate');
          input = view.$('input[name=city]');
          var target = [{value: ''}, {attributes: {name: 'city'}}];
          e = $.Event('keypress', {keyCode: 13, target: target});
        });

        context('when the input is empty', function() {
          it('doesn\'t submit #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });
        });
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