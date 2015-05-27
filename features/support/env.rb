require 'capybara/cucumber'
require 'capybara/webkit'
require 'capybara/poltergeist'
require 'rspec/expectations'
require 'base64'

require_relative 'wait_for_ajax'

include WaitForAjax

Capybara.run_server        = false
Capybara.app_host          = 'http://localhost'

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new app, js_errors: false
end

Capybara.javascript_driver = :poltergeist