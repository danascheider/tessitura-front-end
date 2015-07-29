/* istanbul ignore require */

require(process.cwd() + '/spec/support/jsdom.js');
require(process.cwd() + '/spec/support/env.js');
require(process.cwd() + '/js/tessitura.js');

/* istanbul ignore next */
var context           = describe,
    ccontext          = ddescribe;

/* istanbul ignore next */

describe('Fach Model', function() {
  var fach;

  beforeEach(function() {
    fach = new Tessitura.FachModel({id: 1, type: 'baritone', quality: 'lyric'});
  });

  afterEach(function() {
    fach.destroy();
  });

  describe('displayTitle', function() {
    it('displays the type #model #travis', function() {
      expect(fach.displayTitle()).toEqual('Baritone, lyric')
    });

    it('displays coloratura value if present #model #travis', function() {
      fach.set('coloratura', true);
      expect(fach.displayTitle()).toEqual('Baritone, lyric, coloratura');
    });

    it('doesn\'t display the quality if not present #model #travis', function() {
      fach.set({type: 'contralto', coloratura: true});
      fach.unset('quality');
      expect(fach.displayTitle()).toEqual('Contralto, coloratura');
    });
  });
});
