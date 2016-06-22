var Filemanager = function() {
  var _self = this;
  _self.renderer;
  _self.bypass = false;

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
    if ( c%100 == 0 ) console.log(" ##### ", c, _self.nextUpdate )
    if ( c >= _self.nextUpdate ) {
      c = 0
      _self.change_channels()
    }
  }

  _self.change_channels = function( _channel1, _channel2 ) {
    try {
      _self.nextUpdate = Math.round( Math.random() * _self.updateMax );
      rnd1 = Math.round( Math.random() * eligables.length )
      rnd2 = Math.round( Math.random() * eligables.length )

      var source1 = getUrlByLabel( eligables[ rnd1 ], '480p_h264' )
      var source2 = getUrlByLabel( eligables[ rnd2 ], '480p_h264' )

      console.log(rnd1, source1 )
      console.log(rnd2, source2 )
      console.log("next: ", _self.nextUpdate)

      // update info
      $('#program_title').hide().text(eligables[ rnd1 ].title).fadeIn('slow')
      $('#program_description').hide().text( eligables[ rnd1 ].description ).fadeIn('slow')

      _self.renderer.updateSource( 1, source1 )
      _self.renderer.updateSource( 2, source2 )
    } catch(e) {
      console.log("caught an error: ", e)
      _self.change_channels()
    }
  }

  getUrlByLabel = function( program, label ) {
    var url = ""
    console.log(program)
    if (program == undefined) return // failsafe

    console.log(program.id)
    $.each( program.assets.versions, function(i, version ) {
      if ( version.label == label ) {
        url = version.url
      }
    });
    return url
  }
}
