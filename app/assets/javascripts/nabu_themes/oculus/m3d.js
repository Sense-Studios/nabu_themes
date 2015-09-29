// --- content goes here  ---
// http://mrdoob.github.com/three.js/examples/canvas_materials_video.html
// http://mrdoob.github.com/three.js/examples/css3d_youtube.html

// TODO: connect oculus rift interface to this, fow extra awsome
// http://weareinstrument.com/labs/all/oculus-bridge
// http://stv.re/oculus-bridge/
// http://sxp.me/rift/rift.js // rift shader
// http://www.gamepadjs.com/ // extra awsome with gamepad

// i dunno
// http://codeflow.org/entries/2012/aug/25/webgl-deferred-irradiance-volumes/ (?)

// ###############
// ### GLOBALS ###
// ###############

var positions = [
  { 'id':'info_left1',  'width':'300px', 'height':'500px', x:-1260, y:0, z:256 },
  { 'id':'info_left2',  'width':'640px', 'height':'390px', x:-980, y:0, z:128 },
  { 'id':'info_right1', 'width':'800px', 'height':'800px', x:980,  y:0, z:128 },
  { 'id':'info_right2', 'width':'480px', 'height':'800px', x:1560,  y:0, z:456 },

  { 'id':'uptitle',     'width':'640px', 'height':'128px', x:0,   y:50,  z:512 },
  { 'id':'title',       'width':'640px', 'height':'128px', x:256, y:-128,  z:256 },

  { 'id':'extra1',      'width':'64px', 'height':'64px', x:-300, y:480, z:40 },
  { 'id':'extra2',      'width':'64px', 'height':'64px', x:-100, y:600, z:40 },
  { 'id':'extra3',      'width':'64px', 'height':'64px', x:100,  y:600, z:40 },
  { 'id':'extra4',      'width':'64px', 'height':'64px', x:300,  y:480, z:40 }

  //"aanbevolen":{ 'width':'300px', 'height':'500px', x:700, y:0, z:130 }
]

// ############
// ### INIT ###
// ############


$(function() {
  // start
  $("#pagetitle").html( playlist_data.playlist.title )
  buildMenu()
  getVideo()
})


// TEST HELPER, callback after video load
function videoLoaded() {

  // small test
  $('.interactionHider').click( function() {
    // reset others
    $('.interactionHider').show()

    // hide this one
    $(this).hide()

    // point to this one
    // retreive from container
    c_target = { x: 0, y:0, z:1024 };
    f_target = { x: 0, y:0, z:0 };
		goTo = true
    //setTimeout("$('.interactionHider').show()", 3000)
  })

  // init 3d enviroment
  init();

  // create world
  createParticles()
  createSmooviePlaces()

  // create controller
  addHTMLElementToScene( 'controller', { 'id':'controller',  'width':'640px', 'height':'48px',  x:0,  y:-190,  z:96 } );

  // create aanbevolen
  createAanbevolen()

  // finally
	animate();

	$('#buttons').click( function() {
	  c_target = { x: 0, y:0, z:1800 };
    f_target = { x: 0, y:0, z:0 };
    goTo = true
	})

}

// #######################
// ### BUILD FUNCTIONS ###
// #######################

function createSmooviePlaces() {
  for (var index in positions) {
    console.log('add:', index, positions[index].id)
    addHTMLElementToScene( positions[index].id, positions[index] );

    // this seems to be referencing
    $('#' + positions[index].id).data('position', { x:positions[index].x, y:positions[index].y, z:positions[index].z } );
    $('#' + positions[index].id ).click( function() {

      // go
      c_target.x = $(this).data('position').x
      c_target.y = $(this).data('position').y * 0.8
      c_target.z = $(this).data('position').z + 1400

      // look at
      f_target.x = $(this).data('position').x * 0.64;
      f_target.y = $(this).data('position').y;
      f_target.z = $(this).data('position').z;
		  goTo = true
    })
  }
}

function createAanbevolen () {
  $('#aanbevolen li').each(function() {
    var y_z_rand = Math.round(Math.random() * 500 ) + 112
    var randpos = { x: Math.round(Math.random() * 1200) - 600, y:-380, z: y_z_rand  }
    addHTMLElementToScene( $(this).attr('id'), randpos );
  })
}

function addHTMLElementToScene( element_id, position ) {

    // position requires
    // width, height, x, y, and z
    console.log('adding: ', element_id, position)
    $('#' + element_id ).css({
	    'overflow': 'hidden',
	    'display': 'block',
	    /*'background-color:': '#FFFFFF'*/
    })

    if (  element_id == "info_right1" || element_id == "info_right2" || element_id == "info_left2" ) {
      $('#' + element_id ).css({
        'width': position.width,
	      'height': position.height
      })
    }

		// test element in css
		var someelement = document.getElementById( element_id );
		var someobject = new THREE.CSS3DObject( someelement );

		someobject.position = position
		someobject.lookAt( { x: c_X, y: c_Y, z:c_Z } ) // look at camera
		css_scene.add( someobject ); // add to scene
		cssObjects.push( someobject ); // add to update list
}

function createCSSVideo( element, position ) {
  	// test element in css
		var element = document.getElementById( 'videoContainer' );
		$('#videoContainer' ).css({
        'width': '1280px',
	      'height': '720px'
    })
		var object = new THREE.CSS3DObject( element );
		object.position.x = 0
		object.position.y = 0
		object.position.z = -50
		//object.position.width = '1024px'
		//object.position.height = '1024px'
		css_scene.add( object );
		cssObjects.push( object )
}

// DISABLED, SLOW
function createCanvasVideo() {

	video = document.getElementById( 'videoContainer' );

	image = document.createElement( 'canvas' );
	image.width = 480;
	image.height = 204;

	imageContext = image.getContext( '2d' );
	imageContext.fillStyle = '#000000';
	imageContext.fillRect( 0, 0, 480, 204 );

	texture = new THREE.Texture( image );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

  imageReflection = document.createElement( 'canvas' );
	imageReflection.width = 480;
	imageReflection.height = 204;

	imageReflectionContext = imageReflection.getContext( '2d' );
	imageReflectionContext.fillStyle = '#000000';
	imageReflectionContext.fillRect( 0, 0, 480, 204 );

	imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, 204 );
	imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
	imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );

	textureReflection = new THREE.Texture( imageReflection );
	textureReflection.minFilter = THREE.LinearFilter;
	textureReflection.magFilter = THREE.LinearFilter;

	var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, side: THREE.BackSide, overdraw: true } );

	var plane = new THREE.PlaneGeometry( 480, 204, 4, 4 );
	mesh = new THREE.Mesh( plane, material );
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
	scene.add(mesh);

	mesh = new THREE.Mesh( plane, materialReflection );
	mesh.position.y = -306;
	mesh.rotation.x = - Math.PI;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
	scene.add( mesh );

  // test plane
  /*
	mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 200, 4, 4 ) );
	mesh.rotation.x = + 0.5;
	mesh.rotation.y = + 0.5;
	mesh.position.x = -300;
	mesh.position.y = 100;
	mesh.position.z = 80;

	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
	scene.add( mesh );
	*/
}

// create particles (bottom grid)
function createParticles() {
	var separation = 75;
	var amountx = 20;
	var amounty = 20;

	var PI2 = Math.PI * 2;
	var material = new THREE.ParticleCanvasMaterial( {

		color: 0x0808080,
		program: function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 1, 0, PI2, true );
			context.closePath();
			context.fill();

		}

	} );

	for ( var ix = 0; ix < amountx; ix++ ) {

		for ( var iy = 0; iy < amounty; iy++ ) {

			particle = new THREE.Particle( material );
			particle.position.x = ix * separation - ( ( amountx * separation ) / 2 );
			particle.position.y = -200
			particle.position.z = iy * separation - ( ( amounty * separation ) / 2 );
			scene.add( particle );

		}

  }
}

      // #######################
      // ### GLOBALS for 3D  ###
      // #######################

			var AMOUNT = 100;
			var container

			// canvas renderer (background etc.)
			var camera, scene, renderer;

			// css renderer (objects etc.)
      var css_camera, css_scene, css_renderer;

			var video, image, imageContext,
			imageReflection, imageReflectionContext, imageReflectionGradient,
			texture, textureReflection, smoovie;

			var mesh;
			var cssObjects = [];

			var mouseX = 0;
			var mouseY = 0;
			var oldMouseX = 0;
			var oldMouseY = 0;
			var mouseDeltaX = 0;
			var mouseDeltaY = 0;
			var mouseSpeed = 0;
			var mouseIsDown = false;

			var focal_point = { x:0, y:0, z:0 };
			var focalSpeedX = 0;
			var focalSpeedY = 0;
		  var f_delta = { x:0, y:0, z:0 };
			var f_target = { x:0, y:0, z:0 };
			var c_X = 0;
			var c_Y = 0;
			var c_Z = 1000;
			var c_delta = { x:0, y:0, z:0 };
			var c_target = { x:0, y:0, z:0 };

			var goTo = false

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			function init() {
        // create and set canvas camera
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = c_Z;

        // create and set canvas scene
				scene = new THREE.Scene();

        // create canvas renderer
				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'absolute';
				renderer.domElement.style.top = 0;
				$('#canvasContainer').append( renderer.domElement );

				// add css renderer and scene, because Awsome
				css_camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				css_camera.position.z = c_Z;

				// add css scene
				css_scene = new THREE.Scene()

				// add css renderr
				css_renderer = new THREE.CSS3DRenderer();
				css_renderer.setSize( window.innerWidth, window.innerHeight );
				css_renderer.domElement.style.position = 'absolute';
				css_renderer.domElement.style.top = 0;
				$('#cssContainer').append( css_renderer.domElement );

				//createCanvasVideo()
				createCSSVideo()

        // add listeners to the dom

				document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
				$('html').mousemove( function(e) { onDocumentMouseMove(e) } )
				$('html').mousedown( function(e) { onDocumentMouseDown(e) } )
				$('html').mouseup( function(e) { onDocumentMouseUp(e) } )

				window.addEventListener( 'resize', onWindowResize, false );

			}

      // ###################
      // ### INTERACTION ###
      // ###################

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				css_camera.aspect = window.innerWidth / window.innerHeight;
				css_camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				css_renderer.setSize( window.innerWidth, window.innerHeight );

			}

      function onDocumentMouseDown() {
       mouseIsDown = true
      }

      function onDocumentMouseUp() {
        mouseIsDown = false
      }

			function onDocumentMouseMove( event ) {
			  mouseX = ( event.clientX - windowHalfX ) * 3
        mouseY = ( event.clientY - windowHalfY ) * 2
			}

			function onDocumentMouseWheel( event ) {
			  mouseSpeed = -( event.wheelDelta / 8 )
			}

			function onKeyDown( key ) {
			  // awsd, up and down ?
			}

			function animate() {
				requestAnimationFrame( animate );
				render();
			}

			function render() {

			  if ( !goTo ) {

			    // Free movement
			    // key movement,
			    // only move position of move 'forward', towards current direction

  			  // move focal point with mouse
  			  mouseDeltaX = oldMouseX - mouseX
  			  mouseDeltaY = oldMouseY - mouseY
	  		  oldMouseX = mouseX
          oldMouseY = mouseY

          if ( mouseIsDown ) {
            focal_point.x -= ( mouseDeltaX * 0.6 )
            focal_point.y += ( mouseDeltaY * 0.6 )
          }

        }else{

          // ANIMATED MOVEMENT

          c_delta.x = c_target.x - camera.position.x
          c_delta.y = c_target.y - camera.position.y
          c_delta.z = c_target.z - camera.position.z

          f_delta.x = f_target.x - focal_point.x
          f_delta.y = f_target.y - focal_point.y
          f_delta.z = f_target.z - focal_point.z

          var c_ease = 0.08
          var f_ease = 0.1
          c_X += c_delta.x * c_ease
          c_Y += c_delta.y * c_ease
          c_Z += c_delta.z * c_ease

          // focal_point = { x:0, y:0, z:0 }
          focalSpeedX = 0
          focalSpeedY = 0
          mouseX = 0
          mouseY = 0
          mouseSpeed = 0

          focal_point.x += f_delta.x * f_ease
          focal_point.y += f_delta.y * f_ease
          focal_point.z += f_delta.z * f_ease

          if ( Math.abs(c_delta.x) < 1 && Math.abs(c_delta.y) < 1 && Math.abs(c_delta.z) < 1 && Math.abs(f_delta.x) < 1 && Math.abs(f_delta.y) < 1 && Math.abs(f_delta.z) < 1 ) {
            goTo = false
          }else{

          }
        }

        // camera z
        if (mouseSpeed != 0) mouseSpeed *= 0.92
  			if (mouseSpeed < 0.01 && mouseSpeed > -0.01 ) mouseSpeed = 0
        c_Z += mouseSpeed

        // update element rotation
        for ( var obj in cssObjects ) { cssObjects[obj].lookAt( { x: c_X, y: c_Y, z:c_Z } ); };

        // ### assign all the numbers to the renderers ###

        // canvas animation
				camera.position.x = c_X
				camera.position.y = c_Y
				camera.position.z = c_Z
				camera.lookAt( focal_point );
        renderer.render( scene, camera );

        // css animation
				css_camera.position.x = c_X
				css_camera.position.y = c_Y
				css_camera.position.z = c_Z
				css_camera.lookAt( focal_point );
        css_renderer.render( css_scene, camera );
			}
