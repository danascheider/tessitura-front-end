define(['backbone', 'views/partials/dashboardSidebar'], function(Backbone, SidebarView) {
  
  describe('Dashboard Sidebar View', function() {
    var sidebar, e;
    var sandbox = sinon.sandbox.create();

    beforeEach(function() {
      if(typeof sidebar === 'undefined') { sidebar = new SidebarView(); }
    });

    afterEach(function() {
      sidebar.remove();
      sandbox.restore();
    });

    describe('constructor', function() {
      it('doesn\'t call render', function() {
        sandbox.stub(SidebarView.prototype, 'render');
        var newSidebar = new SidebarView();
        SidebarView.prototype.render.called.should.be.false;
      });
    });

    describe('elements', function() {
      beforeEach(function() { sidebar.render(); });

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
      beforeEach(function() {
        sandbox.stub(SidebarView.prototype, 'toggleSecondLevelNav');
        sandbox.stub(SidebarView.prototype, 'goToDashboard');
        sandbox.stub(SidebarView.prototype, 'goToTaskPage');
        sandbox.stub(Backbone.history, 'navigate');
      });

      describe('click on <a> in main <li>', function() {
        it('calls toggleSecondLevelNav', function() {
          var newSidebar = new SidebarView();
          newSidebar.render();
          newSidebar.$('a.sidebar-link').first().click();
          SidebarView.prototype.toggleSecondLevelNav.calledOnce.should.be.true;
          newSidebar.remove();
        });
      });

      describe('click dashboard link', function() {
        it('calls goToDashboard', function() {
          var newSidebar = new SidebarView();
          newSidebar.render();
          newSidebar.$('li > .dashboard-link').first().click();
          SidebarView.prototype.goToDashboard.calledOnce.should.be.true;
          newSidebar.remove();
        });
      });

      describe('click task page link', function() {
        it('calls goToTaskPage', function() {
          var newSidebar = new SidebarView();
          newSidebar.render();
          newSidebar.$('li > .task-page-link').first().click();
          SidebarView.prototype.goToTaskPage.calledOnce.should.be.true;
          newSidebar.remove();
        });
      });
    });

    describe('goToDashboard() method', function() {
      beforeEach(function() {
        sidebar.render();
        sandbox.stub(Backbone.history, 'navigate');
      });

      describe('when on the dashboard', function() {
        beforeEach(function() { sandbox.stub(sidebar, 'getLocationHash').returns('#dashboard'); });

        it('does not navigate', function() {
          sidebar.goToDashboard();
          Backbone.history.navigate.called.should.be.false;
        });
      });

      describe('when not on the dashboard', function() {
        beforeEach(function() { sandbox.stub(sidebar, 'getLocationHash').returns('#tasks'); });

        it('navigates to the dashboard', function() {
          sidebar.goToDashboard();
          Backbone.history.navigate.calledWithExactly('dashboard', {trigger: true}).should.be.true;
        });
      });
    });

    describe('goToTaskPage() method', function() {
      beforeEach(function() { 
        sidebar.render(); 
        sandbox.stub(Backbone.history, 'navigate');
      });

      describe('when on the task page', function() {
        beforeEach(function() { sandbox.stub(sidebar, 'getLocationHash').returns('#tasks'); });

        it('doesn\'t navigate', function() {
          sidebar.goToTaskPage();
          Backbone.history.navigate.called.should.be.false;
        });
      });

      describe('when not on the task page', function() {
        beforeEach(function() { sandbox.stub(sidebar, 'getLocationHash').returns('#dashboard'); });

        it('navigates to the task page', function() {
          sidebar.goToTaskPage();
          Backbone.history.navigate.calledWithExactly('tasks', {trigger: true}).should.be.true;
        });
      });
    });

    describe('render() function', function() {
      it('sets HTML', function() {
        sandbox.stub($.prototype, 'html');
        sidebar.render();
        $.prototype.html.calledOnce.should.be.true;
      });

      it('returns itself', function() {
        sidebar.render().should.equal(sidebar);
      });
    });

    describe('toggleSecondLevelNav() method', function() {
      beforeEach(function() { 
        sidebar.render(); 
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

      describe('when the second level nav is visible', function() {
        beforeEach(function() {
          var li = sidebar.$('i.fa-sitemap').closest('li');
          li.addClass('active');
          li.find('ul.nav-second-level').slideDown();
          e = $.Event('click', {target: li});
        });

        it('hides the second-level nav', function() {
          var li = sidebar.$('i.fa-sitemap').closest('li');
          sidebar.toggleSecondLevelNav(e);
          li.find('ul.nav-second-level').should.not.be.visible;
        });

        it('removes the \'active\' class from the parent', function() {
          var li = sidebar.$('i.fa-sitemap').closest('li');
          sidebar.toggleSecondLevelNav(e);
          li[0].className.should.not.include('active');
        });
      });
    });
  });
});