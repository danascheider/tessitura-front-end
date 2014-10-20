// $(function() {
//   $('#side-menu').metisMenu();
// });

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.


$(function() {
  $(window).bind("load resize", function() {
    width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
    if (width < 768) {
        $('div.sidebar-collapse').addClass('collapse')
    } else {
        $('div.sidebar-collapse').removeClass('collapse')
    }
  })
})

$(function() {
  $(document).click(function(e) {
    var menu = $('.dropdown-menu');
    if(!menu.is(e.target) && menu.has(e.target).length === 0) {
      menu.hide();
    }
  })
})

$(function() {
  $('a.dropdown-toggle').click(function() {
    if($(this).parent('li').find('.dropdown-menu').is(':visible')) {
      $(this).parent('li').blur();
    }
  })
})
