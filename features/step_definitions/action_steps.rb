When(/^I click on the '(\S+)' link in the sidebar$/) do |link|
  sleep 1
  within '#side-menu' do 
    click_on link
  end
end

When(/^I click on the top widget '(.*)'$/) do |name|
  within '#dashboard-top-widgets' do 
    find("div.dash-widget[data-name=#{name}]").click
  end
end

Then(/^I should be on the tasks page$/) do
  expect(current_url).to match /\#tasks$/
end