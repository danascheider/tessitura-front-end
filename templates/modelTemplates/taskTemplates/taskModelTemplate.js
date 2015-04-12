var string = "<a href='' class='task-title' title=\"<%- model.get('title') %>\"><%- model.displayTitle(50) %></a>\n<table class='task-details'>\n  <% if (model.get('deadline')) { %>\n    <tr class='task-deadline-row'>\n      <th>Deadline:</th>\n      <td><%- model.prettyDeadline() %></td>\n    </tr>\n  <% } %>\n  <tr class='task-priority-row'>\n    <th>Priority:</th>\n    <td><%- model.get('priority') %></td>\n  </tr>\n  <tr class='task-status-row'>\n    <th>Status:</th>\n    <td><%- model.get('status') %></td>\n  </tr>\n  <% if (model.get('description')) { %>\n    <tr class='task-description-row'>\n      <th style='vertical-align: text-top'>Notes:</th>\n      <td><%- model.get('description') %></td>\n    </tr>\n  <% } %>\n</table>";

module.exports = string;