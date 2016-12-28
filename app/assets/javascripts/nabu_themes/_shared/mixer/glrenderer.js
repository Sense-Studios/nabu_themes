
/* set up global variables */

// viewport
var _width  = window.innerWidth;
var _height = window.innerHeight;

// quality and video need to match!
var video_quality = "720p_h264";
// src_width  = 1080
// src_height = 720
var video_width  = 1024;  // as texture
var video_height = 1024;  // as texture

// set up threejs scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, _width / _height, 0.1, 1000 );
var clock = new THREE.Clock();
var renderer;

// set up alphas
var alpha1 = 0.5;
var alpha2 = 0.5;
var alpha3 = 0.5;

// set up fader
var bpm = 128;
var fadeSpeed = 0.02;

// set up texture holders
var videoTexture1;
var videoTexture2;
var videoTexture3;

// set up buffers
var bufferImage1;
var bufferImage2;
var bufferImage3;
var bufferImage4;

// set up defines and uniforms
var customDefines;
var customUniforms;

// Renderer, constructor
var GLRenderer = function( _settings ) {

  // le variables
  var _self = this

  // public
  _self.src1 = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/720p_h264.mp4"
  _self.src2 = "//nabu-dev.s3.amazonaws.com/uploads/video/558b39266465760a3700001b/720p_h264.mp4" //720p_5000kbps_h264

  /*
  $('body').append("<div class='render_info'> info </div>")
  $('.render_info').css({
    'position': 'absolute',
    'right': '0px',
    'top': '0px',
    'height': '80px',
    'width': '320px',
    'z-index': '1000000000','right': '0',
    'font-size': '8px',
    'text-align': 'right',
    'color': 'rgba(250,250,250,0.5)'
  }).text('render info?');
  */

  // gonna need that counter
  var c = 0


  // new
  var modules = []

  // reset with _self.c_a = Math.PI * 1.5; _self.bpm = 0

  // find me in js/blendmodes
  //_self.blendingMode = blendingModes.add;
  //_self.blendingMode = blendingModes.linearBurn;

  _self.addModule = function(  _module ) {
    console.log( "adding",  _module )
    modules.push( _module )
    _module.renderer = _self
  }

  _self.init = function() {

    renderer = new THREE.WebGLRenderer( {canvas: glcanvas, alpha: false} );
    renderer.setSize( _width, _height );

    // -------------------------------------------------------------------------

    var video1 = document.getElementById( 'video1' )
    video1.src = _self.src1 //"http://nabu-dev.s3.amazonaws.com/uploads/video/5567a5936465766d5f0b0000/480p_h264.mp4";
    video1.load(); // must call after setting/changing source
    video1.play();
    video1.addEventListener('timeupdate', function() {firebase.database().ref('/client_1/video1').child('currentTime').set( video1.currentTime );})
    video1.height = video_width
    video1.width = video_height
    video1.volume = 0;
    //video2.currentTime = 20;
    videoImage1 = document.createElement( 'canvas' );
    videoImage1.width = video_width;  // these need to match the video size!
    videoImage1.height = video_height; // these need to match the video size!
    videoImageContext1 = videoImage1.getContext( '2d' );
    videoTexture1 = new THREE.Texture( videoImage1 );
    //videoTexture1.minFilter = THREE.LinearFilter;
    //videoTexture1.magFilter = THREE.LinearFilter;

    // -------------------------------------------------------------------------

    var video2 = document.getElementById( 'video2' )
    video2.src = _self.src2 // "http://nabu-dev.s3.amazonaws.com/uploads/video/556b99326465764bdf000000/720p_5000kbps_h264.mp4"; //http://nabu-dev.s3.amazonaws.com/uploads/video/556b99a86465764bdf140000/480p_h264.mp4";
    video2.load(); // must call after setting/changing source
    video2.play();
    video2.height = video_width
    video2.width = video_height
    video2.volume = 0;
    //video2.currentTime = 20;
    video2.addEventListener('timeupdate', function() { firebase.database().ref('/client_1/video2').child('currentTime').set( video2.currentTime ) })
    videoImage2 = document.createElement( 'canvas' );
    videoImage2.width = video_width;  // these need to match the video size!
    videoImage2.height = video_height; // these need to match the video size!
    videoImageContext2 = videoImage2.getContext( '2d' );
    videoTexture2 = new THREE.Texture( videoImage2 );
    //videoTexture2.minFilter = THREE.LinearFilter;
    //videoTexture2.magFilter = THREE.LinearFilter;

    // -------------------------------------------------------------------------

    var video3 = document.getElementById( 'video3' )
    video3.src = _self.src3 // "http://nabu-dev.s3.amazonaws.com/uploads/video/556b99326465764bdf000000/720p_5000kbps_h264.mp4"; //http://nabu-dev.s3.amazonaws.com/uploads/video/556b99a86465764bdf140000/480p_h264.mp4";
    video3.load(); // must call after setting/changing source
    video3.play();
    video3.height = video_width
    video3.width = video_height
    video3.volume = 0;
    //video3.currentTime = 20;
    video3.addEventListener('timeupdate', function() { firebase.database().ref('/client_1/video3').child('currentTime').set( video3.currentTime ) })
    videoImage3 = document.createElement( 'canvas' );
    videoImage3.width = video_width;  // these need to match the video size!
    videoImage3.height = video_height; // these need to match the video size!
    videoImageContext3 = videoImage3.getContext( '2d' );
    videoTexture3 = new THREE.Texture( videoImage3 );
    //videoTexture2.minFilter = THREE.LinearFilter;
    //videoTexture2.magFilter = THREE.LinearFilter;


    // -------------------------------------------------------------------------
    /////////////////////////////////
    // Add textures

    var noiseTexture = new THREE.TextureLoader().load( '/assets/nabu_themes/mixer/cloud.png' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    var waterTexture = new THREE.TextureLoader().load( '/assets/nabu_themes/mixer/water.jpg' );
    waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;

    // create buffer
    var renderTargetParams = {
      minFilter:THREE.LinearFilter,
      stencilBuffer:false,
      depthBuffer:false
    };

    // TODO, FIXME
    // TODO, add 4 canvasses, and assign a different renderer to them, use them
    // as image buffers. It appears one cannot feed the output back into the input
    // unless I'm mistaken.

    afterimage = new THREE.WebGLRenderTarget( 512, 512, renderTargetParams );
    //afterimage_tex = new THREE.Texture( afterimage.texture )
    //afterimage_tex.needsUpdate = true;

    /*
    1 ADD
    2 SUBSTRACT
    3 MULTIPLY
    4 DARKEN
    5 COLOUR BURN
    6 LINEAR_BURN
    7 LIGHTEN
    8 SCREEN
    9 COLOUR_DODGE
    10 LINEAR_DODGE
    11 OVERLAY
    12 SOFT_LIGHT
    13 HARD_LIGHT
    14 VIVID_LIGHT
    15 LINEAR_LIGHT
    16 PIN_LIGHT
    17 DIFFERENCE
    18 EXCLUSION
    */


    // use "this." to create global object
    customUniforms = {
      baseTexture1:	 { type: "t", value: videoTexture1 },
      baseTexture2:	 { type: "t", value: videoTexture2 },
      //baseTexture3:	 { type: "t", value: videoTexture3 },
      blendmode: 		 { type: "i", value: 1 },
      effect:        { type: "i", value: 1 },

      // TODO: insert canvaesses with bufferdata here
      // delayed_image: { type: "t", value: afterimage.texture },

      baseSpeed: 		 { type: "f", value: 0.15 },
      noiseTexture:  { type: "t", value: noiseTexture },
      noiseScale:		 { type: "f", value: 0.2 },
      time: 			   { type: "f", value: 1.0 },
      counter:		   { type: "f", value: 0.0 },
      alpha: 			   { type: "f", value: 1.0 },
      alpha1: 			 { type: "f", value: alpha1 },
      alpha2: 			 { type: "f", value: alpha2 }
    };

    // not used
    customDefines = {
      FOO: true
    }

    // create custom material from the shader code above
    // that is within specially labeled script tags

    var customMaterial = new THREE.ShaderMaterial({
       uniforms: customUniforms,
       defines: customDefines,
       vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
       fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

    // other material properties
    customMaterial.side = THREE.DoubleSide;
    customMaterial.transparent = true;

    // apply the material to a surface
    var flatGeometry = new THREE.PlaneGeometry( 67, 38 );
    flatGeometry.translate( 0, 0, 0 );
    var surface = new THREE.Mesh( flatGeometry, customMaterial );

    //surface.position.set(60,50,150);
    scene.add( surface );



// -----------------------------------------------------------------------------

    // first run
    //_self.update();

    // dunno what this does
    //var once = false;
    //video2.oncanplay=function() {
    //  if (!once) {
    //    once = true   ;
    //    setTimeout( function() {
    //      var gotoTime = Math.random() * video1.duration;
    //      video2.currentTime = gotoTime
    //      console.log("has time", gotoTime);
    //    }, 200 )
    //  };
    //};// end oncanplay

  }

  // Renderer shouldn't be doing this, phase this function out
  _self.updateSource = function( num, url ) {
    // think of the num as resolume layers or a channels
    console.log(">>> Set Source", num, url)
    if ( num == 1 ) {
      document.getElementById('video1').src = url;
      _self.src1 = url
    }

    if ( num == 2 ) {
      document.getElementById('video2').src = url;
      _self.src2 = url
    }
  }

  // MOVE! to the BEAT controller
  //var pixels1, pixels2, image1, image2, imageData1, imageData2
  //var r, g, b, oR, oG, oB, alpha1 = 1 - _self.alpha;
  var bar = "||||||||||||||||||||"
  var c = 0;

  _self.updateModules = function() {
    // update other functions
    $.each( modules, function(i, module) {
      module.update();
    });
  }

  _self.update = function(){

  	var delta = clock.getDelta();
  	customUniforms.time.value += delta;


  }

  camera.position.z = 24

  _self.render = function() {
  	requestAnimationFrame( _self.render );

  	renderer.render( scene, camera );

    // FIXME UPPDATE
    // add renderers for frame buffer canvasses here
    // adjust framerate for desired effect
    // if ( Math.random() < 0.5 ) renderer.render( scene, camera, afterimage, true );

    _self.update();
    _self.updateModules()

    renderer.setSize( window.innerWidth, window.innerHeight );

    if ( video1.readyState === video1.HAVE_ENOUGH_DATA ) {
  		videoImageContext1.drawImage( video1, 0, 0,video_width , video_height );
  		if ( videoTexture1 ) videoTexture1.needsUpdate = true;
  	}
    if ( video2.readyState === video1.HAVE_ENOUGH_DATA ) {
      videoImageContext2.drawImage( video2, 0, 0, video_width, video_height );
      if ( videoTexture2 ) videoTexture2.needsUpdate = true;
    }
  }

  _self.start = function() {
    // document.getElementById('startbutton').remove();
    // document.getElementById('glcanvas').webkitRequestFullScreen();
    _self.init();         // init
    _self.render();       // start update & animation
  }

}; // end renderer;
