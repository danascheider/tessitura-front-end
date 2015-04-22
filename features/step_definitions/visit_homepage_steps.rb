Given(/^I am not logged in$/) do 
  page.driver.browser.clear_cookies
end

Given(/^I am logged in$/) do 
  page.driver.set_cookie('userID', 342);
  page.driver.set_cookie('auth', Base64.encode64('testuser:testuser'));
end

When(/^I navigate to '(.*)'$/) do |url|
  visit url
end

Then(/^I should (not )?see the homepage$/) do |neg|
  if neg then expect(page).not_to have_selector('#homepage-wrapper')
  else expect(page).to have_selector('#homepage-wrapper'); end
end