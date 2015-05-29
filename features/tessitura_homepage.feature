@javascript
Feature: Navigate to the homepage

  Scenario: User is not logged in
    Given I am not logged in
    When I navigate to '/'
    Then I should see the homepage

  Scenario: User is logged in

    If a user navigates to the base path when they are logged in,
    they will be automatically routed to their dashboard. Logged-in users
    who don't want to be rerouted can visit '/#home' instead

    Given I am logged in
    When I navigate to '/'
    Then I should not see the homepage
    And I should see my dashboard