@javascript
Feature: User registration

  Background:
    Given I am not logged in
    And I am on the homepage

  Scenario: Valid registration
    When I submit the registration form with valid data
    Then I should be routed to my dashboard