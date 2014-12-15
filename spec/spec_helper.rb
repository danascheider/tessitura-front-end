require 'rspec'
require 'capybara/rspec'
require 'capybara/webkit'


Capybara.default_driver = :webkit
Capybara.app_host = 'http://localhost:80'
Capybara.run_server = false

RSpec.configure do |config|
end