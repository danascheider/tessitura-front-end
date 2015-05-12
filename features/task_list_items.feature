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

  Scenario: Click on the backlog icon
    When I click on the 'Backlog' icon inside the '#task-1' element
    Then the '#task-1' element should be removed from the DOM