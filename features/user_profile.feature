@javascript
Feature: User profile

  Background:
    Given I am on the '/#profile' page

  Scenario Outline: Edit profile
    When I double-click on the <element> field
    Then an input should appear in the <element> field
    And the input should contain the text <value>

    Examples:
      | element   | value                |
      | username  | testuser             |
      | email     | testuser@example.com |
      | birthdate |                      |
      | fach      |                      |
      | city      |                      |