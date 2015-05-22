When(/^I click the login link$/) do
  find('#navbar-top a.login-link').click
end

When(/^I log in with 'Remember Me' (true|false)/) do |bool|
  step "I click the login link"
  step "I fill in the 'Username' field with 'testuser'"
  step "I fill in the 'Password' field with 'testuser'"
  step bool === 'true' ? "I check the 'Remember Me' checkbox" : "I uncheck the 'Remember Me' checkbox"
  step "I submit the login form"
end

When(/^I log in with invalid credentials$/) do 
  step "I click the login link"
  step "I fill in the 'Username' field with 'baddymcbadster'"
  step "I fill in the 'Password' field with 'iambaddy222'"
  step "I submit the login form"
end

When(/^I check the 'Remember Me' checkbox$/) do 
  check 'remember'
end

When(/^I uncheck the 'Remember Me' checkbox$/) do 
  uncheck 'remember'
end

When(/^I submit the login form$/) do 
  click_button 'Login'
end

Then(/^I should see my dashboard$/) do 
  expect(find '#dashboard-wrapper').to be_truthy
end

Then(/^I should not see the dashboard$/) do 
  expect(page).not_to have_selector('#dashboard-wrapper')
end

Then(/^the '(.*)' cookie should have value '(.*)'$/) do |name, value|
  wait_for_ajax
  cookies = (page.driver.cookies.select {|k,v| k === name })
  expect(cookies[name].value).to eq (value)
end

Then(/^the '(.*)' cookie should not be set$/) do |name|
  cookie = (page.driver.browser.cookies.select {|c| c.name = name}).first
  expect(cookie).to be nil
end

Then(/^the cookies should expire in (\d+) days$/) do |num|
  num = num.to_i
  exp = page.driver.cookies.map {|k,v| v.expires.to_date - Date.today }
  expect(exp).to eq(Array.new(exp.length, num))
end

Then(/^the cookies should be session cookies$/) do 
  vals = page.driver.cookies.map {|k,v| v.expires }

  # Session cookies do not have an ++expires++ attribute
  expect(vals).to eq(Array.new(vals.length, nil))
end