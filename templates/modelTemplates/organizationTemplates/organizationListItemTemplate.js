var string = "<table class='organization-listing' title=\"<%- model.get('name') %>\">\n  <tr>\n    <td><a href='#' class='organization-name'><%- model.get('name') %></a></td>\n  </tr>\n  <% var attributes = ['website', 'phone_1', 'phone_2', 'email_1', 'email_2', 'address_1', 'address_2', 'city', 'region', 'postal_code'] %>\n  <% _.each(attributes, function(attribute) { %>\n    <% if(model.get(attribute)) { %>\n      <tr>\n        <td><%- model.get(attribute) %></td>\n      </tr>\n    <% } %>\n  <% }) %>\n</table>";

module.exports = string;
