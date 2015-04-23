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
    # Then I should not see the '#shade' element
    # And I should not see the '#login-form' element

  Scenario: Unsuccessful login attempt
    When I click the login link
    And I fill in the 'Username' field with 'baddymcbadster'
    And I fill in the 'Password' field with 'mynameisbaddymcbadster2'
    And I submit the form
    Then the 'userID' cookie should not be set
    And the 'auth' cookie should not be set 
    And I should not see the dashboard

  Scenario Outline: Logging in
    When I click the login link
    And I fill in the 'Username' field with 'testuser'
    And I fill in the 'Password' field with 'testuser'
    And I <action> the 'Remember Me' checkbox
    And I submit the form
    Then the 'userID' cookie should have value '342'
    And the 'auth' cookie should have value 'dGVzdHVzZXI6dGVzdHVzZXI%3D'
    And the cookies should <expectation>
    And I should see my dashboard

      Examples:
      | action  | expectation        |
      | check   | expire in 365 days |
      | uncheck | be session cookies |