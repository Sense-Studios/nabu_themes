
// ########################## MARDUQ HELPER FUNCTIONS ##########################
// map center coordinates
var turnhoutsebaan

// default
var video_target = '#video_player'

var closeVideoWindow = function () {
  console.log("close window called")
  $('#modal_iframe').attr('src', '' );
  $('#modal_iframe').hide()

  $('#video_player').fadeOut()
  $('#close_button').fadeOut("slow")

  target = "#video_frame"
  if ( pop !== null && pop !== undefined ) {
    $(target + ' audio').remove();                  // left by regular popcorn
    $(target + ' video').remove();                  // left by regular popcorn
    $(target + ' iframe').remove();                 // left by youtube and vimeo and kaltura
    $(target + ' .jwholder').remove();              // left by JWplayer
    $(target + ' .marqer').remove();                // left by Movietrader
    $(target).removeClass("kWidgetIframeContainer") // left by Kaltura
    resetControls();
    try { pop.destroy(); } catch(e) {} // IE8 fix
    pop = null // failsafe
  }

  $('#map_full_screen_button').show()
  try {
    google.maps.event.trigger( last_clicked_marqer, 'click');
  }catch(err){}
}

var loadAndPlayOtherVideo = function( _id, _time ) {
  if (  _time == undefined) _time = 0
  hadInpoint = false;
  startProgram( _id, _time )
}

var goFullscreen = function( _element ) {

  if ( _element == undefined ) _element = "video_player"

  // fullscreen api --> note the order of these!
  var fullScreenElement = document.getElementById( _element );
  if ( fullScreenElement.requestFullscreen ) fullScreenElement.requestFullscreen();
  if ( fullScreenElement.mozRequestFullScreen ) fullScreenElement.mozRequestFullScreen();
  if ( fullScreenElement.webkitRequestFullScreen && agent.label == "CHROME" ) {
    fullScreenElement.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
  } else if ( fullScreenElement.webkitRequestFullScreen ) {
    fullScreenElement.webkitRequestFullScreen();
  }
  if ( fullScreenElement.msRequestFullscreen ) fullScreenElement.msRequestFullscreen();
}

var exitFullScreen = function() {
  // fullscreen api --> note the order of these!
  if ( document.exitFullscreen ) document.exitFullscreen();
  if ( document.cancelFullScreen ) document.cancelFullScreen();
  if ( document.mozCancelFullScreen ) document.mozCancelFullScreen();
  if ( document.webkitCancelFullScreen ) document.webkitCancelFullScreen();
  if ( document.msCancelFullScreen ) document.msCancelFullScreen();         // this doesnt work
  if ( document.msExitFullscreen ) document.msExitFullscreen();
}

var startProgram = function( _id, _time ) {

  program_id = _id
  if ( _time == undefined ) _time = 0
  getProgram( _id, function( p ) {

    $('#modal_iframe').show()
    $('#video_player').fadeIn()
    $('#map_full_screen_button').hide()

    // make sure to set program
    program = p
    program.meta.player_options.autoplay = "true";      // try and autoplay
    program.meta.moviedescription["in-point"] = _time   // try and go to time
    getPlayer( p, "#video_frame", agent.technology, agent.videotype);
    // initControls(); // not needed
    // setSocial(); // not needed
    initMarqers( program.marqers ) // very much needed

    // if shown, ensure functionality
    $('.big-play').click( function() { pop.play() } )
  })
}

// ########################## ALL THE MAP FUNCTIONS ############################
var map
var active_spots = []
var first_marker
var last_clicked_marqer

function initMap() {
  // Specify features and elements to define styles.
  window.styleArray = [{"elementType":"all","featureType":"road","stylers":[{ visibility: "off" },{"lightness":"-39"},{"gamma":"1.63"},{"visibility":"simplified"},{"saturation":"-32"}]},{"elementType":"all","featureType":"road.highway","stylers":[{"saturation":"-1"}]},{"elementType":"geometry.fill","featureType":"road.highway","stylers":[{"color":"#e07f77"},{"saturation":"0"},{"lightness":"0"}]},{"elementType":"labels.text","featureType":"road.highway","stylers":[{"color":"#ffffff"},{"weight":"10"}]}, {featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }] }]
  //{featureType: "poi", stylers: [{ visibility: "off" }]}
  turnhoutsebaan = new google.maps.LatLng(51.2151361,4.4382217);

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: turnhoutsebaan,
    scrollwheel: false,

    disableDefaultUI: true,
    zoomControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,

    // Apply the map style array to the map.
    styles: window.styleArray,
    zoom: 15
  });

  var strictBounds = new google.maps.LatLngBounds(
    // south-west -> north-east
    new google.maps.LatLng(51.2129728,4.4277095),
    new google.maps.LatLng(51.2196805,4.4738757)
  );

  // #### fill spots with ######################################################

  var spots = window.channelsettings

  spots.forEach(function(spot) {

    console.log(spot, spot.name, spot.lat, spot.lng)

    var loc = new google.maps.LatLng(spot.lat,spot.lng);
    var mark = new google.maps.Marker({
      position: loc, // variable with the coordinates Lat and Lng
      map: map,
      title: spot.name,
      icon: spot.icon
    });

    var infowindow = new google.maps.InfoWindow({
      content:'<div id="iw-container">' +
                '<div class="iw-content">' +

                  '<div class="button_layer">' +
                  '</div>' +

                  //'<div class="play_trailer pull-left">' +
                  //  ' <span class="glyphicon glyphicon-play"></span>'+
                  //  ' Trailer '+
                    // spot.info_block
                  //'</div>'+

                  '<div class="main_title">' +
                    spot.title +
                  '</div>' +

                  '<div class="shadow_helper">' +
                  '</div>' +

                  '<div class="content_right">' +

                    //'<div class="info_block">' +
                    //  spot.info_block +
                    //'</div>'+

                    '<button id="full_movie_play" data-program="'+spot.program+'"class="btn btn-lg btn-default pull-left">'+
                      '<span class="glyphicon glyphicon-fullscreen"></span>'+
                    '</button>'+

                    //''<span class="glyphicon glyphicon-play"></span></button>'+
                    //'</div>' +

                    spot.body +

                  '</div>'+
                  '<div class="content_left">' +
                    '<iframe src="'+spot.preview+'" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>'+
                  '</div>'+
                '</div>' +
                '<div class="iw-bottom-gradient"></div>' +
              '</div>'
    });

    active_spots.push([loc,mark,infowindow])

    var closeAllSpots = function() {
      // close the rest
      $.each( active_spots, function(i, value) {
        value[2].close();
      });
    }


    google.maps.event.addListener( mark, 'click', function() {

      // close the rest
      closeAllSpots()
      var i = infowindow.open( map, mark );
      last_clicked_marqer = mark

      //console.log("###########################")
      //console.log("map", map )
      //console.log("mark", mark )
      //console.log("i:", i )
      //console.log("ref:", infowindow )
      //console.log("stl:", $('.gm-style-iw').length )

    });

    //google.maps.event.addListener(map, 'click', function() {
    //    if ( $('.gm-style-iw').hasClass('gva_style') ) {
    //      $('.gm-style-iw').removeClass('gva_style')
    //    }

        // aaaaand... close
    //    infowindow.close();
    //});

    google.maps.event.addListener( infowindow, 'domready', function() {

      console.log(" ################### DOMREADY ", infowindow )
      //$('.gm-style-iw').hasClass("gva_style")
      $('.gm-style-iw').each( function( i, value ) {
        console.log(">>>", i,$(this))
        console.log(">>>", $(this).find('iframe').length)
        if ($(this).find('iframe').length > 0) {
          $(this).addClass('gva_style')
        }else{
          $(this).removeClass('gva_style')
        }
      });

      //$('.content_left').click(function(){alert("doh")})

      //$('#full_movie_play').click( function() {
      $('.gm-style-iw').unbind('click')
      $('.gm-style-iw').click( function() {
        startProgram( $(this).find('#full_movie_play').data('program') )
        goFullscreen('video_player')
        $('er').fadeIn()
        $('#close_button').fadeIn("slow")
        closeAllSpots()
      })

      $('#close_button').unbind('click')
      $('#close_button').click( function() {
        //$('#video_player').fadeOut()
        //$('#close_button').fadeOut("slow")
        closeVideoWindow()
        //exitFullScreen()
      })


      if ( !$('.gm-style-iw').hasClass("gva_style") ) return

      // Reference to the DIV that wraps the bottom of infowindow
      var iwOuter = $('.gva_style'); //$('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      iwBackground.children(':nth-child(2)').css({'display' : 'none'});
      iwBackground.children(':nth-child(4)').css({'display' : 'none'});
      iwBackground.children(':nth-child(3)').children(':nth-child(1)').children(':nth-child(1)').css('background-color', '#da291c')
      iwBackground.children(':nth-child(3)').children(':nth-child(2)').children(':nth-child(1)').css('background-color', '#da291c')
      iwBackground.children(':nth-child(1)').css('background-color:red;')
      iwBackground.children(':nth-child(3)').css('background-color:red;')
      iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

      var iwCloseBtn = iwOuter.next();
      iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', width: '15px', height: '15px', border: '1px solid #DA291C', 'border-radius': '13px', 'box-shadow': '0 0 5px #DA291C'});

      iwCloseBtn.click(function(){
        $('.gm-style-iw').removeClass('gva_style')
      });

      iwCloseBtn.mouseout(function(){
        $(this).css({opacity: '1'});
      });
    }); // end dom ready

    if ( spot.active ) {
      first_marker = mark
    }

  }); // end for each

  // ###### restrict boundries ##############################################

  // Listen for the dragend event
  google.maps.event.addListener(map, 'dragend', function() {

    if (strictBounds.contains(map.getCenter())) return;

    // We're out of bounds - Move the map back within the bounds

    var c = map.getCenter(),
      x = c.lng(),
      y = c.lat(),
      maxX = strictBounds.getNorthEast().lng(),
      maxY = strictBounds.getNorthEast().lat(),
      minX = strictBounds.getSouthWest().lng(),
      minY = strictBounds.getSouthWest().lat();

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    map.setCenter(new google.maps.LatLng(y, x));
  });

  // end ######

  // Button Handler for the first click
  $('#close_button').click( function() {
    google.maps.event.trigger( first_marker, 'click');
    //$('#video_player').fadeOut()
    //$('#close_button').fadeOut("slow")
    closeVideoWindow()
    exitFullScreen()
  })

  $('#map_full_screen_button').click( function() {
    console.log( window.innerHeight == screen.height )
    if( window.innerHeight == screen.height ) {
      exitFullScreen();
      setTimeout(function() {
        map.setZoom( 15 );
        map.panTo( turnhoutsebaan );
      }, 200 );
    }else{
      goFullscreen();

      setTimeout(function() {
        map.setZoom( 16 );
        map.panTo( turnhoutsebaan );
      }, 200 );
    }
  })

  $('#map_full_screen_button').hide();
}
