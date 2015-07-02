/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    fcontext  = fdescribe;

/* istanbul ignore next */
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
    describe('change model', function() {
      it('calls updateDisplay #modelView #view #travis', function() {
        spyOn(Tessitura.UserModelView.prototype, 'updateDisplay');
        newView = new Tessitura.UserModelView({model: user});
        user.trigger('change');
        expect(Tessitura.UserModelView.prototype.updateDisplay).toHaveBeenCalled();
        newView.destroy();
      });
    });

    describe('double-click username field', function() {
      it('calls displayInput #modelView #view #travis', function() {
        spyOn(Tessitura.UserModelView.prototype, 'displayInput');
        newView = new Tessitura.UserModelView({model: user});
        newView.render();
        newView.$('span.profile-field#username span.p').trigger('dblclick');
        expect(Tessitura.UserModelView.prototype.displayInput).toHaveBeenCalled();
      });
    });

    describe('keydown in input', function() {
      it('calls triageKeypress #modelView #view #travis', function() {
        spyOn(Tessitura.UserModelView.prototype, 'triageKeypress');
        newView = new Tessitura.UserModelView({model: user});
        newView.render();
        newView.$('input').trigger('keydown');
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
        var e1 = $.Event('dblclick', {target: view.$('#username span.p')}),
            e2 = $.Event('dblclick', {target: view.$('#city span.p')});

        view.displayInput(e1);
        view.displayInput(e2);
        expect(view.$('#username span.input')).not.toBeInDom();
      });
    });

    describe('submitUpdate', function() {
      beforeEach(function() { view.render(); });

      context('general', function() {
        beforeEach(function() {
          spyOn($, 'attr').and.returnValue('city');
          view.displayInput($.Event({target: view.$('#city span.p')}));
          target = [{value: 'El Paso'}];
          e = $.Event('keydown', {keyCode: 13, target: target});
        });

        it('calls save on the user model #modelView #view #travis', function() {
          spyOn(view.model, 'save');
          view.submitUpdate(e);
          expect(view.model.save.calls.mostRecent().args[0]).toEqual({city: 'El Paso'});
        });

        it('hides the input #modelView #view #travis', function(done) {
          spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
          view.submitUpdate(e);
          expect(view.$('#city span.input')).not.toBeInDom();
          done();
        });

        it('changes the text to the new value #modelView #view #travis', function() {
          spyOn($, 'ajax').and.callFake(function(args) { args.success(); });
          view.submitUpdate(e);
          expect(view.$('#city span.p').html()).toContain('El Paso');
        });
      });
    });

    describe('triageKeypress', function() {
      beforeEach(function() {
        view.render();
      });

      context('when the key is enter', function() {
        beforeEach(function() {
          spyOn(view, 'submitUpdate');
          input = view.$('input[name=username]');
          input.show();
        });

        context('when the input is empty', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').and.returnValue('username');
            var target = [{value: ''}];
            e = $.Event('keydown', {keyCode: 13, target: target});
          });

          it('doesn\'t submit #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });
        });

        context('when the content of the field hasn\'t changed', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').and.returnValue('username');
            var target = [{value: 'testuser'}, {attributes: {name: 'username'}}];
            e = $.Event('keydown', {keyCode: 13, target: target});
          });

          it('doesn\'t submit #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });
        });

        context('when the content of the field has changed', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').and.returnValue('username');
            var target = [{value: 'usertest'}, {attributes: {name: 'username'}}];
            e = $.Event('keydown', {keyCode: 13, target: target});
          });

          it('submits #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).toHaveBeenCalled();
          });
        });
      });

      context('when the key is tab', function() {
        beforeEach(function() {
          spyOn(view, 'submitUpdate');
          input = view.$('input[name=username]');
          view.displayInput('dblclick', view.$('#username span.p'));
        });

        context('when the input is empty', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').and.returnValue('username');
            var target = [{value: ''}];
            e = $.Event('keydown', {keyCode: 9, target: target});
          });

          it('doesn\'t submit #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });

          it('hides the input #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.$('#username input')).not.toBeInDom();
          });

          it('shows the next input #modelView #view #travis', function() {
            pending('FUFNR');
            view.triageKeypress(e);
            expect(view.$('#email .input')).toBeInDom();
          });
        });

        context('when the first input is first_name #modelView #view #travis', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').and.returnValue('first_name');
            var target = [{value: ''}];
            e = $.Event('keydown', {keyCode: 9, target: target});
          });

          it('goes to the last_name field #modelView #view #travis', function() {
            pending('FUFNR');
            view.triageKeypress(e);
            expect(view.$('#last_name .input')).toBeInDom();
          });
        });

        context('when the input doesn\'t match the current attribute value', function() {
          beforeEach(function() {
            var target = [{value: 'Foobar'}];
            e = $.Event('keydown', {keyCode: 9, target: target});
            view.displayInput('dblclick', view.$('#username span.p'));
            });

          it('calls submitUpdate #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).toHaveBeenCalled();
          });
        });
      });
      
      context('when the key is escape', function() {
        beforeEach(function() {
          spyOn(view, 'hideInputs');
          view.displayInput('dblclick', view.$('input[name=username]'));
          var target = [{value: ''}];
          e = $.Event('keydown', {keyCode: 27, target: target});
        });

        it('calls hideInputs #modelView #view #travis', function() {
          view.triageKeypress(e);
          expect(view.hideInputs).toHaveBeenCalled();
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