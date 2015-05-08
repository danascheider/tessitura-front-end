Given(/^I am on the homepage$/) do 
  step "I navigate to '/'"
end

When(/^I submit the registration form with valid data$/) do 
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

    within 'fieldset.terms' do 
      check 'acceptTerms'
    end

    within 'fieldset.submit' do 
      click_button 'Create Account'
    end
  end
end

Then(/^I should be routed to my dashboard$/) do 
  wait_for_ajax
  expect(find('#dashboard-wrapper')).to be_visible
end

Then(/^the dashboard should have my name on it$/) do 
  expect(page).to have_text('New User')
end