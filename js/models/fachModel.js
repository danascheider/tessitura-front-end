Tessitura.FachModel = Tessitura.Model.extend({

  // This endpoint does not actually exist, but I had to add a urlRoot property
  // because Backbone was raising mysterious errors when the model didn't have
  // one, and investigating this is not a priority. There is no endpoint for 
  // Fachs because the set of Fachs, as well as the Fachs themselves, are not
  // intended to be changed at runtime.

  urlRoot      : function() {
    return Tessitura.API.base + '/fachs';
  },

  displayTitle : function() {

    // The basic voice type - soprano, mezzo-soprano, contralto, countertenor,
    // tenor, baritone, or bass - capitalized

    var str = this.get('type').charAt(0).toUpperCase() + this.get('type').slice(1);

    // If the fach has a quality - i.e., lyric or dramatic - or the 'coloratura' 
    // attribute is set to `true`, these data are added to the string
    
    if(this.get('quality')) { str = str.concat(', ' + this.get('quality')); }
    if(this.get('coloratura') === true) { str = str.concat(', coloratura'); }

    return str;
  }
});

module.exports = Tessitura.FachModel;