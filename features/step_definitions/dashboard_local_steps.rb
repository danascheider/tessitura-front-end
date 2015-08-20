Given(/^I am a user with no location information$/) do

  # Make sure the user has no location information
  HTTParty.put('http://api.canto-test.com/users/1', 
    basic_auth: {username: 'testuser', password: 'testuser'},
    body: {city: nil, state: nil, zip: nil}
    )

  step 'I am logged in'
end

Given(/^I am a user with location information$/) do 
  # Give the user a state
  HTTParty.put('http://api.canto-test.com/users/1',
    basic_auth: {username: 'testuser', password: 'testuser'},
    body: {state: 'OR'}
    )

  step 'I am logged in'
end

Given(/^I am a user whose profile includes a city$/) do 
  # Give the user a city
  HTTParty.put('http://api.canto-test.com/users/1',
    basic_auth: {username: 'testuser', password: 'testuser'},
    body: {city: 'Portland'}
    )

  step 'I am logged in'
end

Then(/^I should see a form to enter my location information$/) do
  expect(find '.alert').to have_selector('#location-form')
end