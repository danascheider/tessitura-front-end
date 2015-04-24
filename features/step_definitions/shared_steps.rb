When(/^I double-click the '(.*)' element$/) do |selector|
  find(selector).double_click
end

When(/^I fill in the '(.*)' field with '(.*)'$/) do |field, value|
  fill_in field, with: value
end

When(/^I navigate to '(.*)'$/) do |url|
  visit url
end

Given(/^I am not logged in$/) do 
  visit('/#logout')
end

Given(/^I am logged in$/) do 
  visit('/') # It says "access denied" unless I visit some goddamned place first
  page.driver.browser.manage.add_cookie(name: 'auth', value: 'dGVzdHVzZXI6dGVzdHVzZXI=')
  page.driver.browser.manage.add_cookie(name: 'userID', value: 342)
end