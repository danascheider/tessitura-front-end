define(['backbone', 'views/app/dashboard-sidebar'], function(Backbone, SidebarView) {
  
  describe('Dashboard Sidebar View', function() {
    var sidebar, e;

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
      });

      it('returns itself', function() {
        sidebar.render().should.equal(sidebar);
      });
    });

    describe('reset() method', function() {
      beforeEach(function() { sidebar.render(); });

      it('removes the view from the DOM', function() {
        sinon.stub(sidebar, 'remove');
        sidebar.reset();
        sidebar.remove.calledOnce.should.be.true;
        sidebar.remove.restore();
      });

      it('returns itself', function() {
        sidebar.reset().should.equal(sidebar);
      });
    });

    describe('toggleSecondLevelNav() method', function() {
      beforeEach(function() { 
        sidebar.reset().render(); 
        e = $.Event('click', {target: sidebar.$('i.fa-sitemap').closest('li')});
      });

      describe('when the second level nav is hidden', function() {
        it('expands the second level nav', function() {
          var li = sidebar.$('i.fa-sitemap').closest('li');
          sidebar.toggleSecondLevelNav(e);
          li.find('ul.nav-second-level').should.be.visible;
        });

        it('hides any other visible second-level navs', function() {
          var li = sidebar.$('i.fa-files-o').find('ul.nav-second-level').slideDown();
          sidebar.toggleSecondLevelNav(e);
          li.find('ul.nav-second-level').should.not.be.visible;
        });

        it('adds the \'active\' class to its parent', function() {
          var li = sidebar.$('i.fa-sitemap').closest('li');
          sidebar.toggleSecondLevelNav(e);
          li[0].className.should.include('active');
        });

        it('removes the \'active\' class from other <li>s', function() {
          var li = sidebar.$('i.fa-files-o').closest('li');
          li.addClass('active');
          sidebar.toggleSecondLevelNav(e);
          li[0].className.should.not.include('active');
        });
      });
    });
  });
});