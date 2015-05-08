Given(/^I am on the homepage$/) do 
  step "I navigate to '/'"
end

When(/^I fill out the registration form with valid data$/) do 
  within '#registration-form fieldset.login-information' do 
    fill_in 'username', with: 'testuser22'
    fill_in 'password', with: 'kh8980yh;lk;'
  end
end