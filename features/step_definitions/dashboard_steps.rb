Given(/^I am on my dashboard$/) do 
  step 'I am logged in'
  step 'I navigate to the dashboard'
end

When(/^I click on the '(.*)' dropdown$/) do |title|
  within 'ul.navbar-top-links' do 
    selector = "li.dropdown[title=#{title}]"
    find(selector).click
  end
end

Then(/^I should see the '(.*)' menu$/) do |title|
  within "ul.navbar-top-links li.dropdown[title=#{title}]" do 
    selector = "ul.dropdown-#{title.downcase}"
    find(selector)
  end
end