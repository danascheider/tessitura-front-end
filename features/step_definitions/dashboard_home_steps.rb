Given(/^the '.panel-body' element inside the '#task-panel' element is hidden$/) do
  within '#task-panel' do 
    if page.has_selector? '.panel-body'
      find('.panel-heading').hover
      find('.toggle-widget').click
    end
  end
end

Given(/^the '.panel-body' element inside the '#task-panel' element is visible$/) do
  within '#task-panel' do 
    unless page.has_selector? '.panel-body'
      find('.panel-heading').hover
      find('.toggle-widget').click
    end
  end
end

When(/^I click on the '(\S*)' element inside the '(\S*)' element$/) do |child, parent|
  find(parent).hover

  within parent do 
    find(child).click
  end
end

When(/^I submit the quick\-add form with '(.*)'$/) do |title|
  within '#task-panel form.quick-add-form' do 
    fill_in 'title', with: title
    input = find('input[name=title]')
    input.native.send_key(:Enter)
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
    wait_for_ajax
    expect(page).to have_selector('li.task-list-item', count: num)
  end
end

Then(/^my '(.*)' widget should say I have (\d+) (.*)$/) do |name, qty, obj|
  expect(find("div[data-name=#{name}] div.huge")).to have_content qty
end

Then(/^the first list item should contain the text '(.*)'$/) do |text|
  within '#task-panel' do 
    expect(first('li.task-list-item')).to have_content text
  end
end

Then(/^the '(\S*)' element inside the '(\S*)' element should be hidden$/) do |child, parent|
  within parent do 
    expect(page).not_to have_selector child 
  end
end

Then(/^the '(\S*)' element inside the '(\S*)' element should be visible$/) do |child, parent|
  within parent do 
    expect(find(child)).to be_visible 
  end
end