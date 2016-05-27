var BPM = function() {

  var _self = this

  // public, mandatory
  _self.renderer
  _self.bypass = false

  // public, custom
  _self.c_a = -( Math.PI / 2) // counted alpha, a measure for bpm and secods
  _self.bpm = 0               // bpm in, well beats per minutes ;)
  _self.stacato = false       // hard switching

  // private
  var n = (new Date()).getTime()

  // add to global update
  _self.update = function() {
    if ( _self.bypass || _self.bpm == 0) return
    _self.c_a += ( _self.bpm / 60 ) / (2*Math.PI)


    // now a case might be made to hook this up to the crossfader,
    // not directly to the renderer.
    _self.renderer.alpha = ( Math.sin( _self.c_a ) + 1 ) / 2;

    var g = new Date()
    g = g.getTime() - n

    // hard switching
    if ( _self.stacato ) {
      _self.renderer.alpha = Math.round(_self.renderer.alpha)
    }

    // takes second fader in account
    if ( _self.crossfade ) {
      // _self.renderer.alpha2 = ...
    }

    // add a dot, visual feedback?
    // $('#_self.bpm_bulp').css({'opacity': _self.alpha } );
  }

  // reset to a certain value
  // note this will not bypass c_a
  // set num to -0.5PI and 0.5PI
  _self.reset = function( num ) {
    // reset
    if (num==0) num = - Math.PI / 2
    if (num==1) num = Math.PI / 2
    _self.c_a = num
    _self.bpm = 0
    _self.renderer.blendingMode = blendingModes.normal
  }

  // pretty useless and confusing helpers
  _self.left = function() {
    _self.bpm = 0
    _self.c_a = Math.PI * 0.5 //left 1 0
  }

  _self.center = function() {
    _self.bpm = 0
    _self.c_a = 0 //Math.PI * 1 //center 0.5 0.5
  }

  _self.right = function() {
    _self.bpm = 0
    _self.c_a = Math.PI * 1.5 //right 0 1
  }
}
