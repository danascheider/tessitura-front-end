Given(/^I am on the homepage$/) do 
  step "I navigate to '/'"
end

When(/^I fill out the registration form with valid data$/) do 
  within '#registration-form' do 
    within 'fieldset.login-information' do 
      fill_in 'username', with: 'testuser22'
      fill_in 'password', with: 'kh8980yh;lk;'
      fill_in 'email', with: 'thisismyemail@example.com'
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