@javascript
Feature: User registration

  Background:
    Given I am not logged in
    And I am on the homepage

    Scenario: Valid registration
      When I fill out the registration form with valid data