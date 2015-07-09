@javascript
Feature: Task List Items

  Unfortunately, there is no good way to test yet whether functions for updating
  tasks actually work. This is because Capybara can't make requests to the server
  directly and views for individual tasks are not yet available.
  
  Background:
    Given I am on my dashboard 

  Scenario: Expand task list item
    When I click on the title in the '#task-1' element
    Then I should see the '#task-1' element's '.task-details' element

  Scenario: Click the checkbox
    When I click on the mark-complete checkbox inside the '#task-1' element
    Then the mark-complete checkbox should be checked
    And there should be a line through the title in the '#task-1' element
    And the '#task-1' element should be removed from the DOM after a short time

  Scenario Outline: Click on the backlog and delete icons
    When I click on the '<title>' icon inside the '#task-1' element
    Then the '#task-1' element should be removed from the DOM

    Examples:
      | title   |
      | Backlog |
      | Delete  |

  Scenario: Click on the edit icon
    When I click on the 'Edit' icon inside the '#task-1' element
    Then I should see the '#task-edit-form' element