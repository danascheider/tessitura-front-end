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

Tessitura = Tessitura || require('../../js/tessitura.js');
require(process.cwd() + '/spec/support/webdriver.js');
require(process.cwd() + '/spec/support/env.js');

/******************************************************************************
 * BEGIN SUITE                                                                *
/******************************************************************************/

describe('Dashboard Home View - Visual Elements', function() {

  /* Filters
  /****************************************************************************/

  beforeAll(function(done) {
    jasmine.addMatchers(require('jasmine-jquery-matchers'));
    client.init().url('http://localhost/#dashboardHomeViewSpec', done);
  });

  beforeEach(function(done) {
    client.refresh(done);
  });

  afterAll(function(done) {
    client.end(done);
  });

  describe('view elements', function() {
    it('displays its task panel view #dashboardHomeUI #ui', function(done) {
      client.waitForVisible('#task-panel', function(err, isVisible) {
        expect(isVisible).toBe(true);
        done();
      });
    });

    it('displays its top widget view #dashboardHomeUI #ui', function(done) {
      client.waitForVisible('#dashboard-top-widgets', function(err, isVisible) {
        expect(isVisible).toBe(true);
        done();
      });
    });
  });
});