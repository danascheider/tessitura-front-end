require 'spec_helper'

describe 'Canto homepage', type: :feature do 
  before(:each) do 
    DRIVER.get(BASEPATH)
  end

  it 'shows the homepage' do 
    expect(@homepage.wrapper).to be_true
  end

  it 'doesn\'t show the login view' do 
    expect(page).not_to have_css('#shade') # the #shade container has the login form
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

      it 'displays the login form' do 
        expect(page).to have_css('#login-form');
      end

      it 'doesn\'t display the dashboard' do 
        expect(page).not_to have_css('#dashboard-wrapper')
      end

      it 'doesn\'t redirect'  do 
        expect(page).to have_css('#homepage-wrapper')
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
  end
end