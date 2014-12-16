require 'spec_helper'

describe 'login', type: :feature do 
  describe 'visiting the login page' do 
    before(:each) do 
      visit('/#login')
    end

    it 'displays the login page' do 
      expect(page).to have_css('#login-wrapper')
    end

    it 'doesn\'t display the dashboard' do 
      expect(page).not_to have_css('#dashboard-wrapper')
    end

    it 'doesn\'t display the homepage' do 
      expect(page).not_to have_css('#dashboard-wrapper')
    end
  end

  describe 'logging in' do 

    # NOTE: This data refers to a test user in the development database
    #       currently on a local VM. Its values are:
    #         id: 342,
    #         username: 'testuser',
    #         password: 'testuser',
    #         email: 'testuser@example.com',
    #         first_name: 'Test',
    #         last_name: 'User'
    #
    #       Janky, I know.

    context '"remember me" false' do 
      before(:each) do 
        visit('/#login')
      end

      it 'sets \'auth\' cookie to basic auth hash' do 
        within(:css, '#login-form') do 
          fill_in('Username', with: 'testuser')
          fill_in('Password', with: 'testuser')
          uncheck('Remember Me')
          click_button('Login')
        end
        
        hash = Base64.encode64('testuser:testuser')
        expect(show_me_the_cookie('auth')).to eql hash
      end

      it 'sets \'userID\' cookie to the user\'s ID' do 
        expect(show_me_the_cookie('userID')).to eql 342
      end
    end
  end
end