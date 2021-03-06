@javascript
Feature: User profile

  Background:
    Given I am on the '/profile' page

  Scenario Outline: Show inputs
    When I double-click on the '<element>' field
    Then an input should appear in the <element> field
    And the input should contain the text <value>
    And I should not see the 'span.p' element in the <element> field

    Examples:
      | element   | value                |
      | username  | testuser             |
      | email     | testuser@example.com |
      | birthdate |                      |
      | city      |                      |

  Scenario: Show select
    When I double-click on the 'fach' field
    Then a select should appear in the 'fach' field
    And I should not see the 'span.p' element in the 'fach' field

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

  Scenario Outline: Re-rendering after name change
    When I submit the '<field>' form with value '<value>'
    Then the '#profile-tab' element should contain the text '<title>'

      Examples:
        | field      | value | title                |
        | first_name | Alex  | Alex User's Profile  |
        | last_name  | Smith | Test Smith's Profile | 

  Scenario: Click outside the input
    Given the input inside the 'last_name' field is visible
    When I click outside the 'last_name' field
    Then the 'last_name' input should not be visible
    And the text in the '#last_name' element should be 'User'

  Scenario Outline: Tab between inputs changing values
    When I fill in the input '<first>' with '<value>' and press tab
    Then the '<first>' input should not be visible
    And the '<second>' input should be visible

    Examples:
      | first      | value       | second    |
      | first_name | George      | last_name |
      | last_name  | Smith       | username  |
      | username   | georgesmith | email     |
