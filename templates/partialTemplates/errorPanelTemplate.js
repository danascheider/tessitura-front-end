var string = "<div class='panel-heading'>\n  <%= errors.length %> errors prevented your account from being created:\n</div>\n<div class='panel-body'>\n  <ul>\n    <% _.each(errors, function(error) { %>\n      <li><%= error %></li>\n    <% }); %>\n  </ul>\n</div>";

module.exports = string;
