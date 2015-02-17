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
      beforeEach(function() { sidebar.reset().render(); });

      it('is a ul', function() {
        sidebar.$el[0].tagName.should.equal('UL');
      });

      it('has class nav', function() {
        sidebar.$el[0].className.should.include('nav');
      });

      it('has ID side-menu', function() {
        sidebar.$el[0].id.should.equal('side-menu');
      });

      it('has a search field', function() {
        sidebar.$('.custom-search-form').should.exist;
      });

      it('has a link to the dashboard', function() {
        sidebar.$('li > a[href="#dashboard"]').should.exist;
      });

      it('has a link to the task view', function() {
        sidebar.$('li > a[href="#tasks"]').should.exist;
      });
    });

    describe('events', function() {
      //
    });

    describe('render() function', function() {
      beforeEach(function() { sidebar.reset(); });

      it('sets HTML', function() {
        sinon.stub($.prototype, 'html');
        sidebar.render();
        $.prototype.html.calledOnce.should.be.true;
        $.prototype.html.restore();
      })
    });

    describe('reset() method', function() {
      beforeEach(function() { sidebar.render(); });

      it('removes the view from the DOM', function() {
        sinon.stub(sidebar, 'remove');
        sidebar.reset();
        sidebar.remove.calledOnce.should.be.true;
        sidebar.remove.restore();
      });
    });
  });
});