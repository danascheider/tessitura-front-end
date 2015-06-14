@javascript
Feature: User profile

  Background:
    Given I am on the '/#profile' page

  Scenario Outline: Edit profile
    When I double-click on the <element> field
    Then an input should appear in the <element> field
    And the input should contain the text <value>
    And I should not see the 'span.p' element in the <element> field

    Examples:
      | element   | value                |
      | username  | testuser             |
      | email     | testuser@example.com |
      | birthdate |                      |
      | fach      |                      |
      | city      |                      |

  Scenario: Edit name
    When I double-click on the '#first_name' element
    Then an input called 'first_name' should appear
    And the input should contain the text 'Test'
    And I should not see an input called 'last_name'