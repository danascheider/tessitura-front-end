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

  Scenario: Create a new task from the task panel
    Given I am on my dashboard
    When I submit the quick-add form with 'Another Task'
    Then my task panel should show 3 tasks
    And the first list item should contain the text 'Another Task'