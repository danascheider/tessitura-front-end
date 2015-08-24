Tessitura.OrganizationCollection = Tessitura.ProtectedCollection.extend({
  model: Tessitura.OrganizationModel,
  url  : function() { 
    return Tessitura.API.organizations.collection; 
  }
});

module.exports = Tessitura.OrganizationCollection;