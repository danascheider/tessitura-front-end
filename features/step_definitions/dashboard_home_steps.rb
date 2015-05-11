When(/^I navigate to the dashboard$/) do 
  visit '/#dashboard'
end

Then(/^I should see my '(.*)' widget$/) do |name|
  expect(find("div[data-name=#{name}]")).to be_visible
end

Then(/^my '(.*)' widget should say I have (\d+) (.*)$/) do |name, qty, obj|
  expect(find("div[data-name=#{name}] div.huge")).to have_content qty
end