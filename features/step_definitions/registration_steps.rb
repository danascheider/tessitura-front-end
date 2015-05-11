Given(/^I am on the homepage$/) do 
  step "I navigate to '/'"
end

When(/^I fill out the registration form with valid data$/) do 
  within '#registration-form' do 
    within 'fieldset.login-information' do 
      fill_in 'username', with: '22testuser22'
      fill_in 'password', with: 'kh8980yhlk'
      fill_in 'email', with: 'newtestuseremail@example.com'
    end

    within 'fieldset.profile-information' do 
      fill_in 'first_name', with: 'New'
      fill_in 'last_name', with: 'User'
      # fill_in 'birthdate'... # Eventually birthdate should be required
    end
  end
end

When(/^I (don't )?accept the terms of use$/) do |neg|
  within '#registration-form div.terms' do 
    if neg then uncheck 'acceptTerms'; else check 'acceptTerms'; end
  end
end

When(/^I fill out the registration form with the (.*) attribute blank$/) do |attr|
  step 'I fill out the registration form with valid data'

  within '#registration-form' do 
    fill_in attr, with: ''
  end
end

When(/^I submit the registration form$/) do 
  within '#registration-form fieldset.submit' do 
    click_button 'Create Account'
  end
end

Then(/^I should (not )?be routed to my dashboard$/) do |neg|
  wait_for_ajax
  if neg
    expect(page).not_to have_selector('#dashboard-wrapper')
  else
    expect(find('#dashboard-wrapper')).to be_visible
  end
end

Then(/^the dashboard should have my name on it$/) do 
  expect(page).to have_text('New User')
end

Then(/^the '(.*)' (.*) should have class '(.*)'$/) do |klass1, tag, klass2|
  selector = "#registration-form #{tag}.#{klass1}"
  expect(find(selector)['class']).to include(klass2)
end

Then(/^the (\w*) (.*) should have class '(.*)'$/) do |attr, tag, klass|
  selector = "#registration-form #{tag}[name=#{klass}]"
end