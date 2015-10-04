var string = "<div class='panel-heading'>\n  <%= errors.length %> Errors:\n</div>\n<div class='panel-body'>\n  <ul>\n    <% _.each(errors, function(error) { %>\n      <li><%= error %></li>\n    <% }); %>\n  </ul>\n</div>";

module.exports = string;
