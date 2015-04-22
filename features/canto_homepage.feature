@javascript
Feature: Navigate to the homepage

  Scenario: User is not logged in
    Given I am not logged in
    When I navigate to '/'
    Then I should see the homepage

  Scenario: User is logged in
    Given I am logged in
    When I navigate to '/'
    Then I should not see the homepage