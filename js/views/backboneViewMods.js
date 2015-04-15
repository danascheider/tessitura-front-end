require('backbone');
require('underscore');

Backbone.View.prototype.klass = 'Backbone.View';
Backbone.View.prototype.types = function() {
  return ['Backbone.View'];
};

Backbone.View.prototype.destroyChildren = function() {
  if(this.childViews) {
    var len = this.childViews.length;
    for(var i=0; i < len; i++) {
      this.childViews[i].destroyView();
    }
  }
}

Backbone.View.prototype.destroy = function() {
  if(this.beforeClose) { 
    this.beforeClose();
  }

  if(this.destroyChildren) {
    this.destroyChildren();
  }

  this.undelegateEvents();
  this.$el.removeData().unbind();

  this.remove();

  Backbone.View.prototype.remove.call(this);
};

Backbone.View.prototype.isA   = function(type) {
  return this.types().indexOf(type) > -1 ? true : false;
};