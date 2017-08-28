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

    // left
    if (_self.mix == 5) {
      var left_alpha =  1
      var right_alpha = 0
    }

    // right
    if (_self.mix == 6) {
      var left_alpha =  0
      var right_alpha = 1
    }

    // center
    if (_self.mix == 7) {
      var left_alpha =  0.5
      var right_alpha = 0.5
    }

    // BOOM
    if (_self.mix == 8) {
      var left_alpha =  1
      var right_alpha = 1
    }

    // console.log( _self.bpm, _self.c_a, left_alpha, right_alpha )
    // rand
    customUniforms.alpha1.value = left_alpha
    customUniforms.alpha2.value = right_alpha
    // customUniforms.alpha3.value = right_alpha
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

  // set bpm through tapping
  _self.last = Number(new Date());
  _self.beats = [ 64, 64 ,64 ,64 ,64 ]
  _self.bpm = 64
  _self.tap = function( num ) {
    // add timed/ tapping function for bpm control
    //console.log(" >>> click ", Number(new Date()) - last );
    var time  = Number(new Date()) - _self.last
    _self.last = Number(new Date());

    if ( time < 10000 ) {
      _self.beats.splice(0,1)
      _self.beats.push( 60000/time )

      var avg = _self.beats.reduce(function(a, b) { return a + b; }) / _self.beats.length;
      _self.bpm = avg
      $('#button-beat').text( Math.round(avg) );
      console.log( time, avg, _self.beats )
    }
  }

  $( window ).on( 'keydown', function( event ) {
    console.log( event.type + ": " +  event.which )
    console.log( _self.bpm )
    //[ 219
    //] 221
    switch ( event.which ) {
      case 219: // [
        // bpm down
        console.log("bpm down")
        _self.bpm -= 1
        break;

      case 221: // ]
        // bpm donw
        console.log("bpm up")
        _self.bpm += 1
        break;

      case 191: // /
        // bpm donw
        console.log(" / 2")
        _self.bpm *= 0.5
        break;

      case 111: // / numpad
        // bpm donw
        console.log(" / 2")
        _self.bpm *= 0.5
        break;


      case 106: // * numpad
        // bpm donw
        console.log(" x 2")
        _self.bpm *= 2
        break;

      case 66: // *
        // bpm donw
          console.log(" tap")
        _self.tap()
        break;

      default:
        console.log("nope, had: " + event.which)
        break;
    }

    $('#button-beat').text( Math.round(_self.bpm) );
  });

  /*

  / 191
  \ 220
  * 106
  b 66


  */


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
