require 'spec_helper'

describe 'Canto homepage', type: :feature do 
  context 'no logged-in user' do 
    before(:each) do 
      visit '/'
    end

    it 'shows the homepage' do 
      expect(page).to have_css('#homepage-wrapper')
    end

    it 'doesn\'t show the dashboard' do 
      expect(page).not_to have_css('#dashboard-wrapper')
    end

    it 'doesn\'t redirect' do 
      expect(current_path).to eql('/')
    end
  end
end