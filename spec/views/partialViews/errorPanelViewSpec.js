// The Error Panel View informs the user when their input has
// resulted in errors. It gets rendered in form views and is
// displayed when validation fails.

/* Core Requires
/****************************************************************************/

require(process.cwd() + '/js/tessitura.js');
require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');

var matchers       = require('jasmine-jquery-matchers'),
    context        = describe,
    ccontext       = ddescribe;

/* Login Form View Spec
/****************************************************************************/

describe('Error Panel View', function() {
  var view, newView, errors;

  /* Filters
  /**************************************************************************/

  beforeEach(function() {
    this.addMatchers(matchers);

    errors = [
      'Username cannot be blank',
      'Password cannot contain username',
      'Please accept the terms of use'
    ]

    view = new Tessitura.ErrorPanelView(errors);
  });

  afterEach(function() {
    view.destroy();
    newView && newView.destroy();
  });

  /* View Constructor
  /**************************************************************************/

  describe('constructor', function() {
    it('does not call render #errorPanelView #partialView #view #travis', function() {
      spyOn(Tessitura.ErrorPanelView.prototype, 'render');
      var newView = new Tessitura.ErrorPanelView();
      expect(Tessitura.ErrorPanelView.prototype.render).not.toHaveBeenCalled();
    });

    it('assigns this.errors #errorPanelView #partialView #view #travis', function() {
      expect(view.errors).toEqual(errors);
    });
  });
});
