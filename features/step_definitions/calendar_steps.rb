Then(/^the calendar should show five days with today in the middle$/) do
  days    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  day     = 24 * 3600
  current = Time.now

  visible = [
    days[current.wday - 2],
    days[current.wday - 1],
    days[current.wday],
    days[current.wday + 1],
    days[current.wday + 2]
  ]

  visible.each do |day|
    within '#calendar' do 
      expect(page).to have_content day
    end
  end
end