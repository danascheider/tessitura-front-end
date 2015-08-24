Tessitura.OrganizationCollection = Tessitura.ProtectedCollection.extend({
  model: Tessitura.OrganizationModel,
  url  : '/organizations'
});

module.exports = Tessitura.OrganizationCollection;