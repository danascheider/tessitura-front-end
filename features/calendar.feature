@javascript
Feature: Calendar

  Users have a calendar in their dashboard displaying, by default, 5 days with
  today in the middle (i.e., two days ago until two days from now).

  Background:
    Given I am on my dashboard

  Scenario: Date range
    Then the calendar should show three days with today in the middle
    And the calendar should not show the other four days