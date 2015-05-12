Given(/^I am on the '\/\#tasks' page$/) do 
  step 'I am logged in'
  step "I navigate to '/#tasks'"
end

Then(/^I should see the '(\S+)' column$/) do |id|
  step "I should see the '#{id}' element"
end

Then(/^the '(\S+)' column should contain (\d+) tasks$/) do |id, count|
  within id do 
    expect(page).to have_selector('li.task-list-item', count: count)
  end
end

Then(/^the '(\S+)' column should have its own quick\-add form$/) do |id|
  within id do 
    expect(find('form.quick-add-form')).to be_visible
  end
end