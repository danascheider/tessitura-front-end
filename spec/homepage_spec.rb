require 'spec_helper'

describe 'Canto homepage', type: :feature do 
  context 'general' do 
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
  end

  context 'logged in user' do 
    before(:each) do 
      DRIVER.manage.add_cookie(name: 'userID', value: '342')
      # DRIVER.manage.add_cookie(name: 'auth', value: Base64.encode64("testuser:testuser").gsub(/\=/, '%3D'))
      DRIVER.get BASEPATH
    end

    it 'has the right cookies' do 
      DRIVER.manage.add_cookie(name: 'auth', value: Base64.encode64("testuser:testuser").gsub(/\=/, '%3D'))
      cookie = DRIVER.manage.cookie_named('auth')
      expect(cookie[:name]).to eql 'auth'
    end

    it 'redirects to the dashboard' do 
      expect(DRIVER.find_element(:id, 'dashboard-wrapper')).to be_displayed
    end

    it 'doesn\'t show the homepage' do 
      expect{ DRIVER.find_element(:id, 'homepage-wrapper') }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
    end
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
    context 'general' do 
      before(:each) do 
        DRIVER.get("#{BASEPATH}/#home")
      end

      it 'displays the homepage' do 
        expect(DRIVER.find_element(:id, 'homepage-wrapper')).to be_displayed
      end

      it 'doesn\'t display the dashboard' do 
        expect{ DRIVER.find_element(:id, 'dashboard-wrapper') }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
      end
    end

    context 'logged in user' do 
      before(:each) do 
        DRIVER.manage.add_cookie(name: 'userID', value: '342')
        DRIVER.manage.add_cookie(name: 'auth', value: Base64.encode64("testuser:testuser").gsub(/\=/, '%3D'))
        DRIVER.get("#{BASEPATH}/#home")
      end

      it 'displays the homepage' do 
        expect(DRIVER.find_element(:id, 'homepage-wrapper')).to be_displayed
      end

      it 'doesn\'t redirect to the dashboard' do 
        expect{ DRIVER.find_element(:id, 'dashboard-wrapper') }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
      end

      context 'when login link is clicked' do 
        before(:each) do 
          DRIVER.find_element(:css, 'ul.top-nav a.login-link').click
        end

        it 'doesn\'t show the login form' do 
          expect{ DRIVER.find_element(:id, 'shade') }.to raise_error(Selenium::WebDriver::Error::NoSuchElementError)
        end

        it 'redirects to the dashboard' do 
          expect(DRIVER.find_element(:id, 'dashboard-wrapper')).to be_displayed
        end
      end
    end
  end
end