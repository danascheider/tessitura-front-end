When(/^I click the login link$/) do
  page.find('#navbar-top a.login-link').click
end

When(/^I double-click the '(.*)' element$/) do |selector|
  page.find(selector).double_click
end

When(/^I check the 'Remember Me' checkbox$/) do 
  check('Remember Me')
end

When(/^I fill in the '(.*)' field with '(.*)'$/) do |field, value|
  fill_in field, with: value
end

Then(/^I should (not )?see the '(.*)' element$/) do |neg, selector|
  if neg then expect(page).not_to have_selector(selector, visible: true) 
  else expect(page.find(selector)).to be_visible; end
end