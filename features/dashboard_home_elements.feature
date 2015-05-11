@javascript
Feature: Dashboard home elements

  Background:
    Given I am on my dashboard

  # This data refers to the user object hard-coded in the test API. This user
  # has 5 tasks, 4 of which are incomplete. Note that values for resources other
  # than tasks are currently hard-coded

  Scenario Outline: Dashboard top widgets
    Then I should see my '<name>' widget
    And my '<name>' widget should say I have <num> <obj>

    Examples:
      | name            | num | obj                |
      | tasks           | 4   | incomplete tasks   |
      | deadlines       | 7   | upcoming deadlines |
      | appointments    | 4   | new appointments   |
      | recommendations | 14  | recommendations    |