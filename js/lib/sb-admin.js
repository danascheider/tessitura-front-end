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

//Shows the things the top nav bar is supposed to show
$(function() {
  $('.navbar-top-links a').click(function() {
    var uncles = $(this).parent('li').siblings();
    $.each(uncles, function() {
      if ($(this).find('.dropdown-menu').is(':visible')) {
        $(this).find('.dropdown-menu').hide();
      }
    })
    $(this).parent('li').find('.dropdown-menu').toggle();
  });
});