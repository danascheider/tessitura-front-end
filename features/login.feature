@javascript
Feature: User login

  Background:
    Given I am not logged in
    When I navigate to '/'

  Scenario: Initial state
    Then I should not see the '#shade' element
    And I should not see the '#login-form' element

  Scenario: Displaying the login form
    When I click the login link
    Then I should see the '#login-form' element

  Scenario: Hiding the login form
    When I click the login link
    And I double-click the '#shade' element
    Then I should not see the '#shade' element
    And I should not see the '#login-form' element

  Scenario: Unsuccessful login attempt
    When I log in with invalid credentials
    Then the 'userID' cookie should not be set
    And the 'auth' cookie should not be set 
    And I should not see the '#dashboard-wrapper' element

  Scenario Outline: Logging in
    When I log in with 'Remember Me' <value>
    Then the 'userID' cookie should have value '1'
    And the 'auth' cookie should have value 'dGVzdHVzZXI6dGVzdHVzZXI%3D'
    And the cookies should <expectation>
    And I should see my dashboard

      Examples:
      | value | expectation        |
      | true  | expire in 365 days |
      | false | be session cookies |