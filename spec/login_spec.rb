require 'spec_helper'

describe 'logging in', type: :feature do 
  describe 'logging in' do 
    before(:each) do 
      visit('/')
      within(:css, 'ul.top-nav') do 
        find('a.login-link').click 
      end
    end

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

        within(:css, '#login-form') do 
          fill_in('Username', with: 'testuser')
          fill_in('Password', with: 'testuser')
          uncheck('Remember Me')
          click_button('Login')
        end
      end

      it 'sets \'auth\' cookie to basic auth hash' do 
        pending('Iron out issue with show_me_the_cookie')
        hash = Base64.encode64('testuser:testuser')
        expect(show_me_the_cookie('auth')).to eql hash
      end

      it 'sets \'userID\' cookie to the user\'s ID' do 
        pending('Iron out issue with show_me_the_cookie')
        expect(show_me_the_cookie('userID')).to eql 342
      end

      it 'renders the dashboard' do 
        expect(page).to have_css('#dashboard-wrapper')
      end

      it 'shows the dashboard home view' do 
        # FIX: There should be a better way to uniquely identify the home view
        expect(page).to have_css('#dash-heading')
      end
    end
  end
end