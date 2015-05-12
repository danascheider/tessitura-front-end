When(/^I navigate to the dashboard$/) do 
  visit '/#dashboard'
end

When(/^I click on the mark\-complete checkbox inside the '\#task\-(\d+)' element$/) do |id|
  within "#task-#{id}" do 
    find('i[title="Mark complete"]').click
  end
end

Then(/^I should see my '(.*)' widget$/) do |name|
  expect(find("div[data-name=#{name}]")).to be_visible
end

Then(/^I should see my task panel$/) do 
  expect(find('#task-panel')).to be_visible
end

Then(/^I should see the '(\S*)' element's '(\S*)' element$/) do |parent, child|
  find('#task-1')
end

Then(/^my task panel should show (\d+) tasks$/) do |num|
  within '#task-panel' do 
    expect(page).to have_selector('li.task-list-item', count: 2)
  end
end

Then(/^my '(.*)' widget should say I have (\d+) (.*)$/) do |name, qty, obj|
  expect(find("div[data-name=#{name}] div.huge")).to have_content qty
end

Then(/^the mark\-complete checkbox should be checked$/) do 
  expect(page).to have_selector 'i.fa-check-square-o[title="Mark complete"]'
end

Then(/^the '\#task\-(\d+)' element should be removed from the DOM after a short time$/) do |id|
  sleep 0.75
  expect(page).not_to have_selector("#task-#{id}")
end

Then(/^the task details should not be visible$/) do 
  within '#task-panel' do 
    expect(page).not_to have_selector '.task-details'
  end
end

Then(/^there should be a line through the title in the '\#task\-(\d+)' element$/) do |id|
  within "#task-#{id}" do 
    el = find('a.task-title', visible: true)
    expect(el[:style]).to match(/text-decoration: line-through/)
  end
end