
// ########################## MARDUQ HELPER FUNCTIONS ##########################
// map center coordinates
var map_center

// default
var video_target = '#video_player'

var closeVideoWindow = function () {
  console.log("close window called")
  try{player.stopVideo()}catch(e){} // fu youtube


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
  video_is_playing = false

  try {
    // google.maps.event.trigger( last_clicked_marqer, 'click');
    // google.maps.event.trigger( other_unseen_spot(), 'click');
    if ( channelsettings.map_settings.auto_open ) do_next_marker()

  }catch(err){
    console.log("##### ERRRORRRRORRR ", err )
  }
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

// *****************************************************************************
// CREATEA YOUTUBE PLAYER
// *****************************************************************************

var player;

// 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.
 var player;
 function onYouTubeIframeAPIReady() {
   player = new YT.Player('video_frame', {
     height: '100%',
     width: '100%',
     videoId: '',
     events: {
       'onReady': onPlayerReady,
       'onStateChange': onPlayerStateChange
     }
   });
 }

 //http://www.youtube.com/v/VIDEO_ID?version=3.

 // 4. The API will call this function when the video player is ready.
 function onPlayerReady(event) {
   event.target.playVideo();
 }

 // 5. The API calls this function when the player's state changes.
 //    The function indicates that when playing a video (state=1),
 //    the player should play for six seconds and then stop.
 var done = false;
 function onPlayerStateChange(event) {
   if (event.data == YT.PlayerState.PLAYING && !done) {
     setTimeout(stopVideo, 6000);
     done = true;
   }
 }
 function stopVideo() {
   player.stopVideo();
 }

var startProgram = function( _id, _time ) {

  console.log("start program: ", _id, _time)

  // We'll be using Youtube exclusively
  $('#modal_iframe').show()
  $('#video_player').fadeIn()
  $('#map_full_screen_button').hide()
  $('#close_button').show()

  // bwhahaha
  player.loadVideoById( youtube_parser(_id) , getYoutubeInPoint(_id) )

  // Marduq move over :(
  /*
  program_id = "54f3a38f6465766088c70000" //_id
  if ( _time == undefined ) _time = 0
  getProgram( program_id, function( p ) {

    $('#modal_iframe').show()
    $('#video_player').fadeIn()
    $('#map_full_screen_button').hide()

    video_is_playing = true

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
  */
}

// ########################## ALL THE MAP FUNCTIONS ############################
var map
var active_spots = []
var unseen_spots = []
var first_marker
var last_clicked_marqer
var other_unseen_spot
var current_marker = -1
var video_is_playing = true // note that we start wit a playing video
var c = 0;

var other_unseen_spot = function() {
  var c = 0;
  if ( unseen_spots.length > 0 ) {
    return unseen_spots[ Math.floor((Math.random() * unseen_spots.length)) ][1]
  }else{
    // if no unseen spots are left
    return active_spots[ Math.floor((Math.random() * active_spots.length)) ][1] // random
    // return active_spots[current_marker][1]                                      // last
  }
}

var do_next_marker = function() {
  console.log("do_next_marker")
  current_marker -= 1
  if (current_marker < 0) current_marker = active_spots.length - 1
  google.maps.event.trigger( active_spots[current_marker][1], 'click');
}

function initMap() {
  // Specify features and elements to define styles.
  if (channelsettings.style == undefined) {
    window.styleArray = [{"elementType":"all","featureType":"road","stylers":[{ "visibility": "off" },{"lightness":"-39"},{"gamma":"1.63"},{"visibility":"simplified"},{"saturation":"-32"}]},{"elementType":"all","featureType":"road.highway","stylers":[{"saturation":"-1"}]},{"elementType":"geometry.fill","featureType":"road.highway","stylers":[{"color":"#ebcd8d"},{"saturation":"0"},{"lightness":"0"}]},{"elementType":"labels.text","featureType":"road.highway","stylers":[{"color":"#ffffff"},{"weight":"10"}]}, {featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }] }]
  } else {
    window.styleArray = channelsettings.style
  }
  //{featureType: "poi", stylers: [{ visibility: "off" }]}

  if ( channelsettings.map_settings == undefined ) {
      channelsettings.map_settings = {
      "zoom": 16,
      "center": [ 51.21570734070004, 4.430990464495825 ],
      //"bounds": {
      //    "topleft": [ 51.2129728, 4.4277095 ],
      //    "bottomright": [ 51.2196805, 4.4738757 ]
      //},
      "zoomcontrol": true,
      "scrollwheel": true
    }
  }

  // starting place
  // map_center = new google.maps.LatLng(51.2151361,4.4382217);
  map_center = new google.maps.LatLng( channelsettings.map_settings.center[0], channelsettings.map_settings.center[1] )

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: map_center,
    scrollwheel: channelsettings.map_settings.scrollwheel,

    disableDefaultUI: true,
    streetViewControl: true,
    zoomControl: channelsettings.map_settings.zoomcontrol,
    mapTypeId: google.maps.MapTypeId.TERRAIN, //google.maps.MapTypeId.ROADMAP,

    // Apply the map style array to the map.
    styles: window.styleArray,
    zoom: channelsettings.map_settings.zoom
  });

  // drawroute
  function loadGPXFileIntoGoogleMap(map, filename) {
      $.ajax({url: filename,
          dataType: "xml",
          success: function(data) {
            console.log("has data!")
            var parser = new GPXParser(data, map);
            parser.setTrackColour("#b11116"); /// #007dc6     // Set the track line colour
            parser.setTrackWidth(4);          // Set the track line width
            parser.setMinTrackPointDelta(0.000000000001);      // Set the minimum distance between track points
            parser.centerAndZoom(data);
            parser.addTrackpointsToMap();         // Add the trackpoints
            parser.addWaypointsToMap();           // Add the waypoints
          },
          fail: function(e) {
            console.log("alles is kapot!", e)
          },
          always: function(e) {
            console.log("alles is voorbij")
          }
      });
  }

  console.log("load gpx")
  // loadGPXFileIntoGoogleMap( map, "/downloads/rvv2017_route.gpx")
  loadGPXFileIntoGoogleMap( map, "/clients/mediahuis/rvv2017_route_2.gpx")

  // map.addListener('click', function(e) { console.log("here I am: ", e) } );

  //var strictBounds = new google.maps.LatLngBounds(
    // south-west -> north-east
  //  new google.maps.LatLng(51.2129728,4.4277095),
  //  new google.maps.LatLng(51.2196805,4.4738757)
  //);

  // #### fill spots with ######################################################

  var spots = window.channelsettings.spots || []

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
                    '<img src="'+spot.preview+'" width="100%" height="100%" />'+
                  '</div>'+
                '</div>' +
                '<div class="iw-bottom-gradient"></div>' +
              '</div>'
    });

    active_spots.push([loc,mark,infowindow])
    unseen_spots.push([loc,mark,infowindow])

    var closeAllSpots = function() {
      // close the rest
      $.each( active_spots, function(i, value) {
        value[2].close();
      });
    }

    var remove_from_available = function( _infowindow ) {
      // remove
      var kill = -1
      $.each( unseen_spots, function(i, value) {
      //  console.log( "test", i, value[2], _infowindow )
        if ( value[2] == _infowindow ) {
          kill = i
        }
      })
      if ( kill != -1 ) {
        console.log("has kill remove", kill)
        unseen_spots.splice(kill, 1)
      }
    }

    google.maps.event.addListener( mark, 'click', function() {
      // close the rest
      closeAllSpots()
      var i = infowindow.open( map, mark );
      last_clicked_marqer = mark
      video_is_playing = false;

      // set inner links, if needed

      $('#360_video').unbind('click')
      $('#360_video').click(function(e) {
        console.log("start program", $(this).data('url'))
        startProgram( $(this).data('url'));
        e.preventDefault()
        e.stopPropagation()
      })
    });

    google.maps.event.addListener( infowindow, 'domready', function() {

      $('.gm-style-iw').each( function( i, value ) {
        if ($(this).find('iframe').length > 0) {
          $(this).addClass('gva_style')
        }else{
          $(this).removeClass('gva_style')
        }
      });

      $('.gm-style-iw').unbind('click')
      $('.gm-style-iw').click( function() {
        startProgram( $(this).find('#full_movie_play').data('program') )
        goFullscreen('video_player')
        $('#close_button').fadeIn("slow")
        closeAllSpots()
        remove_from_available( infowindow )
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
      iwBackground.children(':nth-child(3)').children(':nth-child(1)').children(':nth-child(1)').css('background-color', '#007dc6')
      iwBackground.children(':nth-child(3)').children(':nth-child(2)').children(':nth-child(1)').css('background-color', '#007dc6')
      iwBackground.children(':nth-child(1)').css('background-color:red;')
      iwBackground.children(':nth-child(3)').css('background-color:red;')
      iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

      var iwCloseBtn = iwOuter.next();
      iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', width: '15px', height: '15px', border: '1px solid #007dc6', 'border-radius': '13px', 'box-shadow': '0 0 5px #007dc6'});
      iwCloseBtn.click(function(){
        $('.gm-style-iw').removeClass('gva_style')
        closeAllSpots()
      });

      iwCloseBtn.mouseout(function(){
        $(this).css({opacity: '1'});
        video_is_playing = true // we pretent that video is playing, because we don't want infowindows popping up
      });

    }); // end dom ready

    // sets the first spot
    //if ( spot.active ) {
    //  first_marker = mark
    //}
  }); // end for each


  // #### Do some infowindow hocus pocus
  current_marker = active_spots.length

  // #### Autochoose video
  /*
  setInterval( function() {
    if ( !video_is_playing ) {
      c++;
    }else{
      return;
    }
    if ( c%20 == 0 ) {
      do_next_marker()
    }
  }, 1000 );
  */

  // ###### restrict boundries ##############################################

  // Listen for the dragend event
  /*
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
  */

  // end ######

  // Button Handler for the first click
  $('#close_button').click( function() {
    do_next_marker()
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
        //map.setZoom( 16 );
        //map.setCenter( map_center );
      }, 600 );
    }else{
      goFullscreen();
      setTimeout(function() {
        //map.setZoom( 17 );
        //map.setCenter( map_center );
      }, 600 );
    }
  })

  $('#map_full_screen_button').hide();
  closeVideoWindow();
}
