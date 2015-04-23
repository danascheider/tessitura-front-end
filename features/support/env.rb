require 'capybara/cucumber'
require 'capybara/webkit'
require 'rspec/expectations'
require 'base64'

require_relative 'wait_for_ajax'

include WaitForAjax

Capybara.run_server        = false
Capybara.app_host          = 'http://localhost'

Capybara.register_driver :selenium_chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.javascript_driver = :selenium_chrome