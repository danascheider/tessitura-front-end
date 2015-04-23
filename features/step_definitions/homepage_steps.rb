Given(/^I am not logged in$/) do 
  page.driver.browser.manage.delete_all_cookies
end

Given(/^I am logged in$/) do 
  visit('/')
  page.driver.browser.manage.add_cookie(name: 'auth', value: 'dGVzdHVzZXI6dGVzdHVzZXI=')
  page.driver.browser.manage.add_cookie(name: 'userID', value: 342)
  expect(page.driver.browser.manage.all_cookies).to be(true)
end

When(/^I navigate to '(.*)'$/) do |url|
  visit url
end

Then(/^I should (not )?see the homepage$/) do |neg|
  # if neg then expect(page).not_to have_selector('#homepage-wrapper')
  expect(page).to have_selector('#homepage-wrapper')
end