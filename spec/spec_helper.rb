require 'rspec'
require 'capybara/rspec'
require 'capybara/webkit'
require 'show_me_the_cookies'
require 'base64'


Capybara.default_driver = :webkit
Capybara.app_host = 'http://localhost:80'
Capybara.run_server = false

RSpec.configure do |config|
  config.include ShowMeTheCookies, type: :feature

  config.order = 'random'
end