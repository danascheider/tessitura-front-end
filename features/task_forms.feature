@javascript
Feature: Task Forms

  Background:
    Given I am on my dashboard

  Scenario Outline: View elements
    When I click on the '<icon>' icon inside the '<element1>' element
    Then I should see the <element2> inside the '<element3>'

      Examples: 
        | icon   | element1        | element2               | element3           |
        | Edit   | #task-1         | 'Title' input          | #task-edit-form    |
        | Edit   | #task-1         | 'Deadline' input       | #task-edit-form    |
        | Edit   | #task-1         | 'Status' select        | #task-edit-form    |
        | Edit   | #task-1         | 'Priority' select      | #task-edit-form    |
        | Edit   | #task-1         | 'Notes' textarea       | #task-edit-form    |
        | Edit   | #task-1         | 'Update Task' button   | #task-edit-form    |
        | Expand | .quick-add-form | 'Title' input          | #task-create-form  |
        | Expand | .quick-add-form | 'Deadline' input       | #task-create-form  |
        | Expand | .quick-add-form | 'Status' select        | #task-create-form  |
        | Expand | .quick-add-form | 'Priority' select      | #task-create-form  |
        | Expand | .quick-add-form | 'Notes' textarea       | #task-create-form  |
        | Expand | .quick-add-form | 'Create Task' button   | #task-create-form  |

  Scenario: Fill out the edit form
    When I click on the 'Edit' icon inside the '#task-1' element
    And I fill out the '#task-edit-form' with valid attributes
    And I submit the '#task-edit-form'
    Then the form should be hidden

  Scenario: Try to delete the task's title
    When I click on the 'Edit' icon inside the '#task-1' element
    And I fill out the '#task-edit-form' with no title
    And I submit the '#task-edit-form'
    Then the form should not be hidden
    And the 'Title' row of the '#task-edit-form' should have class 'has-error'

  Scenario: Create a task with valid attributes
    When I click on the 'Expand' icon inside the '.quick-add-form' element
    And I fill out the '#task-create-form' with valid attributes
    And I submit the '#task-create-form'
    Then the form should be hidden
    And my task panel should show 3 tasks
    And my 'tasks' widget should say I have 4 incomplete tasks
