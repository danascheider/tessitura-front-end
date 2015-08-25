Tessitura.OrganizationModel = Tessitura.ProtectedResource.extend({
  urlRoot      : '/organizations',
  klass        : 'OrganizationModel',

  cityStateZip : function() {
    var city = this.get('city') || '', state = this.get('region') || '', zip = this.get('postal_code') || '';

    if(!(city.length || state.length || zip.length)) { return; }

    var str  = (state + ' ' + zip).replace(/\s+$/, '');

    if(city) {
      str = str.length ? (city + ', ' + str).replace(/\s{2,}/, ' ') : city;
    }

    return str;
  }
});

module.exports = Tessitura.OrganizationModel;