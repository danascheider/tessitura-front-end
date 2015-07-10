When(/^I fill out the '#task-edit-form' with valid attributes$/) do
  within '#task-edit-form' do 
    fill_in 'title', with: 'Give tasks better titles'
  end
end

When(/^I fill out the '#task-edit-form' with no title$/) do 
  within '#task-edit-form' do 
    fill_in 'title', with: ''
  end
end

When(/^I submit the '(\S*)'$/) do |form_id|
  click_button 'Update Task'
end

Then(/^I should see the '(.*)' (input|select|textarea|button)$/) do |title, tag|
  within '#task-edit-form' do 
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