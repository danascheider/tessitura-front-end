Given(/^the input inside the '(.*)' field is visible$/) do |field|
  step "I double-click on the '#{field}' field"
end

When(/^I click outside the '(.*)' field$/) do |field|
  find('body').click
end

When(/^I fill in the input '(.*)' with '(.*)' and press tab$/) do |field, value|
  step "I double-click on the '##{field}' element"
  within "##{field} > span.form" do 
    fill_in field, with: value
    find("input").native.send_key(:Tab)
  end
end

When(/^I submit the '(.*)' form with value '(.*)'$/) do |name, value|
  step "I double-click on the '##{name}' element"
  fill_in name, with: value
  find("input[name=#{name}]").native.send_key(:Enter)
end

When(/^I double-click on the '(.*)' field$/) do |element|
  within "#profile-tab span.profile-field##{element}" do 
    find('span.p').double_click
  end
end

When(/^I double-click on the '(.*)' element$/) do |element|
  page.find(element).double_click
end

Then(/^an input called (.*) should appear$/) do |name|
  @input = page.find("input[name=#{name}]")
  expect(@input).to be_truthy
end

Then(/^an input should appear in the (.*) field$/) do |element|
  within "tr[data-attribute=#{element}] .profile-field" do 
    @input = find('span.form input')
    expect(@input).to be_truthy
  end
end

Then(/^a select should appear in the (.*) field$/) do |element|
  within "tr[data-attribute=#{element}] .profile-field" do 
    @select = find('span.form select')
    expect(@select).to be_truthy
  end
end

Then(/^I should not see an input called '(.*)'$/) do |name|
  expect(page).to have_no_selector "input[name=#{name}]"
end

Then(/^I should not see the input inside the '(.*)' element$/) do |el|
  within el do 
    expect(page).to have_no_selector 'input'
  end
end

Then(/^I should not see the 'span\.p' element in the (.*) field$/) do |element|
  within "#profile-tab tr[data-attribute=#{element}]" do 
    expect(page).to have_no_selector 'span.p'
  end
end

Then(/^I should see my '(.*)' attribute$/) do |attribute|
  within '#profile-info' do
    expect(page).to have_text "#{attribute.match(/email/i) ? 'E-mail' : attribute.capitalize}:"
  end
end

Then(/^I should see that my (.*) is (.*)$/) do |attribute, value|
  attribute = attribute.match(/email/i) ? 'E-mail' : attribute.capitalize
  expect(page).to have_text "#{attribute}: #{value}"
end

Then(/^the '(.*)' input should not be visible$/) do |name|
  expect(page).not_to have_selector "input[name=#{name}]"
end

Then(/^the '(.*)' input should be visible$/) do |name|
  within '#profile-info' do 
    expect(find("##{name} .form")).to be_visible
  end
end

Then(/^the input should contain the text (?:'?)([^']*)(?:'?)$/) do |text|
  within '#profile-info' do 
    expect(@input.value).to eq text
  end
end

Then(/^the text in the '(.*)' element should be '(.*)'$/) do |el, text|
  expect(find(el)).to have_text text
end