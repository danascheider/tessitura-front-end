When(/^I click on the mark\-complete checkbox inside the '\#task\-(\d+)' element$/) do |id|
  within "#task-#{id}" do 
    find('i[title="Mark complete"]').click
  end
end

When(/^I click on the title in the '\#task\-(\d+)' element$/) do |id|
  within "#task-#{id}" do 
    find('.task-title').click
  end
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