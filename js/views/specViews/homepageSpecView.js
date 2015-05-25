var SpecWrapper = Tessitura.View.extend({
  el         : 'body',
  template   : JST['spec/homepage'],

  events  : {
    'click a[data-method=showLoginForm]'   : 'showLoginForm',
    'click a[data-method=hideLoginForm]'   : 'callHideLoginForm',
    'click a[data-method=toggleLoginForm]' : 'callToggleLoginForm'
  },

  /* Event Callbacks
  /***************************************************************************/

  callHideLoginForm   : function(e) {
    e.preventDefault();
    var click = $.Event('dblclick', {target: this.view.$('#shade')});
    this.view.hideLoginForm(click);
  },

  callToggleLoginForm : function(e) {
    e.preventDefault();
    var click = $.Event('click', {target: this.view.$('.login-link')});
    this.view.toggleLoginForm(click);
  },

  showLoginForm       : function(e) {
    e.preventDefault();
    if(!this.view.$('#login-form').is(':visible')) {
      var click = $.Event('click', {target: this.view.$('.login-link')});
      this.view.toggleLoginForm(click);
    }
  },

  /* Core View Functions
  /***************************************************************************/

  initialize : function() {
    this.view = new Tessitura.HomepageView();
    this.render();
  },

  render     : function() {
    var that = this;

    return Tessitura.View.prototype.render.call(this, this.template(), function() {
      that.view.render();
      that.$el.addClass('test');
      that.$('#view').html(that.view.$el);
    });
  }
});

module.exports = SpecWrapper;