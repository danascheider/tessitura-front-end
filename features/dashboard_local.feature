@javascript
Feature: Dashboard local view
  
  The dashboard local view will show the user organizations and opportunities in their area.

  Scenario: User views local page
    Given I am logged in
    When I navigate to '/#local'
    Then I should see a form to enter my location information