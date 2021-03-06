When(/^I click the 'Backlog' icon for the first task in the '(\S+)' column$/) do |id|
  within "#{id} ul" do 
    first('.task-list-item').hover

    within first('.task-list-item') do 
      find('i.fa-archive').click
    end
  end
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