require 'page-object'

class HomepageObject
  include PageObject

  page_url 'http://localhost'

  div(:wrapper, id: 'homepage-wrapper')
  element(:top_nav, :nav, id: 'navbar-top')
  area(:shade, id: 'shade')
  link(:login_link, css: '.top-nav li a.login-link')
end