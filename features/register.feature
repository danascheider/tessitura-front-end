@javascript
Feature: User registration

  Background:
    Given I am not logged in
    And I am on the homepage

  Scenario: Valid registration
    When I fill out the registration form with valid data
    And I accept the terms of use
    And I submit the registration form
    Then I should be routed to my dashboard
    And the dashboard should have my name on it

  Scenario: Terms not accepted
    When I fill out the registration form with valid data
    But I don't accept the terms of use
    And I submit the registration form
    Then I should not be routed to my dashboard
    And the 'terms' div should have class 'has-error'