
/* set up global variables */

// viewport
var _width  = window.innerWidth;  // unless < video_width ( 1280 )
var _height = window.innerHeight; // unless < video_height ( 720 )

// quality and video need to match!
var video_quality = "320p_h264_mobile";
var video_width  = 1024;  // as texture
var video_height = 1024;  // as texture

// set up threejs scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, _width / _height, 0.1, 1000 );
camera.position.z = 20

var clock = new THREE.Clock();
var renderer;

// MOVE TO SETTINGS?
// set up alphas
var alpha1 = 0.5;
var alpha2 = 0.5;
var alpha3 = 0.5;

// video placeholders
// var video1, video2, video3                               // use to connect
var videoTexture1, videoTexture2, videoTexture3;            // set up texture holders
var bufferImage1, bufferImage2, bufferImage3, bufferImage4; // set up buffers

// TODO: implement these as arrays
// This is new, but better
var videos =        [];   // video1, video2, video3, ...
var videoTextures = [];   // videoTexture1, videoTextures,  ...
var bufferImages =  [];   // bufferImage1, bufferImage2, ...

// MOVE TO SETTINGS?
// set up defines and uniforms of the shader
var customDefines;
var customUniforms;

// -----------------------------------------------------------------------------

// Renderer, constructor
var GLRenderer = function( _options ) {

  // note that these are private variables of the GLRenderer
  var _self = this;
  var glcanvas = document.getElementById('glcanvas'); // define canvas
  var c = 0 // gonna need that counter

  // public string, (default) sources
  _self.src1 = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/320p_h264_mobile.mp4";  // 720p_5000kbps_h264.mp4"
  _self.src2 = "//nabu-dev.s3.amazonaws.com/uploads/video/558b39266465760a3700001b/320p_h264_mobile.mp4";  // 720p_5000kbps_h264.mp4" //720p_5000kbps_h264
  _self.src3 = "//nabu-dev.s3.amazonaws.com/uploads/video/556b99326465764bdf000000/320p_h264_mobile.mp4"; //http://nabu-dev.s3.amazonaws.com/uploads/video/556b99a86465764bdf140000/480p_h264.mp4";

  // ---------------------------------------------------------------------------

  // modules are basically control elements like a file manager or a bpm manager
  // they run on top of the renderer and are called with an exposed update() function
  var modules = [];

  _self.addModule = function(  _module ) {
    console.log( "adding",  _module );
    modules.push( _module );
    _module.renderer = _self;
  }



  _self.updateModules = function() {
    // update other functions
    $.each( modules, function(i, module) {
      module.update();
    });
  }

  // ---------------------------------------------------------------------------

  _self.initVideoSources = function() {
    console.log( "add videosource" )

    var video1 = document.getElementById( 'video1' )
    video1.src = _self.src1 // "http://nabu-dev.s3.amazonaws.com/uploads/video/5567a5936465766d5f0b0000/480p_h264.mp4";
    video1.load();          // must call after setting/changing source
    video1.play();
    //video1.addEventListener('timeupdate', function() {firebase.database().ref('/client_1/video1').child('currentTime').set( video1.currentTime );})
    video1.height = video_width
    video1.width = video_height
    video1.volume = 0;
    //video2.currentTime = 20;
    videoImage1 = document.createElement( 'canvas' );
    videoImage1.width = video_width;   // these need to match the video size!
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
    //video2.addEventListener('timeupdate', function() { firebase.database().ref('/client_1/video2').child('currentTime').set( video2.currentTime ) })
    videoImage2 = document.createElement( 'canvas' );
    videoImage2.width = video_width;  // these need to match the video size!
    videoImage2.height = video_height; // these need to match the video size!
    videoImageContext2 = videoImage2.getContext( '2d' );
    videoTexture2 = new THREE.Texture( videoImage2 );
    //videoTexture2.minFilter = THREE.LinearFilter;
    //videoTexture2.magFilter = THREE.LinearFilter;

    // -------------------------------------------------------------------------

    //var video3 = document.getElementById( 'video3' )
    //video3.src = _self.src3 // "http://nabu-dev.s3.amazonaws.com/uploads/video/556b99326465764bdf000000/720p_5000kbps_h264.mp4"; //http://nabu-dev.s3.amazonaws.com/uploads/video/556b99a86465764bdf140000/480p_h264.mp4";
    //video3.load(); // must call after setting/changing source
    //video3.play();
    //video3.height = video_width
    //video3.width = video_height
    //video3.volume = 0;

    // test


    //image_source.src = "http://nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif"

    videoImage3 = document.createElement( 'canvas' );
    //videoImage3 = ;
    videoImage3.width = video_width;  // these need to match the video size!
    videoImage3.height = video_height; // these need to match the video size!
    videoImageContext3 = videoImage3.getContext( '2d' );
    videoTexture3 = new THREE.Texture( videoImage3 );

    //console.log(">>>> ", image3)
    //videoTexture3.minFilter = THREE.LinearFilter;
    //videoTexture3.magFilter = THREE.LinearFilter;


  }

  _self.updateVideoSources = function() {
    // TODO

    // updateVideoSources()
    // updateGifSources()
    // ...

    // everything hereunder should go

    // FIXME :: this video1 shouldnt be available, it just happens to work
    // because some other script exposes the same element on global scope
    if ( video1.readyState === video1.HAVE_ENOUGH_DATA ) {
      videoImageContext1.drawImage( video1, 0, 0,video_width , video_height );
      if ( videoTexture1 ) videoTexture1.needsUpdate = true;
    }

    if ( video2.readyState === video2.HAVE_ENOUGH_DATA ) {
      videoImageContext2.drawImage( video2, 0, 0, video_width, video_height );
      if ( videoTexture2 ) videoTexture2.needsUpdate = true;
    }

    // when we have a third video
    //if ( video3.readyState === video3.HAVE_ENOUGH_DATA ) {
    //  videoImageContext3.drawImage( video3, 0, 0, video_width, video_height );
    //  if ( videoTexture3 ) videoTexture3.needsUpdate = true;
    //}
  }

  _self.initGifSources = function() {
    window.image_source = new Image()
    //window.image3 = new Image()

    //video3.currentTime = 20;
    //video3.addEventListener('timeupdate', function() { firebase.database().ref('/client_1/video3').child('currentTime').set( video3.currentTime ) })

    // http://blog.aaronholmes.net/transparent-video-in-all-browsers-from-cross-domain-sources/
    // https://www.buzzfeed.com/yacomink/rubbable-gifs?utm_term=.hi0gBAJ5N#.nnYZl4rNz
    // https://www.reddit.com/r/webdev/comments/5rizmv/how_the_heck_does_giphy_write_from_animated_gif/
    // https://github.com/buzzfeed/libgif-js

    //image_source.onload = function() {
    //  window.gif = new GIF({
    //    workers: 2,
    //    quality: 10,
    //    workerScript: "/assets/nabu_themes/_shared/mixer/dist/gif.worker.js"
    //  });

      // http://jnordberg.github.io/gif.js/
    //  gif.on('finished', function(blob) {
    //    window.open(URL.createObjectURL(blob));
    //    image3.src=URL.createObjectURL(blob)
    //  });

    //  gif.addFrame( image_source );
    //  gif.render();
    //  }

    // %img{ id:"gif_image1", "rel:auto_play":"1"}
    $('#gif_containers').append("<div id='gif_image1' rel:auto_play='1'></div>");
    window.sup1 = new SuperGif( { gif: document.getElementById('gif_image1'), c_w: "512px", c_h: "512px" } );
    // sup1.load();
    console.log(" >>>> >>>> >>> LOAD")
    window.sup1.load_url("http://nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif")


  }

  // proxy em in, but don't tell anywon
  // changeGif("http://nabu.sense-studios.com/proxy.php?url=https://24.media.tumblr.com/tumblr_m8jk6nInJO1qzt4vjo1_r1_500.gif")
  // changeGif("http://nabu.sense-studios.com/proxy.php?url=https://68.media.tumblr.com/6e43d74b87931d1d72906b178a9d6b1c/tumblr_omxvs83RKC1ur4i40o1_500.gif")
  // changeGif("http://nabu.sense-studios.com/proxy.php?url=https://static.tumblr.com/926570a0a401c5f72c377f1db5075bb0/m1nmjag/57lnhkcbp/tumblr_static_tumblr_static_ehou20hoazkkgsgkokg0skgw4_640.gif")
  // changeGif("https://static.tumblr.com/926570a0a401c5f72c377f1db5075bb0/m1nmjag/57lnhkcbp/tumblr_static_tumblr_static_ehou20hoazkkgsgkokg0skgw4_640.gif")

  // or local
  // changeGif("http://nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif")
  // changeGif("http://nabu.sense-studios.com/assets/nabu_themes/sense/anime.gif")

  window.changeGif = function( _url ) {
    $('#gif_containers').html("")
    $('#gif_containers').append("<div id='gif_image1' rel:auto_play='1'></div>");
    window.sup1 = new SuperGif( { gif: document.getElementById('gif_image1'), c_w: "512px", c_h: "512px" } );
    // sup1.load();
    console.log(" >>>> >>>> >>> LOAD")
    window.sup1.load_url( _url )
  }


  _self.updateGifSources = function() {
    videoImageContext3.drawImage( $('.jsgif canvas')[0], 0, 0, video_width, video_height );
    if ( videoTexture3 ) videoTexture3.needsUpdate = true;

    //try {
    //  videoImageContext3.drawImage( image3, 0, 0, video_width, video_height );
    //  if ( videoTexture3 ) videoTexture3.needsUpdate = true;
    //}catch(e){
      //console.log("no!", e)
    //}
  }

  // ---------------------------------------------------------------------------

  _self.init = function() {

    renderer = new THREE.WebGLRenderer( { canvas: glcanvas, alpha: false } );
    renderer.setSize( _width, _height );

    // createVideoSource( 'video1', _self.src1, 'video1' )
    var videosSources = []
    function createVideoSource( _video_element_id, _scr, target,  ) {

    }

    // -------------------------------------------------------------------------

    _self.initVideoSources()
    _self.initGifSources()

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

    // this is not yet implemented ... :-/
    afterimage = new THREE.WebGLRenderTarget( 512, 512, renderTargetParams );
    //afterimage_tex = new THREE.Texture( afterimage.texture )
    //afterimage_tex.needsUpdate = true;


    // use "this." to create global object
    customUniforms = {
      baseTexture1:	 { type: "t", value: videoTexture1 },
      baseTexture2:	 { type: "t", value: videoTexture2 },
      baseTexture3:	 { type: "t", value: videoTexture3 },
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
      alpha2: 			 { type: "f", value: alpha2 },
      alpha3: 			 { type: "f", value: alpha3 }
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
    _self.update()
  }

  // ##########################################################  END INIT ######

  // Renderer shouldn't be doing this, phase this function out
  _self.updateSource = function( num, url ) {
    // think of the num as resolume layers or a channels

    if ( num == 0 ) {
      console.log("WARNING: channel ZERO does not exist");
    }

    if ( num == 1 && document.getElementById('video1').src != url  ) {
      document.getElementById('video1').src = url;
      _self.src1 = url
      console.log(" >>> Update Source", num, url );
    }

    if ( num == 2 && document.getElementById('video2').src != url  ) {
      document.getElementById('video2').src = url;
      _self.src2 = url
      console.log(" >>> Update Source", num, url );
    }

    if ( num == 3 && document.getElementById('video3').src != url  ) {
      document.getElementById('video3').src = url;
      _self.src1 = url
      console.log(" >>> Update Source", num, url );
    }
  }

  _self.update = function(){
  	var delta = clock.getDelta();
  	customUniforms.time.value += delta;
  }

  _self.render = function() {

  	requestAnimationFrame( _self.render );
  	renderer.render( scene, camera );

    _self.update();
    _self.updateModules()

    renderer.setSize( window.innerWidth, window.innerHeight );

    _self.updateVideoSources()
    _self.updateGifSources()
  }

  _self.start = function() {
    _self.init();         // init
    _self.render();       // start update & animation
  }

}; // end renderer;
