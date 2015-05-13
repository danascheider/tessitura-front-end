@javascript
Feature: Dashboard task view

  Background:
    Given I am on the '/#tasks' page

  Scenario Outline: Elements
    Then I should see the '<el>' column
    And the '<el>' column should contain <qty> tasks
    And the '<el>' column should have its own quick-add form

    Examples:
      | el                 | qty |
      | #backlog-tasks     | 1   |
      | #new-tasks         | 2   |
      | #in-progress-tasks | 0   |
      | #blocking-tasks    | 1   |

  Scenario Outline: Submit quick-add form in Kanban columns
    When I submit the quick-add form in the '<name>' column with 'Another Task'
    Then the '<name>' column should contain <num> tasks
    And the first task in the '<name>' column should be called 'Another Task'

    Examples:
      | name               | num |
      | #backlog-tasks     | 2   |
      | #new-tasks         | 3   |
      | #in-progress-tasks | 1   |
      | #blocking-tasks    | 2   |