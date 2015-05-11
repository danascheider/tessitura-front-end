@javascript
Feature: Dashboard elements

  Background:
    Given I am on my dashboard

  Scenario Outline: Expanding top nav menus
    When I click on the '<title>' dropdown
    Then I should see the '<title>' menu
    And I should not see the '<menu1>' menu
    And I should not see the '<menu2>' menu
    And I should not see the '<menu3>' menu

    Examples:
      | title    | menu1    | menu2  | menu3 |
      | Messages | Alerts   | Tasks  | User  |
      | Alerts   | Messages | Tasks  | User  |
      | Tasks    | Messages | Alerts | User  |
      | User     | Messages | Alerts | Tasks |