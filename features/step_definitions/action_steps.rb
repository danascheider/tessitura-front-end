When(/^I click on the '(\S+)' link in the sidebar$/) do |link|
  sleep 1
  within '#side-menu' do 
    click_on link
  end
end

When(/^I click the '(.*)' link in the top nav menu called '(.*)'$/) do |link, name|
  step "I click the top nav menu called '#{name}'"
  within "ul.navbar-top-links > li.dropdown[title=#{name}] " do 
    click_link link
  end
end

When(/^I click on the top widget '(.*)'$/) do |name|
  within '#dashboard-top-widgets' do 
    find("div.dash-widget[data-name=#{name}]").click
  end
end

When(/^I click the top nav menu called '(.*)'$/) do |name|
  within 'ul.navbar-top-links' do 
    find("li.dropdown[title=#{name}]").click
  end
end

Then(/^I should be on the (.*) page$/) do |page|
  expect(current_url).to include page
end