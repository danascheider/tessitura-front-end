When(/^I click the login link$/) do
  find('#navbar-top a.login-link').click
end

When(/^I double-click the '(.*)' element$/) do |selector|
  find(selector).double_click
end

When(/^I check the 'Remember Me' checkbox$/) do 
  check 'Remember Me'
end

When(/^I uncheck the 'Remember Me' checkbox$/) do 
  uncheck 'Remember Me'
end

When(/^I fill in the '(.*)' field with '(.*)'$/) do |field, value|
  fill_in field, with: value
end

When(/^I submit the form$/) do 
  click_button 'Login'
end

Then(/^I should (not )?see the '(.*)' element$/) do |neg, selector|
  save_screenshot('screenshot.png')
  if neg then expect(page).not_to have_selector(selector, visible: true) 
  else expect(page).to have_selector(selector, visible: true); end
end

Then(/^I should see my dashboard$/) do 
  expect(find '#dashboard-wrapper').to be_truthy
end

Then(/^I should not see the dashboard$/) do 
  expect(page).not_to have_selector('#dashboard-wrapper')
end

Then(/^the '(.*)' cookie should have value '(.*)'$/) do |name, value|
  wait_for_ajax
  cookie = page.driver.browser.manage.all_cookies.find {|cookie| cookie[:name] == name }
  expect(cookie[:value]).to eq(value)
end

Then(/^the '(.*)' cookie should not be set$/) do |name|
  cookie = page.driver.browser.manage.all_cookies.find {|cookie| cookie[:name] == name }
  expect(cookie).to be nil
end

Then(/^the cookies should expire in (\d+) days$/) do |num|
  num = num.to_i
  exp = page.driver.browser.manage.all_cookies.map {|c| c[:expires].to_date - Date.today }
  expect(exp).to eq(Array.new(exp.length, num))
end

Then(/^the cookies should be session cookies$/) do 
  vals = page.driver.browser.manage.all_cookies.map {|c| c[:expires] }
  expect(vals).to eq(Array.new(vals.length, nil))
end