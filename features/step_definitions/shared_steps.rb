Given(/^I am not logged in$/) do 
  visit('/#logout')
end

Given(/^I am logged in$/) do 
  visit('/') # It says "access denied" unless I visit some goddamned place first
  page.driver.set_cookie('auth', 'dGVzdHVzZXI6dGVzdHVzZXI%3D')
  page.driver.set_cookie('userID', 1)
end

When(/^I click on the '(.*)' element$/) do |selector|
  find(selector).click
end

When(/^I double-click the '(.*)' element$/) do |selector|
  evaluate_script("\$\('#{selector}'\).dblclick\(\)")
end

When(/^I fill in the '(.*)' field with '(.*)'$/) do |field, value|
  fill_in field, with: value
end

When(/^I navigate to '(.*)'$/) do |url|
  visit url
end

Then(/^I should (not )?see the '(.*)' element$/) do |neg, selector|
  if neg then expect(page).not_to have_css(selector) 
  else expect(page).to have_selector(selector, visible: true); end
end