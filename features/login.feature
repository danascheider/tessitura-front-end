@javascript
Feature: User login

  Background:
    Given I am not logged in
    When I navigate to '/'

  Scenario: Initial state
    Then I should not see the '#shade' element
    And I should not see the '#login-form' element

  Scenario: Displaying the login form
    And I click the login link
    Then I should see the '#login-form' element

  Scenario: Hiding the login form
    And I click the login link
    And I double-click the '#shade' element
    # Then I should not see the '#shade' element
    # And I should not see the '#login-form' element

  Scenario: Logging in
