// Initialize Firebase
var config = {
  apiKey: "AIzaSyDgrYfOUDN1QLRDcY4z45WwkcOjkXiImNQ",
  authDomain: "mixerbase-829c2.firebaseapp.com",
  databaseURL: "https://mixerbase-829c2.firebaseio.com",
  storageBucket: "mixerbase-829c2.appspot.com",
  messagingSenderId: "568387460963"
};

firebase.initializeApp(config);

//var bigOne = document.getElementById('bigOne');
//var dbRef = firebase.database().ref().child('text');
//dbRef.on('value', snap => bigOne.innerText = snap.val());

//firebase.database().ref('/client_1/left_scratch').on('value', function(e) {
//  console.log("oi", e.val())
//  $('#video1')[0].currentTime = e.val();
///})

//firebase.database().ref('/client_1/right_scratch').on('value', function(e) {
//  console.log("oi")
//  $('#video2')[0].currentTime = e.val();
//})


// inits
//_dbRef.ref(_clientRef + "video1/").child('title').set( "default 1" )
//_dbRef.ref(_clientRef + "video1/").child('url').set( "https://nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/320p_h264_mobile.mp4" )
//_dbRef.ref(_clientRef + "video2/").child('title').set( "default 2")
//_dbRef.ref(_clientRef + "video2/").child('url').set( "https://nabu-dev.s3.amazonaws.com/uploads/video/558b39266465760a3700001b/320p_h264_mobile.mp4" )

/*
var autoTimeout = 0
var auto_bpm = false
var _c = 0

var trans_left = false
var trans_right = false

var blendmodes = [
  [  1, "add"],
  [  7, "lighten"],
  [ 13, "hard-light"],
  [  4, "darken"],
  [ 12, "soft-light"],
  [  8, "screen"]
];

var mixes = [
  [ 1, "mix" ],
  [ 2, "hard" ],
  [ 3, "nam" ],
  [ 4, "fam" ]
]
*/

var _dbRef = firebase.database()
var _clientRef = "/client_1/"
var _client = _dbRef.ref(_clientRef)


  //console.log("client update", $('#control_container').length)
  //if ( local_client == "player_1" ) player_1( e ); // player_container?
  //if ( local_client == "controls" ) control( e );
  $.each( clients, function( i, c ) {
    c.dbref.ref('/client/').on('value', function( e ) {
      c.update( e )
    })
  })
});

/*
var player_1 = function( e ) {
  if ( $('#video1')[0].src != e.val().video1.url ) {
    $('#video1')[0].src = e.val().video1.url;
    console.log("src 2")
  }

  if ( $('#video2')[0].src != e.val().video2.url ) {
    $('#video2')[0].src = e.val().video2.url;
    console.log("src 2")
  }

  // console.log(e.val().blendmode)
  customUniforms.blendmode.value = e.val().blendmode

  b.bpm = e.val().bpm
  b.bypass = !Boolean(e.val().auto_bpm)
  b.mix = e.val().mix

  trans_left = e.val().trans_left
  trans_right = e.val().trans_left
}
*/

var control = function( e ) {

  //console.log( "control" )

  if ( $('#content_video1')[0].src != e.val().video1.url.replace("720p_h264", "320p_h264_mobile") ) {
    $('#content_video1')[0].src = e.val().video1.url.replace("720p_h264", "320p_h264_mobile");
    console.log("src 1")
  }

  if ( $('#content_video2')[0].src != e.val().video2.url.replace("720p_h264", "320p_h264_mobile") ) {
    $('#content_video2')[0].src = e.val().video2.url.replace("720p_h264", "320p_h264_mobile");
    console.log("src 2")
  }

  if ( Math.abs( $('#content_video1')[0].currentTime - e.val().video1.currentTime ) > 2 ) {
    console.log("sync 1", e.val().video1.currentTime, Math.abs( $('#content_video2')[0].currentTime - e.val().video2.currentTime ) );
    $('#content_video1')[0].currentTime = e.val().video1.currentTime;
  }

  if ( Math.abs( $('#content_video2')[0].currentTime - e.val().video2.currentTime ) > 2 ) {
    console.log("sync 2", e.val().video2.currentTime, Math.abs( $('#content_video2')[0].currentTime - e.val().video2.currentTime ) );
    $('#content_video2')[0].currentTime = e.val().video2.currentTime;
  }

  var incoming_values = [];
  var targets = [];

  //console.log("update!")
  $('#right_cue').data( "in", e.val().video2.cue )

  var cues = [
    [ e.val().video1.cue_a, $('#left_cue_a')  ],
    [ e.val().video1.cue_b, $('#left_cue_b')  ],
    [ e.val().video1.cue_c, $('#left_cue_c')  ],
    [ e.val().video2.cue_a, $('#right_cue_a') ],
    [ e.val().video2.cue_b, $('#right_cue_b') ],
    [ e.val().video2.cue_c, $('#right_cue_c') ]
  ];

  $.each( cues, function( key, value ) {
    if ( value[0] ) {
      // value[1]
    }
  });

  if ( e.val().auto_bpm ) {
    $("#auto_bpm").addClass('red');
  }else{
    $("#auto_bpm").removeClass('red');
  }
  auto_bpm = e.val().auto_bpm

  $('#bpm_display .bpm').text( e.val().bpm );


  e.val().trans_left ? $('#left_trans').addClass('yellow') : $('#left_trans').removeClass('yellow');

  $('#blend_mode').text( (function() {
    var mode
    $.each( blendmodes, function(i,b) { if (e.val().blendmode == b[0] ) mode = b[1] } )
    return mode
  }) )

  $('#mix').text((function() {
    var mix
    $.each( mixes, function(i,m) { if ( e.val().mix == m[0] ) mix =  m[1] } )
    return mix
  }) )
  // (e.val().video1.cue_a != undefined && e.val().video1.cue_a.in != -1 && e.val().video1.cue_a.out != -1) ? $('#left_cue_a').addClass('red') : $('#left_cue_a').removeClass('')

  e.val().trans_right ? $('#right_trans').addClass('yellow') : $('#right_trans').removeClass('yellow');
}


// Helper bpm &C., maybe other updates?
var __C = 0
setInterval( function() {
  var clr
  auto_bpm ? clr = 'red' : clr = 'yellow'
  __C += 0.1


  var insec = Math.sin( __C  * Math.PI * $("#bpm_display .bpm").text() / 60)

  //console.log(insec)
  if ( auto_bpm ) {
    $('#bpm_range').val( 100 * ( ( insec + 1 ) / 2) );
  }

  if ( insec > 0 ) {
    $("#tap_bpm").addClass(clr)
  }else{
    $("#tap_bpm").removeClass('red')
    $("#tap_bpm").removeClass('yellow')
  }

}, 100 )

var player_1 = new SenseClient()
var control = new Control() // SenseControl ?
var clients = [ player_1, control ]

$(function() {



  // init
  $.each( clients, function( i, c ) {
    c.init()
  })

  //var vid1 = document.getElementById('content_video1')
  //var vid2 = document.getElementById('content_video2')

  /*
  $('#left_cue_a')
  $('#left_cue_b')
  $('#left_cue_c')
  $('#left_out')

  $('#right_cue_a').addClass('red')
  $('#right_cue_b').addClass('red')
  $('#right_cue_c').addClass('red')

  $('#right_out').click( function() {
    $('#right_cue').data("out", vid2.currentTime)
    vid2.currentTime = $('#right_cue').data("in")
  })

  $('#left_cue')
  $('#left_play')

  $('#right_cue').addClass('yellow')
  $('#right_cue').click( function() {
    vid2.currentTime = $('#right_cue').data("in")
    $('#right_cue').removeClass('yellow')
  })

  $('#right_play').addClass('green')
  $('#right_play').click( function() {
      if ( vid2.paused ) {
        vid2.play()
        $('#right_play').removeClass("blink_green")
        $('#right_play').addClass("green")

        if ( $('#right_cue').data("out") === undefined ) {
          $('#right_out').addClass('yellow')
        }
      }else{
        vid2.pause()
        $('#right_play').removeClass("green")
        $('#right_play').addClass("blink_green")
        $('#right_cue').addClass("blink_yellow")

        // set cue
        _dbRef.ref(_clientRef + "video2/").child("cue").set(vid2.currentTime)
        $('#right_cue').addClass('yellow')
        $('#right_out').addClass('yellow')
      }
  })
  */

  // init controls if in controls
  // if ( local_client == "controls" ) init_control();
  // if ( local_client == "player_1" ) init_player_1();

  // ---------------------------------------------------------------------------

  // ### effect ###

})


// ---------------------------------------------------------------------------

/*
var init_player_1 = function() {
  _dbRef.ref(_clientRef).child('left_scratch').on('value', function(e) {
      $('#video1')[0].currentTime = e.val();
  })

  _dbRef.ref(_clientRef).child('right_scratch').on('value', function(e) {
      $('#video2')[0].currentTime = e.val();
  })

  _dbRef.ref(_clientRef).child('mixer').on('value', function(e) {
    b.c_a = e.val() * -1.34 //0.38
    //console.log("mixer: ", e.val(), b.c_a)
  })
}
*/

var init_control = function() {

  console.log("init control")

  $('#bpm_range').on('mousemove change', function() {
   if (auto_bpm) return
   var __C = ( ( $(this).val() / 100 ) * 2 )  -1
   _dbRef.ref(_clientRef).child('mixer').set(__C)
  })

  $('#left_trans').mousedown(function() { _client.child('trans_left').set( true ); } ).mouseup(function(){ _client.child('trans_left').set( false ); } );

  document.getElementById('left_trans').ontouchstart = function() {
    _client.child('trans_left').set( true );
  }

  document.getElementById('left_trans').ontouchend = function() {
    _client.child('trans_left').set( false );
  }

  var b = 0;

  $('#blend_mode').click( function() {
    b+=1
    if ( b >= blendmodes.length ) b = 0;
    _dbRef.ref( _clientRef ).child("blendmode").set( blendmodes[b][0] )
    $('#blend_mode').text( blendmodes[b][1] )
  })

  var m = 0;

  $('#mix').click( function() {
    m+=1
    if ( m >= mixes.length ) m = 0;
    _dbRef.ref( _clientRef ).child("mix").set( mixes[m][0] )
    $('#mix').text( mixes[m][1] )
  })

  $('#right_trans').mousedown(function() { _client.child('trans_right').set( true ); } ).mouseup(function(){ _client.child('trans_right').set( false ); } );

  document.getElementById('right_trans').ontouchstart = function() {
    _client.child('trans_right').set( true );
  }

  document.getElementById('right_trans').ontouchend = function() {
    _client.child('trans_right').set( false );
  }

  // ---------------------------------------------------------------------------

  $('#left_scratch').click(function() { firebase.database().ref('/client_1/').child('left_scratch').set( Math.random() * $('#content_video1')[0].duration ) } );
  _dbRef.ref(_clientRef).child('left_scratch').on('value', function(e) {
      $('#content_video1')[0].currentTime = e.val();
  })

    // ### LE BEAT CONTROLLER ###

  $('#auto_bpm').click( function() {
    firebase.database().ref('/client_1/').child('auto_bpm').set( !auto_bpm )
  })

  $('#half_bpm').click( function() {
    console.log("/2")
    firebase.database().ref('/client_1/').child('bpm').set( Math.round( Number($('#bpm_display .bpm').text()) / 2 ) );
  });

  //$('#bpm_display .bpm')
  $('#bpm_one_down').click( function() {
    firebase.database().ref('/client_1/').child('bpm').set( Number( $('#bpm_display .bpm').text() ) - 1 );
  })

  $('#bpm_one_up').click( function() {
    firebase.database().ref('/client_1/').child('bpm').set( Number( $('#bpm_display .bpm').text() ) + 1 );
  });


  $('#double_bpm').click( function() {
    console.log("*2")
    firebase.database().ref('/client_1/').child('bpm').set( Math.round( Number($('#bpm_display .bpm').text()) * 2 ) );
  })

  var last_taps = [ (new Date()).getTime(), (new Date()).getTime(), (new Date()).getTime() ]
  var average = -1

  $('#tap_bpm').mousedown( function() {
    var now = (new Date()).getTime()
    console.log( last_taps[ last_taps.length - 1 ], now )
    if ( now - last_taps[ last_taps.length - 1 ] > 4000 ) {
      last_taps = [ (new Date()).getTime(), (new Date()).getTime(), (new Date()).getTime() ]
    }else{
      last_taps.reverse().pop()
      last_taps.reverse().push( (new Date()).getTime() )

      $.each( last_taps, function( i, value ) {
        if ( i == 0 ) return;
        average += value - last_taps[i-1]
        console.log(i, value)
      })

      average = average / 3
    }

    var bpm = Math.round( ( 1 / ( average / 1000)  ) * 60 )
    console.log( "--> ", average, bpm)
    //$('#bpm_display .bpm').text( bpm );
    firebase.database().ref('/client_1/').child('bpm').set( bpm )

  })


  $('#right_scratch').click(function() { firebase.database().ref('/client_1/').child('right_scratch').set( Math.random() * $('#content_video2')[0].duration ) } );
  _dbRef.ref(_clientRef).child('right_scratch').on('value', function(e) {
      $('#content_video2')[0].currentTime = e.val();
  })
}
