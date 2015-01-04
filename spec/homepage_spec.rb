require 'spec_helper'

describe 'Canto homepage', type: :feature do 
  before(:each) do 
    DRIVER.get(BASEPATH)
  end

  it 'shows the homepage' do 
    expect(DRIVER.find_element(:id, 'homepage-wrapper')).to be_truthy
  end

  it 'doesn\'t show the login view' do 
    expect(DRIVER.find_element(:id, 'shade')).not_to be_displayed # the #shade container has the login form
  end

  it 'doesn\'t show the dashboard' do 
    expect{ DRIVER.find_element(:id, 'dashboard-wrapper') }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
  end

  context 'link behavior' do 
    describe 'login link' do 
      before(:each) do 
        DRIVER.get BASEPATH
        DRIVER.find_element(:css, 'ul.top-nav a.login-link').click
      end

      it 'displays the login form' do 
        expect(DRIVER.find_element(:id, 'login-form')).to be_displayed
      end

      it 'doesn\'t display the dashboard' do 
        expect{ DRIVER.find_element(:id, 'dashboard-wrapper') }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
      end

      it 'doesn\'t redirect'  do 
        expect(DRIVER.find_element(:id, 'homepage-wrapper')).to be_displayed
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