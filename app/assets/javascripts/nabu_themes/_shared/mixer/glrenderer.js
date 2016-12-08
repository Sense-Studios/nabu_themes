
/* set up global variables */

// viewport
var _width  = window.innerWidth;
var _height = window.innerHeight;

// quality and video need to match!
var video_quality = "720p_h264"
// src_width  = 1080
// src_height = 720
var video_width  = 1024  // as texture
var video_height = 1024  // as texture

// set up threejs scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, _width / _height, 0.1, 1000 );
var clock = new THREE.Clock();
var renderer;

// set up alphas
var alpha1 = 0.5
var alpha2 = 0.5
var alpha3 = 0.5

// set up fader
var bpm = 128
var fadeSpeed = 0.02

// set up texture holders
var videoTexture1
var videoTexture2
var videoTexture3

// set up buffers
var bufferImage1
var bufferImage2
var bufferImage3
var bufferImage4

// set up defines and uniforms
var customDefines
var customUniforms

// Renderer, constructor
var GLRenderer = function( _settings ) {

  // le variables
  var _self = this

  // public
  _self.src1 = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/720p_5000kbps_h264.mp4?r=840953931550"
  _self.src2 = "//nabu-dev.s3.amazonaws.com/uploads/video/558b39266465760a3700001b/720p_5000kbps_h264.mp4?r=101294694802"
  //_self.width = _width
  //_self.height = _height
  //_self.alpha = 1
  //_self.alpha1 = 1
  //_self.alpha2 = 1

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

  // overrides
  if (_settings != undefined) {
    $.each( _settings, function(k, v) {
      if (_self[k] != undefined ) _self[k] = v
    });
  }
  */

  // private
  /*
  var img1, img2, canvas, context;
  var changezTimeOut;
  var changez;
  var changed = false;
  var once = false;
  */

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

    // var bg_texture = THREE.TextureLoader().load('img/77a14d9991e181161dd5a46694608088.jpg')
    // bg_texture.wrapS = THREE.RepeatWrapping;
    // bg_texture.wrapT = THREE.RepeatWrapping;
    // bg_texture.repeat.set( 1, 1 );

    // var bg_material = new THREE.MeshBasicMaterial( { map: bg_texture, color: 0xffffff, side: THREE.DoubleSide } );
    // var bg_geometry = new THREE.PlaneGeometry( 64, 40, 1 );
    // var background = new THREE.Mesh( bg_geometry, bg_material );
    // background.geometry.translate( 0, 0, 0 );
    // scene.add( background );

    // get videos --------------------------------------------------------------

    // -------------------------------------------------------------------------

    var video1 = document.getElementById( 'video1' )
    video1.src = _self.src1 //"http://nabu-dev.s3.amazonaws.com/uploads/video/5567a5936465766d5f0b0000/480p_h264.mp4";

    video1.load(); // must call after setting/changing source
    video1.play();

    video1.volume = 0;
    video1.addEventListener('timeupdate', function() {
      firebase.database().ref('/client_1/video1').child('currentTime').set( video1.currentTime );
    })

    video1.height = video_width
    video1.width = video_height

    videoImage1 = document.createElement( 'canvas' );
    videoImage1.width = video_width;  // these need to match the video size!
    videoImage1.height = video_height; // these need to match the video size!

    videoImageContext1 = videoImage1.getContext( '2d' );

    // background color if no video present
    // videoImageContext.fillStyle = '#000000';
    // videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture1 = new THREE.Texture( videoImage1 );
    //videoTexture1.minFilter = THREE.LinearFilter;
    //videoTexture1.magFilter = THREE.LinearFilter;

    // background color if no video present
    // videoImageContext.fillStyle = '#000000';
    // videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    // Texture( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy )
    //THREE.UVMapping
    //videoTexture1 = new THREE.Texture( videoImage1 );
    //videoTexture1.minFilter = THREE.LinearFilter;
    //videoTexture1.magFilter = THREE.LinearFilter;\

    // texture needs to be a power of twoo for this
    // videoTexture1.wrapS = THREE.RepeatWrapping;
    // videoTexture1.wrapT = THREE.RepeatWrapping;
    // videoTexture1.repeat.set( 4, 4 );

    // videoTexture1.premultiplyAlpha = true

    // -------------------------------------------------------------------------

    var video2 = document.getElementById( 'video2' )
    video2.src = _self.src2 // "http://nabu-dev.s3.amazonaws.com/uploads/video/556b99326465764bdf000000/720p_5000kbps_h264.mp4"; //http://nabu-dev.s3.amazonaws.com/uploads/video/556b99a86465764bdf140000/480p_h264.mp4";
    video2.load(); // must call after setting/changing source
    video2.play();
    video2.height = video_width
    video2.width = video_height

    video2.volume = 0;
    video2.currentTime = 20;

    video2.addEventListener('timeupdate', function() {
      firebase.database().ref('/client_1/video2').child('currentTime').set( video2.currentTime );
    })

    videoImage2 = document.createElement( 'canvas' );
    videoImage2.width = video_width;  // these need to match the video size!
    videoImage2.height = video_height; // these need to match the video size!

    videoImageContext2 = videoImage2.getContext( '2d' );

    // background color if no video present
    // videoImageContext.fillStyle = '#000000';
    // videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture2 = new THREE.Texture( videoImage2 );
    videoTexture2.minFilter = THREE.LinearFilter;
    videoTexture2.magFilter = THREE.LinearFilter;

    // var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
    //   the geometry on which the movie will be displayed;
    //   movie image will be scaled to fit these dimensions.
    // var movieGeometry = new THREE.PlaneGeometry( 40, 40, 4, 4 );
    // var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    // movieScreen.position.set(0,0,0);
    // scene.add(movieScreen);

    // -------------------------------------------------------------------------
    /////////////////////////////////
    // again, but for water!

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
    customUniforms2 = {
      baseTexture1:	 { type: "t", value: videoTexture1 },
      baseTexture2:	 { type: "t", value: videoTexture2 },
      delayed_image: { type: "t", value: afterimage.texture },
      baseSpeed: 		 { type: "f", value: 0.15 },
      noiseTexture:  { type: "t", value: noiseTexture },
      noiseScale:		 { type: "f", value: 0.2 },
      alpha: 			   { type: "f", value: 1.0 },
      time: 			   { type: "f", value: 1.0 },
      counter:		   { type: "f", value: 0.0 },
      alpha1: 			 { type: "f", value: alpha1 },
      alpha2: 			 { type: "f", value: alpha2 },
      blendmode: 		 { type: "i", value: 1 },
      effect:        { type: "i", value: 1 }
    };

    // not used
    customDefines2 = {
      FOO: true
    }

    // create custom material from the shader code above
    // that is within specially labeled script tags

    var customMaterial2 = new THREE.ShaderMaterial({
       uniforms: customUniforms2,
       defines: customDefines2,
       vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
       fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

    // other material properties
    customMaterial2.side = THREE.DoubleSide;
    customMaterial2.transparent = true;

    // apply the material to a surface
    var flatGeometry = new THREE.PlaneGeometry( 67, 38 );
    flatGeometry.translate( 0, 0, 0 );
    var surface = new THREE.Mesh( flatGeometry, customMaterial2 );

    //surface.position.set(60,50,150);
    scene.add( surface );

    /*
    var shader_material = new THREE.ShaderMaterial( {
      uniforms: { foo: "bar" },
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

    // other material properties
    shader_material.side = THREE.DoubleSide;
    shader_material.transparent = true;

    var shader_plane = new THREE.PlaneGeometry( 5, 5, 1 );
    //var shader_material = new THREE.MeshBasicMaterial( {map: bg_texture, color: 0xffffff, side: THREE.DoubleSide} );
    var shader_mesh = new THREE.Mesh( shader_plane, shader_material );
    shader_mesh.position.z = 5
    scene.add( shader_mesh );
    */



// -----------------------------------------------------------------------------


    // first run
    //_self.update();

    // dunno what this does
    var once = false;
    video2.oncanplay=function() {
      if (!once) {
        once = true   ;
        setTimeout( function() {
          var gotoTime = Math.random() * video1.duration;
          video2.currentTime = gotoTime
          console.log("has time", gotoTime);
        }, 200 )
      };
    };// end oncanplay

  }

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
  	customUniforms2.time.value += delta;

    c += fadeSpeed;
    customUniforms2.alpha1.value = (Math.sin(c) + 1 ) / 2;
    customUniforms2.alpha2.value = (Math.cos(c + Math.PI / 2 ) + 1 ) / 2;
    customUniforms2.counter.value = Math.random();
  }

  camera.position.z = 24

  _self.render = function() {
  	requestAnimationFrame( _self.render );

  	renderer.render( scene, camera );
    if ( Math.random() < 0.5 ) renderer.render( scene, camera, afterimage, true );

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
    //document.getElementById('startbutton').remove();
    // document.getElementById('glcanvas').webkitRequestFullScreen();
    _self.init(); // init
    _self.render();       // start animation
  }

}; // end renderer;
