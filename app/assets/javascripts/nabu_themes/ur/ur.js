function setTitleTimeout() {
  if ( document.getElementById('video_frame').contentWindow.pop == undefined ) {
    setTimeout( function() {setTitleTimeout();}, 200)
    return;
  }else{
    document.getElementById('video_frame').contentWindow.pop.on('play', function() {
      $('.title_container').animate( { 'opacity': 0 }, 600);
    });

    document.getElementById('video_frame').contentWindow.pop.on('pause', function() {
      $('.title_container').animate( { 'opacity': 1 }, 300);
    });
  }
}

function setTitleAndTimeout() {
  // set title
  $('.title_container').css('opacity', 1)
  document.getElementById('video_frame').onload = function() {
    setTitleTimeout()
  }
}

function setFonts() {
  // @import url('https://fonts.googleapis.com/css?family=Cinzel+Decorative');               // injected_font_1
  // @import url('https://fonts.googleapis.com/css?family=Cormorant+Garamond:300,300i,400'); // injected_font_2
  // @import url('https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz');               // injected_font_3
  // https://fonts.googleapis.com/css?family=Vibur

  // dirtry, but working google font injection script
  if ( channelsettings.fonts == undefined ) {
    channelsettings.fonts = [
      ["injected_font_1", "https://fonts.googleapis.com/css?family=Cinzel+Decorative"],
      ["injected_font_2", "https://fonts.googleapis.com/css?family=Cormorant+Garamond:300,300i,400"],
      ["injected_font_3", "https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz"]
    ]
  }

  $.each( channelsettings.fonts, function( i, value ) {
    if ( value[1].indexOf('fonts.googleapis.com') == -1 ) {
      // its a self-serving
      var css = "@font-face { font-family: "+ value[0] +"; src: url( /proxy.php?url="+ value[1] +") }"
      $('head').append("<style>" + css + "</style>");
    }else{
      // its a google font
      $.get( value[1], function(e) {
        var res = e.replace(/font-family: '([a-zA-Z ]+)'/g, "font-family: '" + value[0] + "'");
        $('head').append("<style>" + res + "</style>");
      });
    }
  });
}


$(function() {

  var myLazyLoad = new LazyLoad();
  setFonts()

  // @filtered_programs
  $(window).on('hashchange', function() {
    setTitleAndTimeout()
    $('#video_frame').attr('src', '/embed2/' + window.location.hash.slice(1) + "");
  });

  $('.videoitem').click( function() {
      window.location.hash = $(this).data('id')
      $("html, body").animate({ scrollTop: 0 }, 600);
      $('.title_container h1').html( "<small>" + $(this).data('category') + "</small><br>" + $(this).data('title') );
  });

  $('.main-color').css('color', window.main_color );
  $('.secondary-color').css('color', window.support_color );

  // set navs, a
  $('a').css('color', window.support_color );
  $('a').hover(function() {
    $(this).css('color', window.background_color )
    $(this).css('background-color', window.main_color )
  }, function() {
    $(this).css('color', window.support_color )
    $(this).css('background-color', 'rgba(0,0,0,0)' )
  } );

  $('.background-color').css('background-color', window.background_color );

  if (window.location.hash == "") {
    $('.title_container h1').html( "<small>featured</small><br>" + firstprogramtitle );
    setTitleAndTimeout()
    $('#video_frame').attr('src', '/embed2/' + firstprogramid );

  }else{

    // find id in menu's
    var temp_title = ""
    var temp_cat = ""
    var temp_id = window.location.hash.slice(1)
    $.each( menudata.menu, function( i, cat ) {
      $.each( cat.items, function( j, prog ) {
          console.log( temp_id, prog.id)
          if ( temp_id == prog.id ) {
            temp_title = prog.name
            temp_cat = cat.name
          }
      });
    });
    $('.title_container h1').html( "<small>" + temp_cat + "</small><br>" + temp_title );

    setTitleAndTimeout()
    $('#video_frame').attr('src', '/embed2/' + window.location.hash.slice(1) );
  }
});
