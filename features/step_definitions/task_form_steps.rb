When(/^I click on the 'Expand' icon inside the '.quick-add-form' element$/) do
  within 'form.quick-add-form .form-group' do 
    find('i[title=Expand]').click
  end
end

When(/^I fill out the '#task-edit-form' with valid attributes$/) do
  within '#task-edit-form' do 
    fill_in 'title', with: 'Give tasks better titles'
  end
end

When(/^I fill out the '#task-create-form' with valid attributes$/) do 
  within '#task-create-form' do 
    fill_in 'title', with: 'Create a new task'
  end
end

When(/^I fill out the '#task-edit-form' with no title$/) do 
  within '#task-edit-form' do 
    fill_in 'title', with: ''
  end
end

When(/^I submit the '#task-create-form'$/) do 
  within '#task-create-form' do 
    click_button 'Create Task'
  end
end

When(/^I submit the '#task-edit-form'$/) do
  within '#task-edit-form' do 
    click_button 'Update Task'
  end
end

Then(/^I should see the '(.*)' (input|select|textarea|button) inside the '(.*)'$/) do |title, tag, el|
  within el do 
    expect(page).to have_css("#{tag}[title='#{title}']", visible: true)
  end
end

Then(/^the '(\S+)' row of the '(\S+)' should have class '(\S+)'$/) do |title, element, klass|
  within element do 
    expect(page.find("tr.#{klass}")).to have_selector("input[title=#{title}]")
  end
end

Then(/^the form should (not )?be hidden$/) do |negation|
  if negation
    expect(page).to have_selector('#task-edit-form')
  else
    expect(page).not_to have_selector('#task-edit-form')
  end
end