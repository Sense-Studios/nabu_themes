

GifSource.prototype = new Source(); // assign prototype to marqer
GifSource.constructor = GifSource;  // re-assign constructor


function GifSource( options ) {
  var _self = this;

  if ( options.uuid == undefined ) {
    _self.uuid = "GifSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  _self.type = "Source"


  _self.init = function() {
  }

  _self.update = function() {

  }

  _self.render = function() {
    //return _self.
  }
};
