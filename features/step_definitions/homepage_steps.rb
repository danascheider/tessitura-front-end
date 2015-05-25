Then(/^I should (not )?see the homepage$/) do |neg|
  if neg then expect(page).not_to have_selector('#homepage-wrapper')
  else expect(page).to have_selector('#homepage-wrapper'); end
end