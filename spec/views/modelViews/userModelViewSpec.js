/* istanbul ignore require */
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/env.js');

/* istanbul ignore next */
var matchers  = require('jasmine-jquery-matchers'),
    fixtures  = require(process.cwd() + '/spec/support/fixtures/fixtures.js'),
    context   = describe,
    ccontext  = ddescribe;

/* istanbul ignore next */
describe('User Model View', function() {
  var view, newView, e, html, input;

  beforeEach(function() {
    this.addMatchers(matchers);
    _.extend(global, fixtures);
  });

  afterEach(function() {
    restoreFixtures();
    view.destroy();
    newView && newView.destroy();
    _.omit(global, fixtures);

  }); 

  describe('constructor', function() {
    beforeEach(function() {
      spyOn(Tessitura.UserModelView.prototype, 'render');
      view = new Tessitura.UserModelView({model: user});
    });

    it('assigns the model #userModelView #modelView #view #travis', function() {
      expect(view.model).toBe(user);
    });

    it('does not call render #userModelView #modelView #view #travis', function() {
      expect(Tessitura.UserModelView.prototype.render).not.toHaveBeenCalled();
    });
  });

  describe('el', function() {
    beforeEach(function() { 
      view = new Tessitura.UserModelView({model: user});
      view.render(); 
      html = view.$el.html();
    });

    it('is a div #userModelView #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toEqual('DIV');
    });

    it('has class .user-model #userModelView #modelView #view #travis', function() {
      expect(view.$el[0]).toHaveClass('user-model');
    });

    it('displays the user\'s name #userModelView #modelView #view #travis', function() {
      expect(html).toContain('Name:');
    });

    it('displays the user\'s username #userModelView #modelView #view #travis', function() {
      expect(html).toContain('Username:');
    });

    it('displays the user\'s e-mail #userModelView #modelView #view #travis', function() {
      expect(html).toContain('E-mail:');
    });
  });

  describe('events', function() {
    beforeEach(function() {
      spyOn(Tessitura.UserModelView.prototype, 'updateDisplay');
      spyOn(Tessitura.UserModelView.prototype, 'displayForm');
      spyOn(Tessitura.UserModelView.prototype, 'triageKeypress');
      view = new Tessitura.UserModelView({model: user});
      view.render();
    });

    describe('change model', function() {
      it('calls updateDisplay #userModelView #modelView #view #travis', function() {
        user.trigger('change');
        expect(Tessitura.UserModelView.prototype.updateDisplay).toHaveBeenCalled();
      });
    });

    describe('double-click username field', function() {
      it('calls displayForm #userModelView #modelView #view #travis', function() {
        view.$('span.profile-field#username span.p').trigger('dblclick');
        expect(Tessitura.UserModelView.prototype.displayForm).toHaveBeenCalled();
      });
    });

    describe('keydown in input', function() {
      it('calls triageKeypress #userModelView #modelView #view #travis', function() {
        view.$('input').trigger('keydown');
        expect(Tessitura.UserModelView.prototype.triageKeypress).toHaveBeenCalled();
      });
    });
  });

  describe('view elements', function() {
    beforeEach(function() { 
      view = new Tessitura.UserModelView({model: user});
      view.render();
      $('body').html(view.$el);
    });

    it('is a DIV #userModelView #modelView #view #travis', function() {
      expect(view.$el[0].tagName).toBe('DIV');
    });

    it('displays the user\'s headshot #userModelView #modelView #view #travis', function() {
      expect(view.$('#avatar')).toBeInDom();
    });

    _.each(['username', 'first_name', 'last_name', 'email', 'fach', 'city'], function(field) {
      it('displays the user\'s ' + field + ' #userModelView #modelView #view #travis', function() {
        value = user.get(field) || 'N/A'
        expect(view.$('#' + field).html()).toContain(value);
      });
    });
  });

  describe('special functions', function() {
    describe('hideInputs', function() {
      beforeEach(function() {
        view = new Tessitura.UserModelView({model: user});
        view.render();
        view.displayForm($.Event('dblclick', {target: view.$('#username')}));
        view.hideInputs();
      });

      it('hides all the inputs #userModelView #modelView #view #travis', function() {
        expect(view.$('input')).toBeHidden();
      });

      it('shows the text #userModelView #modelView #view #travis', function() {
        expect(view.$('#username span.p').html()).toContain('testuser');
      });
    });
  });

  describe('event callbacks', function() {
    describe('displayForm()', function() {
      beforeEach(function() {
        view = new Tessitura.UserModelView({model: user});
        $('body').html(view.render().$el);
      });

      afterEach(function() { 
        view.hideInputs(); 
        view.remove();
      });

      it('displays an input #userModelView #modelView #view #travis', function() {
        e = $.Event({target: view.$('#username span.p')});
        view.displayForm(e);
        expect(view.$('#username input:visible').length).toBe(1);
      });

      it('hides the text #userModelView #modelView #view #travis', function() {
        e = $.Event({target: view.$('#username span.p')});
        view.displayForm(e);
        expect(view.$('#username span.p')).toBeHidden();
      });
    });

    describe('resizeInputs()', function() {
      beforeEach(function() { 
        view = new Tessitura.UserModelView({model: user});
        view.render(); 
      });

      context('when the input is the first_name input', function() {
        it('sets the width #userModelView #modelView #view #travis', function() {
          spyOn(global, 'parseInt').andReturn(11);
          var span = view.$('#first_name');
          view.displayForm('dblclick', {target: [{value: span}]});
          view.resizeInputs(span);
          expect(span.find('input').css('width')).toEqual('21px');
        });
      });
    });

    describe('submitUpdate()', function() {
      beforeEach(function() { 
        view = new Tessitura.UserModelView({model: user});
        view.render(); 
      });

      context('general', function() {
        beforeEach(function() {
          spyOn($, 'attr').andReturn('city');
          spyOn(Tessitura.Utils, 'getAttributes').andReturn({city: 'El Paso'});
          spyOn($, 'ajax').andCallFake(function(args) { args.success(); });
          view.displayForm($.Event({target: view.$('#city span.p')}));
          target = [{value: 'El Paso'}];
          e = $.Event('keydown', {keyCode: 13, target: target});
        });

        it('calls save on the user model #userModelView #modelView #view #travis', function() {
          spyOn(view.model, 'save');
          view.submitUpdate(e);
          expect(view.model.save.calls[0].args).toContain({city: 'El Paso'});
        });

        it('hides the input #userModelView #modelView #view #travis', function(done) {
          view.submitUpdate(e);
          expect(view.$('#city span.form')).toBeHidden();
          done();
        });

        it('changes the text to the new value #userModelView #modelView #view #travis', function(done) {
          view.submitUpdate(e);
          expect(view.$('#city span.p').html()).toContain('El Paso');
          done();
        });
      });

      context('changing username', function() {
        beforeEach(function() {
          spyOn($, 'attr').andReturn('username');
          spyOn($, 'cookie');
          spyOn(global, 'atob').andReturn('testuser:testuser');
          spyOn(Tessitura.Utils, 'getAttributes').andReturn({username: 'newusername51'});
          view.displayForm($.Event({target: view.$('#username span.p')}));
          target = [{value: 'newusername51'}];
          e = $.Event('keydown', {keyCode: 13, target: target});
        });

        it('resets the cookie #userModelView #modelView #view #travis', function() {
          spyOn($, 'ajax').andCallFake(function(args) { args.success(); });
          view.submitUpdate(e);
          expect($.cookie).toHaveBeenCalledWith('auth', btoa('newusername51:testuser'));
        });
      });
    });

    describe('triageKeypress()', function() {
      beforeEach(function() {
        view = new Tessitura.UserModelView({model: user});
        view.render();
        $('body').html(view.render().$el);
      });

      context('when the key is enter', function() {
        beforeEach(function() {
          spyOn(view, 'submitUpdate');
          input = view.$('input[name=username]');
          input.show();
        });

        context('when the input is empty', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').andReturn('username');
            var target = [{value: ''}];
            e = $.Event('keydown', {keyCode: 13, target: target});
          });

          it('doesn\'t submit #userModelView #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });
        });

        context('when the content of the field hasn\'t changed', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').andReturn('username');
            var target = [{value: 'testuser'}, {attributes: {name: 'username'}}];
            e = $.Event('keydown', {keyCode: 13, target: target});
          });

          it('doesn\'t submit #userModelView #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });
        });

        context('when the content of the field has changed', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').andReturn('username');
            spyOn($.prototype, 'submit');
            var target = [{value: 'usertest'}, {attributes: {name: 'username'}}];
            e = $.Event('keydown', {keyCode: 13, target: target});
          });

          it('submits #userModelView #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect($.prototype.submit).toHaveBeenCalled();
          });
        });
      });

      context('when the key is tab', function() {
        beforeEach(function() {
          spyOn(view, 'submitUpdate');
          input = view.$('input[name=username]');
          view.displayForm('dblclick', view.$('#username span.p'));
        });

        context('when the input is empty', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').andReturn('username');
            var target = [{value: ''}];
            e = $.Event('keydown', {keyCode: 9, target: target});
            view.triageKeypress(e);
          });

          it('doesn\'t submit #userModelView #modelView #view #travis', function() {
            expect(view.submitUpdate).not.toHaveBeenCalled();
          });

          xit('hides the input #userModelView #modelView #view #travis', function() {
            // pending('FUFNR');
            expect(view.$('#username input')).not.toBeVisible();
          });

          it('shows the next input #userModelView #modelView #view #travis', function() {
            expect(view.$('#email .form')).toBeInDom();
          });
        });

        context('when the first input is first_name #userModelView #modelView #view #travis', function() {
          beforeEach(function() {
            spyOn($.prototype, 'attr').andReturn('first_name');
            var target = [{value: ''}];
            e = $.Event('keydown', {keyCode: 9, target: target});
          });

          it('goes to the last_name field #userModelView #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect(view.$('#last_name .form')).toBeInDom();
          });
        });

        context('when the input doesn\'t match the current attribute value', function() {
          beforeEach(function() {
            spyOn($.prototype, 'submit');
            var target = [{value: 'Foobar'}];
            e = $.Event('keydown', {keyCode: 9, target: target});
            view.displayForm('dblclick', view.$('#username span.p'));
          });

          it('submits the form #userModelView #modelView #view #travis', function() {
            view.triageKeypress(e);
            expect($.prototype.submit).toHaveBeenCalled();
          });
        });
      });
      
      context('when the key is escape', function() {
        beforeEach(function() {
          spyOn(view, 'hideInputs');
          view.displayForm('dblclick', view.$('input[name=username]'));
          var target = [{value: ''}];
          e = $.Event('keydown', {keyCode: 27, target: target});
        });

        it('calls hideInputs #userModelView #modelView #view #travis', function() {
          view.triageKeypress(e);
          expect(view.hideInputs).toHaveBeenCalled();
        });
      });
    });

    describe('updateDisplay()', function() {
      beforeEach(function() {
        view.render();
        spyOn(view.model, 'get').andReturn(null);
        spyOn($.prototype, 'html');
      });

      it('sets the value to \'N/A\' #userModelView #modelView #view #travis', function() {
        view.updateDisplay();
        expect($.prototype.html).toHaveBeenCalledWith('N/A');
      });
    });
  });

  describe('core view functions', function() {
    beforeEach(function() {
      view = view || new Tessitura.UserModelView({model: user});
    });

    describe('render', function() {
      it('sets the HTML of its el #userModelView #modelView #view #travis', function() {
        spyOn(view.$el, 'html');
        view.render();
        expect(view.$el.html).toHaveBeenCalledWith(view.template({model: user}));
      });

      it('returns itself #userModelView #modelView #view #travis', function() {
        expect(view.render()).toBe(view);
      });
    });
  });
});