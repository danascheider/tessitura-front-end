@javascript
Feature: Dashboard Home
  
  Scenario: Navigate to the dashboard
    Given I am logged in
    When I navigate to the dashboard
    Then I should see the '#dashboard-wrapper' element

  Scenario: Unauthenticated user attempts to navigate to the dashboard
    Given I am not logged in
    When I navigate to the dashboard
    Then I should not see the '#dashboard-wrapper' element
    And I should see the '#homepage-wrapper' element