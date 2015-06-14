When(/^I double-click on the (.*) field$/) do |element|
  within "#profile-tab tr[data-attribute=#{element}]" do 
    find('td').double_click
  end
end

Then(/^an input should appear in the (.*) field$/) do |element|
  within "#profile-tab tr[data-attribute=#{element}]" do 
    @input = find('input')
    expect(@input).to be_truthy
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

Then(/^the input should contain the text (.*)$/) do |text|
  within '#profile-info' do 
    expect(@input.value).to eq text
  end
end