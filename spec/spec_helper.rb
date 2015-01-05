require 'rspec'
require 'json'
require 'capybara/rspec'
require 'capybara/webkit'
require 'selenium-webdriver'
require 'base64'
require 'cgi'

Capybara.default_driver = :webkit
Capybara.app_host = 'http://localhost:80'
Capybara.run_server = false

RSpec.configure do |config|
  config.order = 'random'

  config.before(:suite) do 
    DRIVER = Selenium::WebDriver.for :firefox
    DRIVER.manage.timeouts.implicit_wait = 30
    BASEPATH = 'http://localhost'
  end

  config.after(:suite) do 
    DRIVER.quit
  end
end