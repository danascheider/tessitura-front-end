Tessitura.FachModel = Tessitura.Model.extend({

  urlRoot      : function() {
    return Tessitura.API.fachs.collection;
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