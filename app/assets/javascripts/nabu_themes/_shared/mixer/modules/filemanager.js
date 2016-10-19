var Filemanager = function() {
  var _self = this;
  _self.renderer;
  _self.bypass = false;
  _self.defaultQuality = "320p_h264_mobile"

  var c = 0;
  _self.nextUpdate = 400
  _self.updateMax = 1600

  var eligables = []
  $.each( programs, function( i, p ) {

    // add all the code about which movie you want here
    console.log(p.id)
    if ( p.assets._type == "Video" ) {
      eligables.push(p)
    }
  });

  _self.update = function() {
    c++;
    if ( c%100 == 0 ) console.log(" ##### ", c, _self.nextUpdate );
    if ( c >= _self.nextUpdate ) {
      c = 0;
      _self.change_channels();
    }
  }

  // note
  //_self.set_Channel = function( tag? name? id? ) {}

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
    });

    var rnd = Math.floor( Math.random() * shortlist.length )
    var source = getUrlByQuality( shortlist[ rnd ], _self.defaultQuality );

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

  // change source, randomly, on both channels
  _self.change_channels = function( _channel1, _channel2 ) {
    try {

      // set time to next update
      // _self.nextUpdate = Math.round( Math.random() * _self.updateMax );

      // choose random file from eligables, by quality
      rnd1 = Math.floor( Math.random() * eligables.length );
      rnd2 = Math.floor( Math.random() * eligables.length );
      var source1 = getUrlByQuality( eligables[ rnd1 ], _self.defaultQuality );
      var source2 = getUrlByQuality( eligables[ rnd2 ], _self.defaultQuality );

      // console.log( eligables[ rnd1 ].assets.versions[2].url )
      // console.log(rnd1, source1 );
      // console.log(rnd2, source2 );
      // console.log("next: ", _self.nextUpdate);

      // update info
      $('#program_title').hide().text(eligables[ rnd1 ].title).fadeIn('slow');
      $('#program_description').hide().text( eligables[ rnd1 ].description ).fadeIn('slow');

      console.log("source 1:", source1)
      console.log("source 2:", source2)

      // pass source on to the renderer
      _self.renderer.updateSource( 1, source1 );
      _self.renderer.updateSource( 2, source2 );

    } catch(e) {

      // console.log("caught an error: ", e);
      _self.change_channels();
    }
  }

  // helper
  getUrlByQuality = function( program, quality ) {
    var url = "";
    // console.log(program);
    if (program == undefined) return; // failsafe

    console.log(program.id);
    $.each( program.assets.versions, function(i, version ) {
      console.log("trr", version.label, quality)
      if ( version.label == quality ) {
        url = version.url //.replace("http://", "//");
        console.log("match:", version.url )
      }
    });
    // console.log("return:", url)
    return url;
  }
}
