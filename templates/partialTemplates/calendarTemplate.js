var string = "<div class='panel-heading'>\n  <i class='fa fa-calendar-o fa-fw'></i>  My Calendar\n  <span class='pull-right toggle-widget'><i class='fa fa-minus fa-fw'></i></span>\n</div>\n</div>\n<div class='panel-body'>\n  <div class='table-responsive'>\n    <table class='calendar table'>\n      <thead>\n        <tr>\n          <th></th>\n          <th><%= days[0] %></th>\n          <th class='current'><%= days[1] %></th>\n          <th><%= days[2] %></th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr class='time-slot'>\n          <th class='row-header'>8:00 AM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>9:00 AM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>10:00 AM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>11:00 AM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>12:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>1:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>2:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>3:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>4:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>5:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>6:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>7:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n\n        <tr class='time-slot'>\n          <th class='row-header'>8:00 PM</th>\n\n          <td class='calendar-cell <%= days[0] %>'></td>\n          <td class='calendar-cell current'></td>\n          <td class='calendar-cell <%= days[2] %>'></td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>";

module.exports = string;
