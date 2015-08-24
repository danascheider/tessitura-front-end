Tessitura.OrganizationCollectionView = Tessitura.View.extend({
  id                   : 'organization-list',
  className            : 'well',
  template             : JST['collections/organization'],

  /* Special Functions
  /****************************************************************************/

  renderCollection     : function() {
    var that      = this;
    var container = document.createDocumentFragment();

    that.collection.each(function(organization) {
      var view = that.retrieveViewForModel(organization) || new Tessitura.OrganizationListItemView({model: organization});
      if(that.childViews.indexOf(view) === -1) { that.childViews.push(view); }

      view.render();
      container.appendChild(view.el);
    });

    this.$el.append(container);
    return this;
  },

  retrieveViewForModel : function(org) {
    if(!this.childViews.length) { return; }

    var that = this, child;

    _.each(that.childViews, function(view) {
      if(view.model && (view.model.get('id') === org.get('id'))) { child = view; }
    });

    return child;
  },

  /* Core View Functions
  /****************************************************************************/

  render               : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.renderCollection();
    });
  },

  initialize           : function(opts) {
    opts = opts || {};
    
    this.childViews = [];

    this.collection = opts.collection || new Tessitura.OrganizationCollection();
    this.collection.fetch();
  }
});

module.exports = Tessitura.OrganizationCollectionView;