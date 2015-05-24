@javascript
Feature: Actions and links

  Scenario: User clicks '#tasks' link in dashboard sidebar
    Given I am on my dashboard
    And the sidebar is visible
    When I click on the 'Tasks' link in the sidebar
    Then I should be on the tasks page
    And I should not see the '.sidebar-collapse' element

  Scenario: User clicks '#dashboard' link in dashboard sidebar
    Given I am on the '/#tasks' page
    And the sidebar is visible
    When I click on the 'Dashboard' link in the sidebar
    Then I should be on my dashboard
    And I should not see the '.sidebar-collapse' element