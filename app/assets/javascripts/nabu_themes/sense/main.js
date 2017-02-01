// *****************************************************************************

// BWHAHAHAHAHAHA

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

function pollGamepads() {
  setInterval( function() {
    var gamepad = navigator.getGamepads()[0]
    console.log(
      gamepad.axes[0],
      gamepad.axes[1],
      gamepad.axes[2],
      gamepad.axes[3],
      gamepad.timestamp,
      gamepad.id,
      gamepad.buttons[0].pressed,
      gamepad.buttons[0].touched,
      gamepad.buttons[0].value
    );


  }, 500)

}

// *****************************************************************************

var r, b, f

$(function() {

  // Set up the renderer
  r = new GLRenderer()
  b = new BPM()
  // f = new Filemanager()
  comp = new Compositionmanager()

  // attach modules to renderer
  r.addModule(b)
  // r.addModule(f)
  r.addModule(comp)
  r.start()

  var video1 = document.getElementById('video1')
  var video2 = document.getElementById('video2')
  // var video3 = document.getElementById('video3')

  // set up the buttons
  $('#button-user').click( function() {
    if (document.getElementById('video1').paused) {
      video1.play();
      video2.play();
    }else{
      video1.pause();
      video2.pause();
    }
  });

  $('#button-home').click( function() {
    window.location.hash = "home"
  })

  // toggle content
  $('#button-content').click( function() {
    if ( $('#content').data("is_visible") == "true" ) {
      $('#content').data("is_visible", "false")
    }else{
      $('#content').data("is_visible", "true")
       doTypeOn(".col")
    }
  });

  var bpms = [ 2, 4, 8, 16, 28, 32, 64 ]
  var current_bpm = 6
  b.bpm = 28;
  $('#button-beat').click( function() {
    current_bpm += 1
    if ( current_bpm >= bpms.length ) current_bpm = 0
    b.bpm = bpms[current_bpm]
    //console.log( "bpm set to: ", bpms[current_bpm])
    $('#button-beat').text( bpms[current_bpm] )
  })

  // scratch videos
  $('#button-cat').click( function() {
    video1.currentTime = Math.random() * video1.duration
    video2.currentTime = Math.random() * video2.duration
  })

  // switch blendmodes
  var blms = [ 1, 7, 13, 4, 12, 8 ]
  var blend_names = ["add", "light", "hard", "dark", "soft", "scrn"]
  var current_blm = 0
  $('#button-menu').click( function() {
    current_blm += 1
    if ( current_blm >= blms.length ) current_blm = 0
    //r.blendingMode = blms[current_blm]
    customUniforms.blendmode.value = blms[current_blm]
    //console.log( "blendingMode set to: ", blms[current_blm])
    $('#button-menu').text(blend_names[current_blm])
  })

  // switch content
  $('#button-cont').click( function() {
    f.change_channels()
  })

  setPage()
  $(window).on( 'hashchange', function() { setPage( ); } );

}); // end load

var testconfig = function() {
  // load the compo
  console.log("setup test composition")
  comp.set_channel_by_tags(["awesome"], 0)
  var bhv1 = new Behaviour( "random_switch" )
  comp.set_behaviour([bhv1], 0)

  comp.set_channel_by_tags(["awesome"], 1)
  var bhv2 = new Behaviour( "random_switch" )
  comp.set_behaviour([bhv2], 1)

  comp.set_channel_by_tags(["awesome"], 2)
  var bhv3 = new Behaviour( "random_switch" )
  comp.set_behaviour([bhv3], 2)

  //console.log(comp.composition)
}

// set up default text
var setPage = function( _page ) {
  // _page should work as an override
  if ( _page != undefined ) window.location.hash = _page
  if ( window.location.hash.substring(1) == "" ) window.location.hash = "home"

  var page_settings = channelsettings [ window.location.hash.substring(1) ]

  $('#content').html( channelsettings [ window.location.hash.substring(1) ].text)

  // animated helpers
  doTypeOn(".col")
  doTypeOn(".item:eq(0)", 100 )
  doTypeOn(".item:eq(1)", 300 )
  doTypeOn(".item:eq(2)", 500 )
  doTypeOn(".item:eq(3)", 800 )
  doTypeOn(".item:eq(4)", 1000 )

  // set
  // channelsettings.tags
  // channelsettings.video1
  // channelsettings.video2
  // channelsettings.bpm
  // channelsettings.blendmode

  // channelsettings.tags =
  // channelsettings.behaviours = []

  // comp.composition  = channelsettings.composition;
  console.log( "channel tags ", page_settings.tags )
  console.log( "channel behaviours ", page_settings.behaviours )
  comp.set_channel_by_tags( page_settings.tags[0], 0 );
  comp.set_channel_by_tags( page_settings.tags[1], 1 );
  comp.set_channel_by_tags( page_settings.tags[2], 2 );

  //if (page_settings.behaviours != undefined ) {
  //  comp.set_behaviour( [ new Behaviour( page_settings.behaviours[0].label, page_settings.behaviours[0].options ), 0  );
  //  comp.set_behaviour( [ new Behaviour( page_settings.behaviours[1].label, page_settings.behaviours[1].options ), 1  );
  //  comp.set_behaviour( [ new Behaviour( page_settings.behaviours[2].label, page_settings.behaviours[2].options ), 2  );
  //}

  var behaviours = [[],[],[]];
  page_settings.behaviours.map( function( bhv ) {
    var behaviour = new Behaviour( bhv.label, bhv.options )
    behaviours[ bhv.channel ].push( behaviour )
  })

  //$.each( page_settings.behaviours, function( i, bhv ) {
  //  comp.set_behaviour( [  ], bhv.channel );
  //}

  console.log(" set behaviour instances: ", behaviours )

  comp.set_behaviour( behaviours[0], 0 );
  comp.set_behaviour( behaviours[1], 1 );
  comp.set_behaviour( behaviours[2], 2 );
}

// type on helper
var doTypeOn = function( elm, delay ) {
  var str = $(elm).html(),
      i = 0,
      isTag,
      text;

  console.log("dotypeon", str )
  if (delay == undefined) delay = 0

  if (!str) return;

  setTimeout( function type() {
    rnd = Math.round( Math.random() * 120 ) + 24
    rc = (0|Math.random()*9e6).toString(36)
    text = str.slice(0, i);
    newt = str.slice(i-rnd, i);
    //console.log(i-r, i)
    text = text + "<span class='white_back'>" + newt + "</span> <span class='grey_back'>" + rc + "</span>";
    i += rnd;

    if (text === str) return;
    $(elm).html( text );
    $(elm).find('.white_back').fadeOut(60)
    $(elm).find('.grey_back').hide().fadeIn(80)
    $(elm).css('opacity', 1)

    //var char = text.slice(-1);
    //if( char === '<' ) isTag = true;
    //if( char === '>' ) isTag = false;
    //if ( isTag ) return type();

    if ( i < str.length ) {
      setTimeout( type, Math.round( Math.random() * 180 ) );
    }else{
      $(elm).html( str )
    }
  }, delay );
}
