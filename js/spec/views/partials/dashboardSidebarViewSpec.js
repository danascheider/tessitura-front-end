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
      beforeEach(function() {
        sinon.stub(SidebarView.prototype, 'toggleSecondLevelNav');
        sinon.stub(SidebarView.prototype, 'goToDashboard');
        sinon.stub(SidebarView.prototype, 'goToTaskPage');
        sinon.stub(Backbone.history, 'navigate');
      });

      afterEach(function() {
        SidebarView.prototype.toggleSecondLevelNav.restore();
        SidebarView.prototype.goToDashboard.restore();
        SidebarView.prototype.goToTaskPage.restore();
        Backbone.history.navigate.restore();
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
        sidebar.reset().render();
        sinon.stub(Backbone.history, 'navigate');
      });

      afterEach(function() { Backbone.history.navigate.restore(); });

      describe('when on the dashboard', function() {
        beforeEach(function() { sinon.stub(sidebar, 'getLocationHash').returns('#dashboard'); });
        afterEach(function() { sidebar.getLocationHash.restore(); });

        it('does not navigate', function() {
          sidebar.goToDashboard();
          Backbone.history.navigate.called.should.be.false;
        });
      });

      describe('when not on the dashboard', function() {
        beforeEach(function() { sinon.stub(sidebar, 'getLocationHash').returns('#tasks'); });
        afterEach(function() { sidebar.getLocationHash.restore(); });

        it('navigates to the dashboard', function() {
          sidebar.goToDashboard();
          Backbone.history.navigate.calledWithExactly('dashboard', {trigger: true}).should.be.true;
        });
      });
    });

    describe('goToTaskPage() method', function() {
      beforeEach(function() { 
        sidebar.reset().render(); 
        sinon.stub(Backbone.history, 'navigate');
      });

      afterEach(function() { Backbone.history.navigate.restore(); });

      describe('when on the task page', function() {
        beforeEach(function() { sinon.stub(sidebar, 'getLocationHash').returns('#tasks'); });
        afterEach(function() { sidebar.getLocationHash.restore(); });

        it('doesn\'t navigate', function() {
          sidebar.goToTaskPage();
          Backbone.history.navigate.called.should.be.false;
        });
      });

      describe('when not on the task page', function() {
        beforeEach(function() { sinon.stub(sidebar, 'getLocationHash').returns('#dashboard'); });
        afterEach(function() { sidebar.getLocationHash.restore(); });

        it('navigates to the task page', function() {
          sidebar.goToTaskPage();
          Backbone.history.navigate.calledWithExactly('tasks', {trigger: true}).should.be.true;
        });
      });
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