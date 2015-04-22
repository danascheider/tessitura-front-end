require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'rspec/expectations'
require 'base64'

Capybara.run_server        = false
Capybara.app_host          = 'http://localhost'
Capybara.javascript_driver = :poltergeist