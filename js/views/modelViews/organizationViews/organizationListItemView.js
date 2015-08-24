Tessitura.OrganizationListItemView = Tessitura.View.extend({
  tagName   : 'li',
  className : 'organization-list-item-view',
  template  : JST['orgs/listItem'],

  render    : function() {
    Tessitura.View.prototype.render.call(this, this.template({model: this.model}));
  }
});

module.exports = Tessitura.OrganizationListItemView;