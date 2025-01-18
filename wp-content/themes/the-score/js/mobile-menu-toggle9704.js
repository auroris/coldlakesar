// hide or display the mobile menu

/* let's consider we want to toggle the menu displayed at 800 screen width, here's what we need to do (you can accordingly replace 800 with to a screen width you would need)..*/
function toggle() {
    if ( jQuery( window ).width() >= 800 ) {

	  jQuery( '.main-navigation, #site-navigation' ).show();
      jQuery( '.dl-menuwrapper' ).hide();
    } else {

      jQuery( '.dl-menuwrapper' ).show();
	  jQuery( '.main-navigation, #site-navigation' ).hide();
    }
}

// on page load set the menu display initially
toggle();

// toggle the menu display on browser resize
jQuery( window ).on("resize", function () {
    toggle();
} );