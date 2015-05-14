When(/^I click on the '(\S+)' link in the sidebar$/) do |link|
  sleep 1
  within '#side-menu' do 
    click_on link
  end
end

Then(/^I should be on the tasks page$/) do
  within '#page-wrapper' do 
    expect(page).to have_selector('.kanban-board')
  end
end