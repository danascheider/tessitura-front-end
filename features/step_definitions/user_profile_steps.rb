When(/^I double-click on the (.*) field$/) do |element|
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
  within "#profile-tab tr[data-attribute=#{element}]" do 
    @input = find('input')
    expect(@input).to be_truthy
  end
end

Then(/^I should not see an input called '(.*)'$/) do |name|
  expect(page).to have_no_selector "input[name=#{name}]"
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

Then(/^the input should contain the text (?:'?)([^']*)(?:'?)$/) do |text|
  within '#profile-info' do 
    expect(@input.value).to eq text
  end
end