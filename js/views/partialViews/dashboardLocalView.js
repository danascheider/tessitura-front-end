Tessitura.DashboardLocalView = Tessitura.View.extend({
  id            : 'page-wrapper',
  template      : JST['partials/dashLocal'],
  setUser       : function(user) {
    this.user = user;
  },

  events        : {
    'submit #location-form' : 'updateProfile'
  },

  /* Event Callbacks
  /****************************************************************************/

  updateProfile : function(e) {
    e.preventDefault();

    var data = {}, that = this;
    var data = Tessitura.Utils.getAttributes($(e.target));

    this.user.save(data, {
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + $.cookie('auth'));
      },
      success   : function() {
        that.$('#location-form').closest('.alert').hide();
      },
      error     : function(model, response) {
        console.log('Unable to update user profile - error ', response)
      }
    });
  },

  /* Special Functions
  /****************************************************************************/

  setUser       : function(user) {
    this.user = user;
  },

  /* Core View Functions
  /****************************************************************************/

  initialize    : function(opts) {
    opts = opts || {};
    opts.user && this.setUser(opts.user);
    this.organizationCollectionView = new Tessitura.OrganizationCollectionView();
    this.childViews = [this.organizationCollectionView];
  },

  render        : function() {
    var html = this.template({model: this.user});
    return Tessitura.View.prototype.render.call(this, html);
  }
});

module.exports = Tessitura.DashboardLocalView;