@javascript
Feature: Dashboard local view
  
  The dashboard local view will show the user organizations and opportunities in their area.

  Scenario: User with no location information 
    Given I am a user with no location information
    When I navigate to '/#local'
    Then I should see a form to enter my location information

  Scenario: User with only a city

    Users whose profile includes only a city still need to enter a state or ZIP before
    they can use the local results. We don't know which Springfield it is.

    Given I am a user whose profile includes a city
    When I navigate to '/#local'
    Then I should see a form to enter my location information

  Scenario: User with location information
    Given I am a user with location information
    When I navigate to '/#local'
    Then I should not see the '#location-form' element