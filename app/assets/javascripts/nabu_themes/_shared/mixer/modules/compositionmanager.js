
// -----------------------------------------------------------------------------
// Behaviour
// -----------------------------------------------------------------------------

var jumpin = function(e) {
  this.currentTime = Math.random() * this.duration
  this.removeEventListener('canplay', jumpin )
}

var Behaviour = function( _behaviour, _options ) {
  _self = this;

  // mandatory
  _self.options = {};
  _self.options.label = _behaviour
  _self.options.frequency = 0.0004;
  _self.options.bypass = false;

  // any other options
  _self.options = Object.assign( _self.options, _options);

  /* random switch
    explanation here
  */
  _self.random_switch = function( _composition, _channel, _force ) {
    if ( Math.random() < _options.frequency || _force  ) {
      console.log('switch', _options, this.options.label, _options.frequency, _channel, _force)
      var lng = _composition.sets[ _channel ].length;
      var next = _composition.sets[ _channel ][ Math.floor( Math.random() * lng ) ];
      _composition.renderer.updateSource( _channel + 1, _composition.manager.getUrlByQuality( next, '720p_h264') );

      // failsafe
      window["video"+(_channel+1)].removeEventListener('canplay', jumpin )
      window["video"+(_channel+1)].addEventListener('canplay', jumpin )

      // update info
      // TODO: dispatch some kind of event to trigger stuff like this :-/
      // (this needs to be in the main function)
      //console.log(next)
      if ( _channel == 0 && $('#program_title').text != next.title ) {
        $('#program_title').text( next.title ) //.fadeIn('slow');
        $('#program_description').text( next.description ) //.fadeIn('slow');
        setTimeout( function() { doTypeOn("#typer") }, 200 );
      }

      //console.log(_self)
      return next
    }
  }

  /* switch_one_two
    explanation here
  */
  _self.switch_one_two = function( _composition, _channel  ) {
    if ( Math.random() < _options.frequency ) {
      console.log( "switch_one_two", _composition );
      var set =  _composition.sets[ _channel ]
      //_Self.options.pattern = [1, 2, 1, 2, 3, 4, 3, 2, 1];
      console.log( "pattern?", _options.pattern )
    }
  }

  /* random_jump
    explanation here
  */
  _self.random_jump = function( _composition, _channel, _force ) {
    if ( Math.random() < _options.frequency || _force ) {
      //console.log("jump!", _options, this.options.label, _options.frequency, _channel);
      try {
        window["video"+(_channel+1)].currentTime = Math.floor( Math.random() * window["video"+(_channel+1)].duration )
      } catch(e) {
        // ---
      }
    }
  }

  /* jump_now
    sada
  */
  _self.now = function( _composition, _channel ) {
    if ( this.hasrun == undefined ) {
      console.log("now now", _composition, _channel )
      this[ this.options.behaviour ]( _composition, _channel, true );
    }

    this.hasrun = true;
  }

  // runner
  _self.run = function( _composition, _channel, _force ) {
    return this[ this.options.label ]( _composition, _channel );
  }
}


// -----------------------------------------------------------------------------
// Manager
// -----------------------------------------------------------------------------

var Compositionmanager = function() {
  var _self = this;                            // this for that
  var c = 0;                                   // some counter
  _self.renderer;                              // reference
  _self.bypass = false;                        // bypass
  _self.defaultQuality = "720p_h264"; //"320p_h264_mobile" -- default quality
  _self.eligables = [];                        // available files, only programs with _type Video are valid
  _self.composition = {                        // hoder for the current composition
    sets: [[],[],[]],
    behaviours: [[],[],[]],
    manager: this
  }

  /* hackityhack */
  setTimeout( function() { _self.composition.renderer = _self.renderer }, 200 );

  // set elegibles
  $.each( programs, function( i, p ) {
    if ( p.assets._type == "Video" ) {
      _self.eligables.push(p);
    }
  });

  console.log(" NOTICE: file manager has", _self.eligables.length, "eligables" );

  // update
  _self.update = function() {
    c++;
    // run behaviours
    $.each( _self.composition.behaviours, function( i, channel_bhvs ) {
      // for each channel
      //if (c%500 == 0) console.log("for each channel: ", i, channel_bhvs)
      if ( channel_bhvs != undefined ) {
        $.each( channel_bhvs, function( j, bhvs ) {
          //console.log(j, bhvs)
          if (c%500== 0) {
            //console.log("RUN behaviour", i, j, bhvs.options.label, bhvs.options.frequency)
            bhvs.run( _self.composition, i, "true" );
          }else{
            bhvs.run( _self.composition, i );
          }
        });
      }
    });

    // add beaviours like:
    // f.composition.behaviours[0] = [ new Behaviour( "random_switch", { foo: 'bar', bar: 1 } ) ]
  }

  _self.set_behaviour = function( _behaviours, _channel ) {
    _self.composition.behaviours[_channel] = _behaviours
  }

  _self.set_channel_by_tags = function( _tags, _channel ) {
    _self.composition.sets[_channel] = [];
    $.each( _self.eligables, function( i, elg ) {
      $.each( _tags, function( j, _tag ) {
        $.each( elg.tags, function( k, tag ) {
          if ( tag.toLowerCase() == _tag.toLowerCase() ) {
            _self.composition.sets[_channel].push( elg );
          }
        });
      });
    });
    return _self.composition.sets[_channel];
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
    return _self.composition.sets[_channel]
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
    return _self.composition.sets[_channel]
  }


  // ---------------------------------------------------------------------------
  // helpers
  // ---------------------------------------------------------------------------

  // helper ==> move to utilitiess ?
  _self.getUrlByQuality = function( program, quality ) {
    var url = "";
    // console.log(program);
    if (program == undefined) return; // failsafe

    //console.log(program.id);
    $.each( program. assets.versions, function(i, version ) {
      //console.log("trr", version.label, quality)
      if ( version.label == quality ) {
        url = version.url; //.replace("http://", "//");
        //console.log("match & load:", version.url )
      }
    });
    // console.log("return:", url)
    return url;
  }

  _self.set_channel = function( _obj, _channel ) {
    if ( _obj.tags   != undefined ) _self.set_channel_by_tags( _obj.tags, _channel )
    if ( _obj.titles != undefined ) _self.set_channel_by_titles( _obj.titles, _channel )
    if ( _obj.ids    != undefined ) _self.set_channel_by_ids( _obj.ids, _channel )
    // if ( _obj.files  != undefined ) _self.set_channel_by_files( _obj.files, _channel )
  }
}
