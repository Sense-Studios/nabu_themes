var BPM = function() {

  var _self = this

  // public, mandatory
  _self.renderer
  _self.bypass = false
  _self.mix = 1

  // public, custom
  _self.c_a = 0.1 //-( Math.PI / 2) // counted alpha, a measure for bpm and secods
  _self.bpm = 0               // bpm in, well beats per minutes ;)
  _self.stacato = false       // hard switching

  // private
  var n = (new Date()).getTime()

  // add to global update
  _self.update = function() {
    //_self.c_a += ( _self.bpm / 60 ) / ( 2 * Math.PI)


    // now a case might be made to hook this up to the crossfader,
    // not directly to the renderer.
    _self.renderer.alpha = 1 //( Math.sin( _self.c_a ) + 1 ) / 2;

    //var insec = Math.sin( __C  * Math.PI * $("#bpm_display .bpm").text() / 60)

    // MOVE! THIS TO THE BPM
    if ( _self.bypass || _self.bpm == 0) {
      //_self.c_a = Math.PI
    } else {
      _self.c_a = ((new Date()).getTime() - n) / 1000
    }

    var insec = _self.c_a * Math.PI * _self.bpm / 60

    var left_alpha =  ( Math.sin( insec ) + 1 ) / 2
    var right_alpha = ( Math.sin( Math.PI + insec  ) + 1 ) / 2

    // normal mix
    if (_self.mix == 1) {
      var left_alpha =  ( Math.sin( insec ) + 1 ) / 2
      var right_alpha = ( Math.sin( Math.PI + insec  ) + 1 ) / 2
    }

    // hard mix
    if (_self.mix == 2) {
      var left_alpha =  ( ( Math.sin( insec ) + 1 ) / 2 ) > 0.5 ? 1 : 0
      var right_alpha = ( ( Math.sin( Math.PI + insec ) + 1 ) / 2 ) > 0.5 ? 1 : 0
    }

    // nam
    if (_self.mix == 3) {
      //customUniforms.alpha1.value = Math.abs( Math.sin( b.c_a ) )
      //customUniforms.alpha2.value = Math.abs( Math.cos( b.c_a ) )
      var left_alpha =  Math.abs( Math.sin( insec / 2 ) )
      var right_alpha = Math.abs( Math.cos( insec / 2 ) )
    }

    // fam
    if (_self.mix == 4) {
      var left_alpha =  1 - Math.abs( Math.sin( insec / 2 ) )
      var right_alpha = 1 - Math.abs( Math.cos( insec / 2 ) )
    }

    // console.log( _self.bpm, _self.c_a, left_alpha, right_alpha )
    // rand
    customUniforms.alpha1.value = left_alpha
    customUniforms.alpha2.value = right_alpha
    customUniforms.counter.value = Math.random();


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

  _self.tap = function( num ) {
    // add timed/ tapping function for bpm control
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
    _self.bpm = 1
    _self.c_a = Math.PI * 0.5 //left 1 0
    setTimeout(function(){_self.bpm = 0}, 200 )
  }

  _self.center = function() {
    _self.bpm = 1
    _self.c_a = 3.14 //Math.PI * 1 //center 0.5 0.5
    setTimeout(function(){_self.bpm = 0}, 200 )
  }

  _self.right = function() {
    _self.bpm = 1
    _self.c_a = Math.PI * 1.5 //right 0 1
    setTimeout(function(){_self.bpm = 0}, 200 )
  }
}
