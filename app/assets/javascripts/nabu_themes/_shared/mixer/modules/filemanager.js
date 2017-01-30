
// move them out of the filemanagaer
// or move everything, inlucind behaviour in
var getVideoWithQuality = function() {

}

var setSource = function( _progam, _channel ) {
  // renderer.setSource( getVideoWithQuality( program ), _channel ))
}

// behaviour
var Behaviour = function( _behaviour, _options ) {
  _self = this;

  // if key, use
  _self.options = _options;

  _self.random_switch = function( _composition, _channel ) {
    console.log( "random_switch", _composition );
    if ( Math.random() < _self.options.frequency ) {
      var lng = _composition.channel.sets[ _channel ].length
      var next = _composition.channel.sets[ _channel ][ Math.floor( Math.random() * lng ) ]
      setSource( next, _channel  )
    }
  }

  _self.switch_one_two = function( _composition ) {
    console.log( "switch_one_two", _composition );
  }

  _self.run = function( _composition ) {
    _self[ _behaviour ]( _composition );
  }
}

// pseudo code
// f = new Filemanager()
// beh = new f.Behaviour( "random_switch", { frequency: 0.01 } );

var Filemanager = function() {
  var _self = this;                            // this for that
  var c = 0;                                   // some counter
  _self.renderer;                              // reference
  _self.bypass = false;                        // bypass
  _self.defaultQuality = "720p_5000kbps_h264"  //"320p_h264_mobile" -- default quality
  _self.eligables = []                         // available files, only programs with _type Video are valid
  _self.composition = {                        // hoder for the current composition
    sets: [],
    behaviours: [],
    renderer: renderer
  }

  _self.Test = function( _test ) {
    var that = this
    that.foo = "bar"
    console.log("you've made a test, ", _test, _self.renderer  )

    that.doThis = function() {
      console.log( "-->", _self.renderer, that.foo)
    }
  }

  $.each( programs, function( i, p ) {
    if ( p.assets._type == "Video" ) {
      _self.eligables.push(p)
    }
  });

  console.log(" NOTICE file manager has", _self.eligables.length, "eligables" )

  _self.update = function() {
    c++;

    $.each( _self.composition.behaviours, function( i, channel_bhvs ) {
      if ( channel_bhvs != undefined ) {
        $.each( channel_bhvs, function( j, bhvs ) {
          bhvs.run( _self.composition, j );
        });
      }
    });

    // add beaviours like:
    // f.composition.behaviours[0] = [ new Behaviour( "random_switch", { foo: 'bar', bar: 1 } ) ]
  }

  // note
  //_self.set_Channel = function( tag? name? id? ) {}

  _self.set_channel = function( _obj, _channel ) {
    if ( _obj.tags   != undefined ) _self.set_channel_by_tags( _obj.tags, _channel )
    if ( _obj.titles != undefined ) _self.set_channel_by_titles( _obj.titles, _channel )
    if ( _obj.ids    != undefined ) _self.set_channel_by_ids( _obj.ids, _channel )
    // if ( _obj.files  != undefined ) _self.set_channel_by_files( _obj.files, _channel )
  }

  _self.set_behaviour = function( _behaviours, _channel ) {
    _self.composition.behaviours[_channel] = _behaviours
  }

  _self.set_channel_by_tags = function( _tags, _channel ) {
    _self.composition.sets[_channel] = []
    $.each( _self.eligables, function( i, elg ) {
      $.each( _tags, function( j, _tag ) {
        $.each( elg.tags, function( k, tag ) {
          if ( tag == _tag ) {
            _self.composition.sets[_channel].push( elg )
          }
        });
      });
    });
  }

  _self.set_channel_by_ids = function( _ids, _channel ) {
    _self.composition.sets[_channel] = []
    $.each( _self.eligables, function( i, elg ) {
      $.each( _ids, function( j, _id ) {
        if ( _id == elg.id ) {
          _self.composition.sets[_channel].push( elg )
        }
      });
    });
  }

  _self.set_channel_by_titles = function( _titles, _channel ) {
    _self.composition.sets[_channel] = []
    $.each( _self.eligables, function( i, elg ) {
      $.each( _titles, function( j, _title ) {
        if ( elg.title.indexOf( _title ) != -1 ) {
          _self.composition.sets[_channel].push( elg )
        }
      });
    });
  }

  /*

    files
    eligible
    programs

    _self.set_channel_by_file( id, _channel  )
    _self.set_channel_by_id( id, _channel  )
    _self.set_channel_by_tags( [tags], _channel  )
    _self.set_channel_by_stuff( {stuff}, _channel  )

    _self.set_current_group( tag )

    // source for program helper
    _self.getVideoWithQuality( _program, _quality )
    _self.

    // channel (1, 2, 3), mp4 file
    _self.renderer.updateSource( 1, source1 );

    updateSource(1, 'myfile_1.mp4')
    updateSource(2, 'myfile_2.mp4')

    //  pseudocode
    set: {
      1, ["awesome"]
      2, ["runner"]
      3, ["runner"]
    }

    set: {
      1, ["clients"],
      2, ["blurs1"],
      3, []
    }

    channel1.set = { channel_1: [ 'file.mp4', 'file.mp4' ] }
    [ [ 'file.mp4', 'file.mp4' ], [ 'file.mp4', 'file.mp4' ], [ 'file.mp4', 'file.mp4' ] ] // 1, 2, 3

    //behaviours?

    [  weight, name: {options} ] // wieght == frequency
    channel.behaviours  = []
     [  1, backtoback: {} ]
     [ 10, backtoback: {} ]
     [  5, backtoback: {} ]
     [ 80, sequencyer: { speed: '0.125', length: 16, pattern: '1010101112121234', cues: [ '', set[1][00:01:21], set[0][00:04:21], ]} ]

     set = {
      clips: [
        { "tags": [ "awesome", "manga" ] },
        { "ids": [ 5458796554ds5fdfs6fd5sf4sd6, 5458796554ds5fdfs6fd5sf4sd6, 5458796554ds5fdfs6fd5sf4sd6 ] },
        { "files": [ "asdasdasd.mp4", "dsadsadsada.mp4] }
      ],
      behaviours: [
        [
          { channel: 1, label: 'sequencer', weight: 0.5, options: {} },
          {}
        ],
        [],
        []
      ],
      blendmodes: [],
      mixes: [],
      effects: [],
      shaders: []
    }
     }

    // actual code
    f.renderer.updateSource( 1, f.getUrlByQuality( programs[1], '480p_h264' ) ) //program 1
    f.renderer.updateSource( 1, f.getUrlByQuality( programs[ Math.floor( Math.random() * programs.length ) ], '480p_h264' ) ) // random


  */

  // get file by tag and set it as to specific channel ( 1 or 2 )
  _self.change_channel = function( _obj, _channel ) {
    if (!_obj) return;
    var obj = _obj;
    var channel = _channel || 1;
    var shortlist = [];
    $.each( eligables, function( index, program ) {
      //if ( value.tags.toString().indexOf( tag ) != -1 ) shortlist.push( value );
      if ( program[obj.key].toString().toLowerCase().indexOf( obj.value.toLowerCase() ) != -1 ) shortlist.push( program );
      // console.log('match:', tag, channel);
      console.log(obj)
    });

    var rnd = Math.floor( Math.random() * shortlist.length )
    var source = _self.getUrlByQuality( shortlist[ rnd ], _self.defaultQuality );

    // set info (ony if channel 1?, or optional
    $('#program_title').hide().text(eligables[ rnd ].title).fadeIn('slow');
    $('#program_description').hide().text( eligables[ rnd ].description ).fadeIn('slow');

    // console.log('source => ', source)
    _self.renderer.updateSource( channel, source );

    currentvideo =  document.getElementById('video' + channel)

    // Helper
    var randomInPoint = function()  {
      currentvideo.removeEventListener('canplay', randomInPoint )
      console.log( currentvideo.duration )
      currentvideo.currentTime = Math.floor( Math.random() * currentvideo.duration )
    };

    currentvideo.addEventListener('canplay', randomInPoint )
  }

  // TODO CLEAN THE FOLLOWING MESS UP!

  // change source, randomly, on both channels
  _self.change_channels = function( _channel1, _channel2 ) {
    //try {

      // set time to next update
      // _self.nextUpdate = Math.round( Math.random() * _self.updateMax );

      // choose random file from eligables, by quality
      rnd1 = Math.floor( Math.random() * eligables.length );
      rnd2 = Math.floor( Math.random() * eligables.length );
      var source1 = _self.getUrlByQuality( eligables[ rnd1 ], _self.defaultQuality );
      var source2 = _self.getUrlByQuality( eligables[ rnd2 ], _self.defaultQuality );

      // console.log( eligables[ rnd1 ].assets.versions[2].url )
      // console.log(rnd1, source1 );
      // console.log(rnd2, source2 );
      // console.log("next: ", _self.nextUpdate);

      console.log("picked random source 1:", source1)
      console.log("picked random source 2:", source2)

      // pass source on to the renderer
      if (Math.random() > 0.5 ) {
        _self.renderer.updateSource( 1, source1 );
        //firebase.database().ref('/client_1/video1/').child('url').set( source1 );
        //firebase.database().ref('/client_1/video1/').child('title').set( eligables[ rnd1 ].title );
        //firebase.database().ref('/client_1/video1/').child('id').set( eligables[ rnd1 ].id );

        // update info
        $('#program_title').text(eligables[ rnd1 ].title) //.fadeIn('slow');
        $('#program_description').text( eligables[ rnd1 ].description ) //.fadeIn('slow');
        setTimeout( function() { doTypeOn("#footer") }, 200 );

      }else{
        _self.renderer.updateSource( 2, source2 );
        //firebase.database().ref('/client_1/video2/').child('url').set( source2 );
        //firebase.database().ref('/client_1/video2/').child('id').set( eligables[ rnd2 ].id );
        //firebase.database().ref('/client_1/video2/').child('title').set( eligables[ rnd2 ].title );

        // update info
        $('#program_title').text(eligables[ rnd2 ].title) //.fadeIn('slow');
        $('#program_description').text( eligables[ rnd2 ].description ) //.fadeIn('slow');
        setTimeout( function() { doTypeOn("#footer") }, 200 );
      }

    //} catch(e) {

      // console.log(" ### ERROR ### caught an error: ", e);
      //_self.change_channels();
    //}
  }

  // helper ==> move to utilitiess ?
  _self.getUrlByQuality = function( program, quality ) {
    var url = "";
    // console.log(program);
    if (program == undefined) return; // failsafe

    //console.log(program.id);
    $.each( program. assets.versions, function(i, version ) {
      //console.log("trr", version.label, quality)
      if ( version.label == quality ) {
        url = version.url //.replace("http://", "//");
        //console.log("match & load:", version.url )
      }
    });
    // console.log("return:", url)
    return url;
  }
}
