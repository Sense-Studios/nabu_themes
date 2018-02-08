function BPMControl( _options ) {
  // returns a floating point between 1 and 0, in sync with a bpm

  _self.uuid = "BPM_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.bpm = 128
  _self.bps = 2.133333
  _self.bpm_float = 0.46875 // 60 / 128
  _self.bypass = false

  // source.renderer ?
  var nodes = []

  _self.init = function() {
    window.addEventListener( 'keydown', keyHandler )
  }

  _self.update = function() {
    nodes.forEach( function( node ) {
      // this would render as mixer.pod( 0.0045 )
      // or source.alpha(0.444)
      node( _self.render )
    }

    // update the bpm with
    _self.bpm_float += Math.sin( 128 / 60 )
  }

  // ie. Bpmcontrol.add( mixer1.pod )
  // should allow for multiple elements
  // add( mixer1.pod, add( mixer4.pod ), add( sourc4.alpha )
  _self.add = function( _func ) {
    node.add( _func )
  }

  // ---------------------------------------------------------------------------
  // Helpers

  _self.tap = function() {

  }

  _self.render = function() {
    // returns current bpm value 0 - 1
    return _sel.bpm_float
  }

  // ---------------------------------------------------------------------------
  // Private

  keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance    //[ 219
    if _self.hasFocus

    //] 221
    switch ( event.which ) {
      case 219: // [
        // bpm down 1
        console.log("bpm down")
        _self.bpm -= 1
        break;

      case 221: // ]
        // bpm up 1
        console.log("bpm up")
        _self.bpm += 1
        break;

      case 191: // /
        // bpm down
        console.log(" / 2")
        _self.bpm *= 0.5
        break;

      case 111: // / numpad
        // bpm down
        console.log(" / 2")
        _self.bpm *= 0.5
        break;


      case 106: // * numpad
        // bpm up
        console.log(" x 2")
        _self.bpm *= 2
        break;

      case 66: // *
        // bpm tap
        console.log(" tap")
        _self.tap()
        break;

      default:
        console.log("nope, had: " + event.which)
        break;
    }
  }
}
