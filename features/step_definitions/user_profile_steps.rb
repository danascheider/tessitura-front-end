Then(/^I should see my '(.*)' attribute$/) do |attribute|
  within '#profile-info' do
    expect(page).to have_text "#{attribute.match(/email/i) ? 'E-mail' : attribute.capitalize}:"
  end
end

Then(/^I should see that my (.*) is (.*)$/) do |attribute, value|
  attribute = attribute.match(/email/i) ? 'E-mail' : attribute.capitalize
  expect(page).to have_text "#{attribute}: #{value}"
end