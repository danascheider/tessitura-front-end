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