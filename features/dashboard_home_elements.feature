@javascript
Feature: Dashboard home elements

  Background:
    Given I am on my dashboard

  # These data refer to the user object hard-coded in the test API. This user
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

  Scenario: Dashboard task panel

    Only tasks that are incomplete, not blocking, and not backlogged are shown

    Then I should see my task panel
    And my task panel should show 2 tasks
    And the task details should not be visible

  Scenario: Hide task panel
    Given the '.panel-body' element inside the '#task-panel' element is visible
    When I click on the '.toggle-widget' element inside the '#task-panel>.panel-heading' element
    Then the '.panel-body' element inside the '#task-panel' element should be hidden