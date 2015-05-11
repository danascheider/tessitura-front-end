When(/^I navigate to the dashboard$/) do 
  visit '/#dashboard'
end

Then(/^my task panel should show (\d+) tasks$/) do |num|
  within '#task-panel' do 
    expect(page).to have_selector('li.task-list-item', count: 2)
  end
end

Then(/^I should see my '(.*)' widget$/) do |name|
  expect(find("div[data-name=#{name}]")).to be_visible
end

Then(/^I should see my task panel$/) do 
  expect(find('#task-panel')).to be_visible
end

Then(/^my '(.*)' widget should say I have (\d+) (.*)$/) do |name, qty, obj|
  expect(find("div[data-name=#{name}] div.huge")).to have_content qty
end