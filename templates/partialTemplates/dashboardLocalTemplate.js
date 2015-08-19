var string = "<div class='row'>\n  <div class='col-lg-12'>\n    <h1 class='page-header'>Opportunities Near Me</h1>\n    <% if (!(model.get('address_1') || model.get('address_2') || model.get('state') || model.get('zip'))) { %>\n      <div class='alert alert-warning'>\n        Tell us where you live to find out what's near you!\n        <a href='#profile' class='internal-link alert-link'>Go <i class='fa fa-angle-double-right'></i></a>\n      </div>\n    <% } %>\n  </div>\n</div>";

module.exports = string;
