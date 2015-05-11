@javascript
Feature: Dashboard Home
  
  Scenario: Navigate to the dashboard
    Given I am logged in
    When I navigate to the dashboard
    Then I should see my dashboard

  Scenario: Unauthenticated user attempts to navigate to the dashboard
    Given I am not logged in
    When I navigate to the dashboard
    Then I should not be routed to my dashboard
    And I should see the '#homepage-wrapper' element