function FileManager( _source ) {

  var _self = this
  _self.uuid = "Filemanager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.defaultQuality = ""
  _self.source = _source
  _self.programs = []
  _self.file
  _self.renderer = renderer // do we even need this ?!!

  // source.renderer ?
  programs.map(function(p) {console.log(p.tags)})

  _self.setSrc = function( file ) {
    _self.source.video.src = file
    _self.source.video.load()
    _self.source.video.currentTime = Math.random() * 60
    _self.source.video.play()
  }

  _self.getFileById = function( _id ) {
    var match = null
  }

  _self.getSrcByTags = function( _tags ) {
    // _tags = array
    var matches = []
    programs.forEach( function() {

    })
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  _self.change = function() {
    if ( programs.length == 0 ) return "no programs"
    var program = programs[ Math.floor( Math.random() * programs.length ) ]
    if ( program.assets._type != "Video" ) {
      // noit elegible, try again
      _self.change()
      return
    }
    _self.setSrc( _self.getSrcByQuality( program ) );
  }

  _self.changez = function(){
    _self.change()
  }

  _self.getSrcByQuality = function( _program, _quality ) {
    if ( _quality == undefined ) _quality = "720p_h264"
    var match = null
    _program.assets.versions.forEach( function(version) {
      if ( version.label == _quality ) match = version
    })
    return match.url;
  }
}
