var Control = function() {

  _self = this
  _self.renderer

  _self.update = function() {
  }

  // placeholder
  function initRemoteControls() {
    console.log("init remote controls in mixer");
    // does nothing
  }

  var dur = 4000;

  // Helpers
  set_footer = function( str ) {
    console.log("set footer name: ", str )
    $('h1').html( str )
    $('h1').fadeIn('slow').fadeOut( dur )
  }

  change_runner = function( num ) {
    var newmovie = runners[ num ];
    img1.src = newmovie.url;
    console.log( "set runner movie", newmovie );
    set_footer( "<small>" + newmovie.name + "</small>" );
    //changed = true
    //once = false
    console.log("img1: ",  newmovie.name, newmovie.url );
    setTimeout( function() { img1.currentTime = Math.round( Math.random() * img2.duration ) } , 800 );
    return;
  }

  change_awesome = function( num ) {
    var newmovie = awesome[ num ]
    console.log( "set awesome movie", newmovie )
    if (img2.src != newmovie.url)   {
      img2.src = newmovie.url
      set_footer( newmovie.name )
    }else{
       img2.currentTime = Math.round( Math.random() * img2.duration )
    }
    return;
  }

  /*
  $('input[name=opacity]').bind('change keyup keypress', function() {
      var value = parseInt($(this).val(), 10);
      if ($(this).data('prev-value') != value) {
        $(this).data('prev-value', value);
        alpha = Math.min(1, Math.max(0, value / 100));

        if (!totalImages)
          updateScene();
      }
    }).val(Math.floor(alpha * 100));
    */

}
