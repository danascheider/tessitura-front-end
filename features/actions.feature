@javascript
Feature: Actions and links

  Scenario: User clicks '#tasks' link in dashboard sidebar
    Given I am on my dashboard
    And the sidebar is visible
    When I click on the 'Tasks' link in the sidebar
    Then I should be on the tasks page
    And I should not see the '.sidebar-collapse' element


  Scenario: User clicks top dash widget to navigate to tasks page
    Given I am on my dashboard
    When I click on the top widget 'tasks'    
    Then I should be on the tasks page

  Scenario: User clicks '#dashboard' link in dashboard sidebar
    Given I am on the '/tasks' page
    And the sidebar is visible
    When I click on the 'Dashboard' link in the sidebar
    Then I should be on my dashboard
    And I should not see the '.sidebar-collapse' element

  Scenario: User clicks the '#user-profile' link in the top nav menu
    Given I am on my dashboard
    When I click the 'User Profile' link in the top nav menu called 'User'
    Then I should be on the profile page

  Scenario: User hides the '#task-edit-form' element
    Given I am on my dashboard
    And I click on the 'Edit' icon inside the '#task-1' element
    When I double-click the '#shade' element
    Then I should not see the '#task-edit-form' element
    And I should not see the '#shade' element