require('backbone');
require('underscore');

Backbone.View.prototype.klass = 'Backbone.View';
Backbone.View.prototype.types = function() {
  return ['Backbone.View'];
};

Backbone.View.prototype.destroyChild = function() {
  if(this.childViews) {
    var len = this.childViews.length;
    for(var i=0; i < len; i++) {
      this.childViews[i].destroyView();
    }
  }
}

Backbone.View.prototype.destroyView = function() {
  if(this.beforeClose) { 
    this.beforeClose();
  }

  if(this.destroyChild) {
    this.destroyChild();
  }

  this.undelegateEvents();
  this.$el.removeData().unbind();

  this.remove();

  Backbone.View.prototype.remove.call(this);
};

Backbone.View.prototype.isA   = function(type) {
  return this.types().indexOf(type) > -1 ? true : false;
};