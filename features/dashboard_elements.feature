@javascript
Feature: Dashboard elements

  Background:
    Given I am on my dashboard

  Scenario Outline: Expanding top nav menus
    When I click on the '<title>' dropdown
    Then I should see the '<title>' menu

    Examples:
      | title    |
      | Messages | 
      | Alerts   |
      | Tasks    |
      | User     |