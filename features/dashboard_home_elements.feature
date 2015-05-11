@javascript
Feature: Dashboard home elements

  Background:
    Given I am on my dashboard

  # This data refers to the user object hard-coded in the test API. This user
  # has 5 tasks, 4 of which are incomplete.

  Scenario: Dashboard top widgets
    Then I should see my 'tasks' widget
    And my 'tasks' widget should say I have 4 tasks