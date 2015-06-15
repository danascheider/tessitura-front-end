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

  Scenario Outline: Edit name
    When I double-click on the '#<name>' element
    Then an input called '<name>' should appear
    And the input should contain the text '<text>'
    And I should not see an input called '<bad>'

      Examples:
        | name       | text | bad        |
        | first_name | Test | last_name  |
        | last_name  | User | first_name | 

  Scenario: Submitting the changes
    When I submit the 'city' form with value 'Louisville'
    Then I should not see the input inside the '#city' element
    And the text in the '#city' element should be 'Louisville'

  Scenario: Click outside the input
    Given the input inside the 'last_name' field is visible
    When I click outside the 'last_name' field
    Then the 'last_name' field should not be visible
    And the text inside the '#last-name' element should be 'User'