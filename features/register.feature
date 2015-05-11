@javascript
Feature: User registration

  Background:
    Given I am not logged in
    And I am on the homepage

  Scenario: Valid registration
    When I fill out the registration form with valid data
    And I accept the terms of use
    And I submit the registration form
    Then no fields should have class 'has_error'
    And I should be routed to my dashboard
    And the dashboard should have my name on it

  Scenario: Terms not accepted
    When I fill out the registration form with valid data
    But I don't accept the terms of use
    And I submit the registration form
    Then I should not be routed to my dashboard
    And the 'terms' div should have class 'has-error'

  Scenario Outline: Missing data
    When I fill out the registration form with the <attribute> attribute blank
    And I submit the registration form
    Then I should not be routed to my dashboard
    And the <attribute> input should have class 'has-error'

    Examples:
      | attribute  |
      | username   |
      | password   |
      | email      |
      | first_name |
      | last_name  |

Scenario Outline: Invalid data
  When I fill out the registration form with <attribute> '<value>'
  And I submit the registration form
  Then I should not be routed to my dashboard
  And the <attribute> input should have class 'has-error'

  Examples:
    | attribute | value |
    | username  | foo   |
    | password  | bar   |
    | email     | baz   |

Scenario Outline: Duplicate username or email
  Given there is a user with <attribute> '<value>'
  When I fill out the registration form with <attribute> '<value>'
  Then I should not be routed to my dashboard
  And the <attribute> input should have class 'has-error'

  Examples:
    | attribute | value                  |
    | username  | testuser86             |
    | email     | testuser86@example.com | 