Given(/^I am on my dashboard$/) do 
  step 'I am logged in'
  step 'I navigate to the dashboard'
end

Given(/^the (.*) menu is open$/) do |title|
  within "ul.navbar-top-links" do 
    find("li.dropdown[title=#{title}]").click
  end
end

Given(/^the sidebar is hidden$/) do 
  if page.has_selector? '#side-menu'
    find('.navbar-header').click
  end
end

Given(/^the sidebar is visible$/) do 
  unless page.has_selector? '#side-menu'
    find('.navbar-header').click
  end
end

When(/^I click on the '(.*)' dropdown$/) do |title|
  within 'ul.navbar-top-links' do 
    selector = "li.dropdown[title=#{title}]"
    find(selector).click
  end
end

Then(/^I should not see the '(.*)' menu$/) do |title|
  within "ul.navbar-top-links li.dropdown[title=#{title}]" do 
    selector = "ul.dropdown-#{title.downcase}"
    expect(page).not_to have_selector selector
  end
end

Then(/^I should see the '(.*)' menu$/) do |title|
  within "ul.navbar-top-links li.dropdown[title=#{title}]" do 
    selector = "ul.dropdown-#{title.downcase}"
    expect(find(selector)).to be_visible
  end
end

Then(/^I should not see the sidebar$/) do
  expect(page).not_to have_selector '#side-menu'
end

Then(/^I should see the sidebar$/) do 
  expect(find('#side-menu')).to be_visible
end