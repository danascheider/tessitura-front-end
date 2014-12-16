require 'spec_helper'

describe 'Canto homepage', type: :feature do 
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

  context 'link behavior' do 
    describe 'login link' do 
      before(:each) do 
        visit('/')
        within(:css, 'ul.top-nav') do 
          find('a.login-link').click
        end
      end

      it 'redirects to the login page' do 
        pending('Full implementation of routing functionality')
        expect(current_path).to eql '/login'
      end

      it 'clears the homepage view' do 
        expect(page).not_to have_css('#homepage-wrapper')
      end

      it 'doesn\'t display the dashboard' do 
        expect(page).not_to have_css('#dashboard-wrapper')
      end

      it 'renders the login page' do 
        expect(page).to have_css('#login-wrapper')
      end
    end
  end

  context 'home route' do 
    before(:each) do 
      visit('/#home')
    end

    it 'displays the homepage' do 
      expect(page).to have_css('#homepage-wrapper')
    end

    it 'doesn\'t display the dashboard' do 
      expect(page).not_to have_css('#dashboard-wrapper')
    end

    it 'doesn\'t display the login page' do 
      expect(page).not_to have_css('#login-wrapper')
    end
  end
end