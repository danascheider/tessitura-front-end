@javascript
Feature: Task Edit Form

  Background:
    Given I am on my dashboard
    And I click on the 'Edit' icon inside the '#task-1' element

  Scenario Outline: View elements
    Then I should see the <element>

      Examples: 
        | element                |
        | 'Title' input          | 
        | 'Deadline' input       |
        | 'Status' select        |
        | 'Priority' select      | 
        | 'Notes' textarea       |
        | 'Update Task' button   |

  Scenario: Fill out the edit form
    When I fill out the '#task-edit-form' with valid attributes
    When I submit the '#task-edit-form'
    Then the form should be hidden

  Scenario: Try to delete the task's title
    When I fill out the '#task-edit-form' with no title
    When I submit the '#task-edit-form'
    Then the form should not be hidden
    And the 'Title' row of the '#task-edit-form' should have class 'has-error'