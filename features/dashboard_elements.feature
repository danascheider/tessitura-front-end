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

  Scenario: Closure of opened menus
    Given the 'Messages' menu is open
    When I click on the 'Alerts' dropdown
    Then I should not see the 'Messages' menu

  Scenario: Closing menu by clicking outside
    Given the 'Messages' menu is open
    When I click on the '#page-wrapper' element
    Then I should not see the 'Messages' menu

  Scenario: Opening sidebar
    Given the sidebar is hidden
    When I click on the '.navbar-header' element
    Then I should see the sidebar

  Scenario Outline: Closing sidebar
    Given the sidebar is visible
    When I <action>
    Then I should not see the sidebar

    Examples:
      | action                                |
      | click on the '.navbar-header' element |
      | double-click the 'nav' element        |