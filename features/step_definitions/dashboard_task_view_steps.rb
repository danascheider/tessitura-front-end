Given(/^I am on the '\/\#tasks' page$/) do 
  step 'I am logged in'
  step "I navigate to '/#tasks'"
end

When(/^I submit the quick\-add form in the '(\S+)' column with '(.*)'$/) do |col, title|
  within col do 
    fill_in 'title', with: title
    input = find('input[name=title]')
    input.native.send_key(:Enter)
  end
end

Then(/^I should see the '(\S+)' column$/) do |id|
  step "I should see the '#{id}' element"
end

Then(/^the '(\S+)' column should contain (\d+) tasks$/) do |id, count|
  within id do 
    wait_for_ajax
    expect(page).to have_selector('li.task-list-item', count: count)
  end
end

Then(/^the '(\S+)' column should have its own quick\-add form$/) do |id|
  within id do 
    expect(find('form.quick-add-form')).to be_visible
  end
end

Then(/^the first task in the '(\S+)' column should be called '(.*)'$/) do |id, title|
  within id do 
    expect(first('li.task-list-item')).to have_content title
  end
end