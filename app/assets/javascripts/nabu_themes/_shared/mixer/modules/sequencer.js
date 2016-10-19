var Sequencer = function( _sequence ) {

  // self
  var _self = this

  // mandatory
  _self.bypass = false
  _self.renderer

  // custom
  _self.sequence = []
  _self.speed = 800
  _self.target

  // private
  var sequence_timeout
  var c = 0

  _self.update = function() {
    if ( _self.bypass ) return
  }

  _self.set_sequence = function( _sequence ) {
    if ( _sequence != undefined ) sequence = _sequence

    console.log(sequence[f]);
    img2.currentTime = sequence[f];

    c++;
    if (c>=sequence.length) c = 0;

    clearTimeout(sequence_timeout)
    sequence_timeout = setTimeout( function() { sequencer() }, sequencer_speed )
  }

  _self.start_sequencer = function( _sequence ){
  }

  _self.stop_sequencer = function(){
    f = 0
    clearTimeout(sequence_timeout)
    setTimeout( function() { clearTimeout(sequence_timeout) }, 1200 )
  }
}
