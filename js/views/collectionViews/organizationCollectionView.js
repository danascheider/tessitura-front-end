Tessitura.OrganizationCollectionView = Tessitura.View.extend({
  id         : 'organization-list',
  className  : 'well',
  initialize : function() {
    this.childViews = [];
  }
});

module.exports = Tessitura.OrganizationCollectionView;