Given(/^I am on the homepage$/) do 
  step "I navigate to '/'"
end

When(/^I fill out the registration form with valid data$/) do 
  within '#registration-form' do 
    fill_in 'Username', with: 'testuser222'
  end
end