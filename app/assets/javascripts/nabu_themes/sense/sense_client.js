var SenseClient = function( _opts ) {
  _self = this
  _self.name = "sense_client"
  _self.title = "Sense Client"
  _self.type = "screen"
  // channel id
  // subscriber => guid
  // is_logged_in ?

  _self.options = _opts || {}

  // video1 = #video[1]
  // video2
  // video3
  // db_ref
  // b

  function init() {

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


  function update(e) {
    // on signal
    e.val()

    // initialize the data
    //var player_1 = function( e ) {
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
    //}

  }


  // used to generate the database, if it does not exist
  _self.default_config = {
    "client_1" : {
      "auto_bpm" : true,
      "blendmode" : 8,
      "bpm" : 393,
      "left_scratch" : 294.4219853959652,
      "mix" : 3,
      "mixer" : 1,
      "right_scratch" : 51.200415836730684,
      "trans_left" : false,
      "trans_right" : false,
      "video1" : {
        "cue" : {
          "in" : 15.46449,
          "out" : 0,
          "pressed" : false
        },
        "cue_a" : {
          "in" : 2.414875,
          "out" : 0,
          "pressed" : false
        },
        "cue_b" : {
          "in" : 0,
          "out" : 0,
          "pressed" : false
        },
        "cue_c" : {
          "in" : 0,
          "out" : 0,
          "pressed" : false
        },
        "currentTime" : 14.192853,
        "id" : "5611ac846465762b80000004",
        "paused" : false,
        "title" : "Timestorms",
        "url" : "http://nabu-dev.s3.amazonaws.com/uploads/video/574ce5a96465763793000032/720p_h264.mp4"
      },
      "video2" : {
        "cue" : {
          "in" : 55.658646,
          "out" : 0,
          "pressed" : false
        },
        "cue_a" : {
          "in" : 1,
          "out" : 10,
          "pressed" : false
        },
        "cue_b" : {
          "in" : 5,
          "out" : 0,
          "pressed" : false
        },
        "cue_c" : {
          "in" : 0,
          "out" : 0,
          "pressed" : false
        },
        "currentTime" : 14.698326,
        "id" : "53e2c64864657614553a0000",
        "paused" : false,
        "title" : "Burning Man hula hoop girls",
        "url" : "http://nabu-dev.s3.amazonaws.com/uploads/video/55f73fb06465762c5a000000/720p_h264.mp4"
      },
      "video3" : {
        "currentTime" : 0
      }
    }
  } // end default config

} // end SenseClient
