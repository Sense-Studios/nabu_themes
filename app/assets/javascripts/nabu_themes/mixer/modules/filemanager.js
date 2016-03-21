var Filemanager = function() {
  var _self = this;
  _self.renderer;
  _self.bypass = false;

  var c = 0;
  var nextUpdate = 400

  var eligables = []
  $.each( programs, function( i, p ) {
    if ( p.assets._type == "Video" ) {
      eligables.push(p)
    }
  });

  _self.update = function() {
    c++;
    if ( c%100 == 0 ) console.log("#####")
    if ( c >= nextUpdate ) {
      c = 0
      nextUpdate = Math.round( Math.random() * 800 );
      rnd1 = Math.round( Math.random() * eligables.length )
      rnd2 = Math.round( Math.random() * eligables.length )

      var source1 = getUrlByLabel( eligables[ rnd1 ], '480p_h264' )
      var source2 = getUrlByLabel( eligables[ rnd2 ], '480p_h264' )

      console.log(rnd1, source1 )
      console.log(rnd2, source2 )
      console.log("next: ", nextUpdate)

      _self.renderer.updateSource( 1, source1 )
      _self.renderer.updateSource( 2, source2 )
    }
  }

  getUrlByLabel = function( program, label ) {
    var url = ""
    $.each( program.assets.versions, function(i, version ) {
      if ( version.label == label ) {
        url = version.url
      }
    });
    return url
  }
}
