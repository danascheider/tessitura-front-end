@javascript
Feature: Dashboard home elements

  The data refer in this feature pertain to the user object hard-coded in the 
  test API. This user has 5 tasks, 4 of which are incomplete. Note that values 
  for resources other than tasks are currently hard-coded.

  Background:
    Given I am on my dashboard

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

  Scenario Outline: Toggle task panel

    The user can show/hide the panel body of the task panel by clicking the '.toggle-widget' 
    icon, which becomes visible when they hover on the panel.

    Given the '.panel-body' element inside the '#task-panel' element is <original>
    When I click on the '.toggle-widget' element inside the '#task-panel>.panel-heading' element
    Then the '.panel-body' element inside the '#task-panel' element should be <new>

    Examples:
      | original | new     |
      | visible  | hidden  |
      | hidden   | visible |

  Scenario: Calendar

    Users should see their calendar when they log into the dashboard.

    Then I should see my calendar