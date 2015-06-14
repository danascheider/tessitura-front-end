@javascript
Feature: User profile view

  Background:
    Given I am on the '/#profile' page

  Scenario Outline: Data
    Then I should see my '<attribute>' attribute
    And I should see that my <attribute> is <value>

    Examples:
      | attribute | value                |
      | username  | testuser             |
      | email     | testuser@example.com |
      | name      | Test User            |