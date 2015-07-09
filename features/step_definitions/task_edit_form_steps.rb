Then(/^I should see the '(.*)' (input|select|textarea|button)$/) do |title, tag|
  within '#task-edit-form' do 
    expect(page).to have_css("#{tag}[title='#{title}']", visible: true)
  end
end