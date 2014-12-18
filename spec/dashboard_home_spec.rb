require 'spec_helper'

describe 'dashboard home view' do 
  before(:each) do 
    visit('/#login')
    fill_in('Username', with: 'testuser')
    fill_in('Password', with: 'testuser')
    click_button('Login')
  end

  context 'top-nav dropdown menus' do 
    it 'is closed by default'
    it 'opens when you click on the li'
    it 'closes when you click outside the menu'
  end

  context 'top-widgets' do 
    it 'updates the widget when data change'
    it 'links to the appropriate page'
  end
end