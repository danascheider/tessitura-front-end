@javascript
Feature: User login

  Scenario: Initial state
    Given I am not logged in
    When I navigate to '/'
    Then I should not see the '#shade' element
    And I should not see the '#login-form' element

  Scenario: Displaying the login form
    Given I am not logged in
    When I navigate to '/'
    And I click the login link
    Then the I should see the '#login-form' element

  Scenario: Hiding the login form
    Given I am not logged in
    When I navigate to '/'
    And I click the login link
    And I double-click the '#shade' element
    # Then I should not see the '#shade' element
    # And I should not see the '#login-form' element