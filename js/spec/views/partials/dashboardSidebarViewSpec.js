define(['backbone', 'views/app/dashboard-sidebar'], function(Backbone, SidebarView) {
  
  describe('Dashboard Sidebar View', function() {
    var sidebar;

    beforeEach(function() {
      if(typeof sidebar === 'undefined') { sidebar = new SidebarView(); }
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sinon.stub(Backbone.View.prototype, 'render');
        var newSidebar = new SidebarView();
        Backbone.View.prototype.render.called.should.be.false;
        Backbone.View.prototype.render.restore();
      });
    });

    describe('elements', function() {
      beforeEach(function() {
        sidebar.reset().render();
      });

      it('is a ul', function() {
        sidebar.$el[0].tagName.should.equal('UL');
      });
    });

    describe('events', function() {
      //
    });

    describe('render() function', function() {
      //
    });

    describe('reset() method', function() {
      //
    });
  });
});