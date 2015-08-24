Tessitura.OrganizationCollectionView = Tessitura.View.extend({
  id         : 'organization-list',
  className  : 'well',
  initialize : function(opts) {
    opts = opts || {};
    
    this.childViews = [];

    this.collection = opts.collection || new Tessitura.OrganizationCollection();
    this.collection.fetch();
  }
});

module.exports = Tessitura.OrganizationCollectionView;