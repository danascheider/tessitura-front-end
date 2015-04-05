/***************************************************************************
 *                                                                         *
 * DASHBOARD HOME VIEW - VISUAL ELEMENTS                                   *
 *                                                                         *
 * The DashboardHomeView is the view the user sees when they first log     *
 * into their dashboard. It contains summary information about all their   *
 * activities and obligations.                                             *
 *                                                                         *
 * CONTENTS                                                          LINE  *
 * Requires ......................................................... 20   *
 * Suite ............................................................ 28   *
 *   Filters ........................................................ 33   *
 *   Elements ....................................................... 47   *
 *                                                                         *
/***************************************************************************/

/* Core Requires
/****************************************************************************/

Canto = Canto || require('../../js/dependencies.js');
require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/spec/support/env.js');

/******************************************************************************
 * BEGIN SUITE                                                                *
/******************************************************************************/

describe('Dashboard Home View - Visual Elements #ui', function() {

  /* Filters
  /****************************************************************************/

  beforeAll(function() {
    jasmine.addMatchers(require('jasmine-jquery-matchers'));
    client.init().url('http://localhost/#dashboardHomeViewSpec');
  });

  beforeEach(function() {
    client.refresh();
  });

  afterAll(function(done) {
    client.end();
    done();
  });

  describe('view elements', function() {
    it('displays its task panel view', function(done) {
      client.waitForVisible('#task-panel', function(err, isVisible) {
        expect(isVisible).toBe(true);
        done();
      });
    });

    it('displays its top widget view', function(done) {
      client.waitForVisible('#dashboard-top-widgets', function(err, isVisible) {
        expect(isVisible).toBe(true);
        done();
      });
    });
  });
});