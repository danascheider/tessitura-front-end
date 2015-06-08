Then(/^the calendar should show three days with today in the middle$/) do
  days    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  day     = 24 * 3600
  current = Time.now

  visible = [
    days[current.wday - 1],
    days[current.wday],
    days[current.wday + 1]
  ]

  visible.each do |day|
    within '#calendar' do 
      expect(page).to have_content day
    end
  end
end

Then(/^the calendar should not show the other four days$/) do 
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  ok   = [days[Time.now.wday - 1], days[Time.now.wday], days[Time.now.wday + 1]]
  bad  = days.reject {|day| ok.include? day }

  bad.each do |day|
    within '#calendar' do 
      expect(page).not_to have_content day 
    end
  end
end