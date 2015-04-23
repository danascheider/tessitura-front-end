Given(/^I am not logged in$/) do 
  page.driver.browser.manage.delete_all_cookies
end

Given(/^I am logged in$/) do 
  visit('/') # It says "access denied" unless I visit some goddamned place first
  page.driver.browser.manage.add_cookie(name: 'auth', value: 'dGVzdHVzZXI6dGVzdHVzZXI=')
  page.driver.browser.manage.add_cookie(name: 'userID', value: 342)
end

When(/^I navigate to '(.*)'$/) do |url|
  visit url
end

Then(/^I should (not )?see the homepage$/) do |neg|
  if neg then expect(page).not_to have_selector('#homepage-wrapper')
  else expect(page).to have_selector('#homepage-wrapper'); end
end