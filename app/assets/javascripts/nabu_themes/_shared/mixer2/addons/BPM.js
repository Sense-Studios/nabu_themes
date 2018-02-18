function BPM( renderer ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "BPM_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.bpm = 60            // beats per minute
  _self.bps = 2.133333      // beats per second
  _self.sec = 0             // second counter, from which the actual float is calculated
  _self.bpm_float = 0.46875 // 60 / 128, current float of bpm
  _self.bypass = false

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init BPM contoller.")
  }

  // UPDATE
  var starttime = (new Date()).getTime()
  _self.update = function() {
    nodes.forEach( function( node ) {
      node( _self.render() );
    });

    c = ((new Date()).getTime() - starttime) / 1000
    _self.sec = c * Math.PI * _self.bpm / 60
    _self.bpm_float = ( Math.sin( _self.sec ) + 1) / 2 //Math.sin( 128 / 60 )
  }

  // ---------------------------------------------------------------------------
  // Helpers

  _self.add = function( _func ) {
    nodes.push( _func )
  }

  // Tapped beat control
  var last = Number(new Date());
  var beats = [ 64, 64 ,64 ,64 ,64 ]
  var time = 0
  var avg = 0

  _self.tap = function() {
    time  = Number(new Date()) - last
    last = Number(new Date());
    if ( time < 10000 && time > 10 ) {
      beats.splice(0,1)
      beats.push( 60000/time )
      avg = beats.reduce(function(a, b) { return a + b; }) / beats.length;
      _self.bpm = avg
      _self.bps = avg/60
    }
  }

  _self.render = function() {
    // returns current bpm 'position' as a value between 0 - 1
    return _self.bpm_float
  }

  // ---------------------------------------------------------------------------
}
