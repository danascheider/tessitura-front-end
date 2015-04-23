When(/^I click the login link$/) do
  page.find('#navbar-top a.login-link').click
end

When(/^I double-click the '(.*)' element$/) do |selector|
  page.find(selector).double_click
end

Then(/^I should (not )?see the '(.*)' element$/) do |neg, selector|
  if neg then expect(page).not_to have_selector(selector, visible: true) 
  else expect(page.find(selector)).to be_visible; end
end