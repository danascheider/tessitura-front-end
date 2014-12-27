require 'spec_helper'

describe 'logging in', type: :feature do 

  # NOTE: The data used here refer to a test user in the development database
  #       currently on a local VM. Its values are:
  #         id: 342,
  #         username: 'testuser',
  #         password: 'testuser',
  #         email: 'testuser@example.com',
  #         first_name: 'Test',
  #         last_name: 'User'
  #
  #       Janky, I know.

  describe 'logging in' do 
    context '"remember me" false' do 
      before(:each) do 
        DRIVER.get BASEPATH
        DRIVER.find_element(:css, 'ul.top-nav a.login-link').click

        @form = DRIVER.find_element(:id, 'login-form')

        @form.find_element(:name, 'username').send_keys 'testuser'
        @form.find_element(:name, 'password').send_keys 'testuser'

        box = @form.find_element(:name, 'remember')
        box.click if box.selected?

        @form.find_element(:tag_name, 'button').click
      end

      after(:each) do 
        DRIVER.manage.delete_all_cookies
      end

      it 'sets \'auth\' cookie to basic auth hash' do 
        cookie = DRIVER.manage.cookie_named('auth')
        expect(cookie[:value]).to eql Base64.encode64('testuser:testuser')
      end

      it 'sets \'userID\' cookie to the user\'s ID' do 
        cookie = DRIVER.manage.cookie_named('userID')
        expect(cookie[:value]).to eql '342'
      end

      it 'renders the dashboard' do 
        expect(DRIVER.find_element(:id, 'dashboard-wrapper')).to be_truthy
      end
    end

    context 'with WebDriver', selenium: true do 
      it 'shows the dashboard home view' do 
        # FIX: There should be a better way to uniquely identify the home view
        DRIVER.get(BASEPATH)
        DRIVER.find_element(:css, 'ul.top-nav a.login-link').click

        form = DRIVER.find_element(:id, 'login-form')

        form.find_element(:name, 'username').send_keys 'testuser'
        form.find_element(:name, 'password').send_keys 'testuser'
        form.find_element(:tag_name, 'button').click

        expect(DRIVER.find_element(:class_name, 'dashboard-home')).to be_displayed
      end
    end
  end
end