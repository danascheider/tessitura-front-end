var string = "  <div class='col-lg-3 col-md-6'>\n    <div class='panel panel-primary dash-widget' data-target='tasks' data-name='tasks' data-color='#428bca'>\n      <div class='panel-heading'>\n        <div class='row'>\n          <div class='col-xs-3'>\n            <i class='fa fa-tasks fa-5x'></i>\n          </div> <!-- end col-xs-3 -->\n          <div class='col-xs-9 text-right'>\n            <div class='huge'><%= taskCollection.length %></div>\n            <div>New Tasks!</div>\n          </div> <!-- end col-xs-9 text-right' -->\n        </div>\n      </div> <!-- end .panel-heading -->\n      <a href='#'>\n        <div class='panel-body'>\n          <span class='pull-left'>View Details</span>\n          <span class='pull-right'>\n            <i class='fa fa-arrow-circle-right'></i>\n          </span>\n          <div class='clearfix'></div>\n        </div>\n      </a>\n    </div>\n  </div> <!-- end col-lg-3 col-md-6 (first widget) -->\n  <div class='col-lg-3 col-md-6'>\n    <div class='panel panel-blue dash-widget' data-name='deadlines' data-color='#516695'>\n      <div class='panel-heading'>\n        <div class='row'>\n          <div class='col-xs-3'>\n            <i class='fa fa-clock-o fa-5x'></i>\n          </div> <!-- end col-xs-3 -->\n          <div class='col-xs-9 text-right'>\n            <div class='huge'><%= deadlineCount %></div>\n            <div>Upcoming Deadlines!</div>\n          </div> <!-- end col-xs-9 text-right' -->\n        </div>\n      </div> <!-- end .panel-heading -->\n      <a href='#'>\n        <div class='panel-body'>\n          <span class='pull-left'>View Details</span>\n          <span class='pull-right'>\n            <i class='fa fa-arrow-circle-right'></i>\n          </span>\n          <div class='clearfix'></div>\n        </div>\n      </a>\n    </div>\n  </div> <!-- end col-lg-3 col-md-6 (second widget) -->\n  <div class='col-lg-3 col-md-6'>\n    <div class='panel panel-yellow dash-widget' data-name='appointments' data-color='#f0ad4e'>\n      <div class='panel-heading'>\n        <div class='row'>\n          <div class='col-xs-3'>\n            <i class='fa fa-calendar fa-5x'></i>\n          </div> <!-- end col-xs-3 -->\n          <div class='col-xs-9 text-right'>\n            <div class='huge'><%= appointmentCount %></div>\n            <div>New Appointments!</div>\n          </div> <!-- end col-xs-9 text-right' -->\n        </div>\n      </div> <!-- end .panel-heading -->\n      <a href='#'>\n        <div class='panel-body'>\n          <span class='pull-left'>View Details</span>\n          <span class='pull-right'>\n            <i class='fa fa-arrow-circle-right'></i>\n          </span>\n          <div class='clearfix'></div>\n        </div>\n      </a>\n    </div>\n  </div> <!-- end col-lg-3 col-md-6 (third widget) -->\n  <div class='col-lg-3 col-md-6'>\n    <div class='panel panel-red dash-widget' data-name='recommendations' data-color='#d9534f'>\n      <div class='panel-heading'>\n        <div class='row'>\n          <div class='col-xs-3'>\n            <i class='fa fa-check fa-5x'></i>\n          </div> <!-- end col-xs-3 -->\n          <div class='col-xs-9 text-right'>\n            <div class='huge'><%= recommendationCount %></div>\n            <div>Recommendations!</div>\n          </div> <!-- end col-xs-9 text-right' -->\n        </div>\n      </div> <!-- end .panel-heading -->\n      <a href='#'>\n        <div class='panel-body'>\n          <span class='pull-left'>View Details</span>\n          <span class='pull-right'>\n            <i class='fa fa-arrow-circle-right'></i>\n          </span>\n          <div class='clearfix'></div>\n        </div>\n      </a>\n    </div>\n  </div> <!-- end col-lg-3 col-md-6 (fourth widget) -->\n</div> <!-- end row -->\n";

module.exports = string;