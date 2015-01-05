require 'spec_helper'

describe 'core dashboard elements' do 
  before(:all) do 
    DRIVER.manage.add_cookie(name: 'auth', value: Base64.encode64('testuser:testuser').gsub(/\=/, '%3D'))
    DRIVER.manage.add_cookie(name: 'userID', value: '342')
  end

  before(:each) do 
    DRIVER.get "#{BASEPATH}/#dashboard"
  end

  describe 'visible elements' do 
    it 'has a top nav element' do 
      expect(DRIVER.find_element(:class_name, 'navbar-fixed-top')).to be_displayed
    end

    it 'has a side nav element' do 
      expect(DRIVER.find_element(:class_name, 'navbar-static-side')).to be_displayed
    end
  end
end