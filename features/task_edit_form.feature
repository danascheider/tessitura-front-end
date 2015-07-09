@javascript
Feature: Task Edit Form

  Background:
    Given I am on my dashboard
    And I click on the 'Edit' icon inside the '#task-1' element

  Scenario Outline: View elements
    Then I should see the <element>

      Examples: 
        | element                |
        | 'Title'       input    | 
        | 'Deadline'      input  |
        | 'Status'      select   |
        | 'Priority'      select | 
        | 'Notes'      textarea  |
        | 'Update Task' button   |