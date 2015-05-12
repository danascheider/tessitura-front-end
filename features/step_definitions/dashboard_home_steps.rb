Given(/^the '(\S*)' element inside the '(\S*)' element is visible$/) do |child, parent|
  within parent do 
    expect(find(child)).to be_visible
  end
end

When(/^I click on the '(\S*)' element inside the '(\S*)' element$/) do |child, parent|
  find(parent).hover

  within parent do 
    find(child).click
  end
end

Then(/^I should see my '(.*)' widget$/) do |name|
  expect(find("div[data-name=#{name}]")).to be_visible
end

Then(/^I should see my task panel$/) do 
  expect(find('#task-panel')).to be_visible
end

Then(/^I should see the '(\S*)' element's '(\S*)' element$/) do |parent, child|
  within parent do 
    find(child)
  end
end

Then(/^my task panel should show (\d+) tasks$/) do |num|
  within '#task-panel' do 
    expect(page).to have_selector('li.task-list-item', count: 2)
  end
end

Then(/^my '(.*)' widget should say I have (\d+) (.*)$/) do |name, qty, obj|
  expect(find("div[data-name=#{name}] div.huge")).to have_content qty
end

Then(/^the '(\S*)' element inside the '(\S*)' element should be hidden$/) do |child, parent|
  within parent do 
    expect(page).not_to have_selector child 
  end
end