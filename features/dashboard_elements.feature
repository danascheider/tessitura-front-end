@javascript
Feature: Dashboard elements

  Background:
    Given I am on my dashboard

  Scenario Outline: Top nav bar
    When I click on the '<title>' dropdown

    Examples:
      | title    |
      | Messages | 
      | Alerts   |
      | Tasks    |
      | Profile  |