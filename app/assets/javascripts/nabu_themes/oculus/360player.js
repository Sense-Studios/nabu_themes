var renderer, camera;
var scene, element;
var ambient, point;
var aspectRatio, windowHalf;
var mouse, time;

var controls;
var css_controls
var cssObjects = [];
var clock;

var useRift = false;

var riftCam;

var boxes = [];
var core = [];
var dataPackets = [];

var ground, groundGeometry, groundMaterial;

var bodyAngle;
var bodyAxis;
var bodyPosition;
var viewAngle;

var velocity;
var oculusBridge;

// Map for key states
var keys = [];
for(var i = 0; i < 130; i++){
  keys.push(false);
}


function initScene() {

  console.log("init scene")

  clock = new THREE.Clock();
  mouse = new THREE.Vector2(0, 0);

  windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
  aspectRatio = window.innerWidth / window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 10000);
  // camera.useQuaternion = true;

  camera.position.set(90,-10,-25);
  //camera.lookAt(scene.position);

	// canvas materials in webgl
  // https://gist.github.com/ekeneijeoma/1186920

  // Initialize the renderer
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0xdbf7ff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //scene.fog = new THREE.Fog(0x8ba7af, 500, 800);
  //scene.fog = new THREE.Fog(0x000000, 800, 1400);


  element = document.getElementById('viewport');
  element.appendChild( renderer.domElement );

  controls = new THREE.OrbitControls(camera);

  console.log("init css")
  // add css scene
  css_scene = new THREE.Scene()

  // add css renderer and scene, because Awsome
  css_camera = new THREE.PerspectiveCamera( 60, aspectRatio, 1, 10000 );
  css_camera.position.set(90,-10,-25);

  // add css renderr
  css_renderer = new THREE.CSS3DRenderer();
  css_renderer.setSize( window.innerWidth, window.innerHeight );
  css_element = document.getElementById('cssContainer');
  css_element.appendChild( css_renderer.domElement );
  css_controls = new THREE.OrbitControls(css_camera);

  // RENDER OBJECTS
  $.each( Objects3d, function( i, obj ) {
    console.log("render", i, obj)
    if (program_id == obj.program_id) {
      var some_element = document.getElementById( obj.label );
      var css_object = new THREE.CSS3DObject( some_element );
      css_object.position.x = obj.position_x
      css_object.position.y = obj.position_y
      css_object.position.z = obj.position_z
      css_object.rotation.x = obj.rotation_x
      css_object.rotation.y = obj.rotation_y
      css_object.rotation.z = obj.rotation_z
      css_object.doLookAt = obj.doLookAt

      css_scene.add( css_object );
      cssObjects.push( css_object );

      obj.post_render( cssObjects[cssObjects.length-1] )
    }
  });
}

var css_object
// #########################################

var _texture, _material
var  o_x, o_y, _vw, _vh

// ############# FOR WEBCAMERA's #####################
/*
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {audio: false, video: true};
var video = document.querySelector("video");

function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
  video.play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
*/

// #################### end camear #####################

function createCanvasVideo( w, h, x, y, z, stream ) {

  var _x = 0
  var _y = 0
  var _z = 0

	o_x = 0 // VIDEO offset
	o_y = 0
  //_vh = 240
	//_vw = 480 // VIDEO width/height
  //_src = program.program_items[0].asset.versions[0].url

  _vh = 640
	_vw = 1280 // VIDEO width/height
  _src = program.program_items[0].asset.original_url

	video = document.getElementById( 'le_video' );
	video.loop = true
  video.width = _vw;
  video.height = _vh;

  $('#viewport').hide();

	//video.addEventListener('ended',myHandler,false);
	video.addEventListener('progress',myHandler,false);
	video.addEventListener('loadstart',myHandler,false);
	video.addEventListener('loadeddata',myHandler,false);
	video.addEventListener('canplay',myHandler,false);
  video.addEventListener('play', function() {
    $('#viewport').show();
    $('#le_video').hide();
  } );

  // video.addEventListener('played', function() {} );
	// video.addEventListener('timeupdate',myHandler,false);

  function myHandler(e) {
      if(!e) { e = window.event; }
      // What you want to do after the event
      //console.log("load handler fired...", e)
  }

  video.crossOrigin = "anonymous";
  video.controls = true;

  //var prg_srd = program.program_items[0].asset.versions[1]
  //var prg_srd = program.program_items[0].asset.original
  video.src = _src

  // Play
	video.load(); // must call after setting/changing source
	//video.play();

	videoImage = document.createElement( 'canvas' );
	//3140x1000

	videoImage.width = _vw //* 3; // CANVAS width height
	videoImage.height = _vh //* 3 ;

	//document.getElementById('tester').appendChild( video )
	//document.getElementById('tester').appendChild( videoImage )

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#FF0000';
	//videoImageContext.scale(1, 1)
	//videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
	videoImageContext.translate( 0, 0, 0) // offsets
  // context.setTransform(1, 0, 0, 1, 0, 0);


	_texture = new THREE.Texture( videoImage );
	//_texture.scale.x
	//_texture.repeat.y = 0.1
	_texture.wrapS = _texture.wrapT = THREE.RepeatWrapping;
	//_texture.repeat.set( 2, 1 );

	_texture.needsUpdate = true;

	//_material = new THREE.MeshBasicMaterial({map : _texture});

	_material =  new THREE.MeshPhongMaterial({map : _texture});

	var plane = new THREE.SphereGeometry( _vw, 60, 60 );
	//var plane = new THREE.PlaneGeometry( _vw, _vh, 0, 0 );
	plane.applyMatrix(new THREE.Matrix4().makeScale( -1, 1, 1 ) ); // invertnormals

	mesh = new THREE.Mesh( plane, _material );
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
	mesh.position.z = 0
	mesh.position.y = _vh/2
	scene.add(mesh);

  /*
	mesh = new THREE.Mesh( plane, materialReflection );
	mesh.position.y = -306;
	mesh.rotation.x = - Math.PI;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
	scene.add( mesh );
	*/

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

function updateVideo() {
  videoImageContext.drawImage( video, o_x, o_y );
  _texture.needsUpdate = true
}

// #############################################

function initLights(){

  ambient = new THREE.AmbientLight(0xFFFFFF);
  scene.add(ambient);

  //point = new THREE.DirectionalLight( 0xffe4e4, 1, 0, Math.PI, 1 );
  //point.position.set( -250, 250, 150 );
  //scene.add(point);
}

var floorTexture;
function initGeometry(){

  floorTexture = new THREE.ImageUtils.loadTexture( "/assets/nabu_themes/oculus/textures/tile.jpg" );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 50, 50 );
  floorTexture.anisotropy = 32;

  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, transparent:true, opacity:0.80 } );
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;

  //scene.add(floor);

  return

  // add some boxes.
  var boxTexture = new THREE.ImageUtils.loadTexture( "/assets/nabu_themes/oculus/textures/blue_blue.jpg" );
  for(var i = 0; i < 200; i++){
    var material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: boxTexture, color: 0xffffff});

    var height = Math.random() * 150+10;
    var width = Math.random() * 20 + 2;

    var box = new THREE.Mesh( new THREE.CubeGeometry(width, height, width), material);

    box.position.set(Math.random() * 1000 - 500, height/2 ,Math.random() * 1000 - 500);
    box.rotation.set(0, Math.random() * Math.PI * 2, 0);

    boxes.push(box);
    scene.add(box);
  }

  var coreTexture = new THREE.ImageUtils.loadTexture( "/assets/nabu_themes/oculus/textures/purple_blue.jpg" );
  for(var i = 0; i < 50; i++){
    var material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: coreTexture, color: 0xffffff});

    var height = Math.random() * 100+30;

    var box = new THREE.Mesh( new THREE.CubeGeometry(height, height, height), material);

    box.position.set(Math.random() * 1000 - 500, Math.random() * 150 - 300 ,Math.random() * 1000 - 500);
    box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

    core.push(box);
    scene.add(box);
  }

  for(var i = 0; i < 100; i++){
    var material = new THREE.MeshLambertMaterial({ emissive:0x008000, color: 0x00FF00});

    var size = Math.random() * 15+3;

    var box = new THREE.Mesh( new THREE.CubeGeometry(size, size*0.1, size*0.1), material);

    box.position.set(Math.random() * 1000 - 500, Math.random() * 100 + 100 ,Math.random() * 1000 - 500);
    //box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

    var speedVector;
    if(Math.random() > 0.5){
      speedVector = new THREE.Vector3(0, 0, Math.random() * 1.5 + 0.5);
      box.rotation.y = Math.PI / 2;
    } else {
      speedVector = new THREE.Vector3(Math.random() * 1.5 + 0.5, 0, 0);
    }

    dataPackets.push({
      obj: box,
      speed: speedVector
    });
    scene.add(box);
  }
}


function init(){

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('touchstart', onMouseDown, false);
  document.addEventListener('touchmove', onMouseMove, false);

  document.getElementById("toggle-render").addEventListener("click", function(){
    useRift = !useRift;
    onResize();
  });

  document.getElementById("help").addEventListener("click", function(){
    var el = document.getElementById("help-text");
    el.style.display = (el.style.display == "none") ? "" : "none";
  });

  window.addEventListener('resize', onResize, false);

  time          = Date.now();
  bodyAngle     = 0;
  bodyAxis      = new THREE.Vector3(0, 1, 0);
  bodyPosition  = new THREE.Vector3(0, 15, 0);
  velocity      = new THREE.Vector3();

  initScene();
  initGeometry();
  createCanvasVideo()
  initLights();

  // ***************************************************************************
  // SETTING UP OCULUS BRIDGE
  // ***************************************************************************

  /*
  oculusBridge = new OculusBridge({
    "debug" : true,
    "onOrientationUpdate" : bridgeOrientationUpdated,
    "onConfigUpdate"      : bridgeConfigUpdated,
    "onConnect"           : bridgeConnected,
    "onDisconnect"        : bridgeDisconnected
  });
  oculusBridge.connect();
  */

  riftCam = new THREE.OculusRiftEffect(renderer);
}


function onResize() {
  if(!useRift){
    windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    aspectRatio = window.innerWidth / window.innerHeight;

    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    css_camera.aspect = aspectRatio;
    css_camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    css_renderer.setSize(window.innerWidth, window.innerHeight);

  } else {
    riftCam.setSize(window.innerWidth, window.innerHeight);
  }
}


function bridgeConnected(){
  document.getElementById("logo").className = "";
}

function bridgeDisconnected(){
  document.getElementById("logo").className = "offline";
}

function bridgeConfigUpdated(config){
  console.log("Oculus config updated.");
  riftCam.setHMD(config);
}

function bridgeOrientationUpdated(quatValues) {

  // Do first-person style controls (like the Tuscany demo) using the rift and keyboard.

  // TODO: Don't instantiate new objects in here, these should be re-used to avoid garbage collection.

  // make a quaternion for the the body angle rotated about the Y axis.
  var quat = new THREE.Quaternion();
  quat.setFromAxisAngle(bodyAxis, bodyAngle);

  // make a quaternion for the current orientation of the Rift
  var quatCam = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

  // multiply the body rotation by the Rift rotation.
  quat.multiply(quatCam);


  // Make a vector pointing along the Z axis and rotate it accoring to the combined look/body angle.
  var xzVector = new THREE.Vector3(0, 0, 1);
  xzVector.applyQuaternion(quat);

  // Compute the X/Z angle based on the combined look/body angle.  This will be used for FPS style movement controls
  // so you can steer with a combination of the keyboard and by moving your head.
  viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

  // Apply the combined look/body angle to the camera.
  camera.quaternion.copy(quat);
}


function onMouseMove(event) {
  mouse.set( (event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
}


function onMouseDown(event) {
  // Stub
  floorTexture.needsUpdate = true;
}


function onKeyDown(event) {

  if(event.keyCode == 48){ // zero key.
    useRift = !useRift;
    onResize();
  }

  // prevent repeat keystrokes.
  if(!keys[32] && (event.keyCode == 32)){ // Spacebar to jump
    velocity.y += 1.9;
  }

  keys[event.keyCode] = true;
}


function onKeyUp(event) {
  console.log("key", keys[event.keyCode])
  keys[event.keyCode] = false;
}


function updateInput(delta) {

  var step        = 25 * delta;
  var turn_speed  = (55 * delta) * Math.PI / 180;


  // Forward/backward

  if(keys[87] || keys[38]){ // W or UP
      bodyPosition.x += Math.cos(viewAngle) * step;
      bodyPosition.z += Math.sin(viewAngle) * step;
  }

  if(keys[83] || keys[40]){ // S or DOWN
      bodyPosition.x -= Math.cos(viewAngle) * step;
      bodyPosition.z -= Math.sin(viewAngle) * step;
  }

  // Turn

  if(keys[81]){ // E
      bodyAngle += turn_speed;
  }

  if(keys[69]){ // Q
       bodyAngle -= turn_speed;
  }

  // Straif

  if(keys[65] || keys[37]){ // A or LEFT
      bodyPosition.x -= Math.cos(viewAngle + Math.PI/2) * step;
      bodyPosition.z -= Math.sin(viewAngle + Math.PI/2) * step;
  }

  if(keys[68] || keys[39]){ // D or RIGHT
      bodyPosition.x += Math.cos(viewAngle+Math.PI/2) * step;
      bodyPosition.z += Math.sin(viewAngle+Math.PI/2) * step;
  }


  // VERY simple gravity/ground plane physics for jumping.

  velocity.y -= 0.15;

  bodyPosition.y += velocity.y;

  if(bodyPosition.y < 15){
    velocity.y *= -0.12;
    bodyPosition.y = 15;
  }

  // update the camera position when rendering to the oculus rift.
  if(useRift) {
    camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
  }
}


function animate() {

  var delta = clock.getDelta();
  time += delta;

  updateInput(delta);
  for(var i = 0; i < core.length; i++){
    core[i].rotation.x += delta * 0.25;
    core[i].rotation.y -= delta * 0.33;
    core[i].rotation.z += delta * 0.1278;
  }

  var bounds = 600;
  for(var i = 0; i < dataPackets.length; i++){
    dataPackets[i].obj.position.add( dataPackets[i].speed);
    if(dataPackets[i].obj.position.x < -bounds) {
      dataPackets[i].obj.position.x = bounds;
    } else if(dataPackets[i].obj.position.x > bounds){
      dataPackets[i].obj.position.x = -bounds;
    }
    if(dataPackets[i].obj.position.z < -bounds) {
      dataPackets[i].obj.position.z = bounds;
    } else if(dataPackets[i].obj.position.z > bounds){
      dataPackets[i].obj.position.z = -bounds;
    }
  }

  if(render()){
    requestAnimationFrame(animate);
  }
}

function crashSecurity(e){
  oculusBridge.disconnect();
  document.getElementById("viewport").style.display = "none";
  document.getElementById("security_error").style.display = "block";
}

function crashOther(e){
  oculusBridge.disconnect();
  document.getElementById("viewport").style.display = "none";
  document.getElementById("generic_error").style.display = "block";
  document.getElementById("exception_message").innerHTML = e.message;
}

function render() {
  // update ...
  updateVideo()

  try{
    if(useRift){
      riftCam.render(scene, camera);
      $('#cssContainer').hide()
    }else{
      $('#cssContainer').show()

      controls.update();
      css_controls.update();

      renderer.render(scene, camera);
      css_renderer.render(css_scene, camera);

      for ( var obj in cssObjects ) {
        if (cssObjects[obj].doLookAt) cssObjects[obj].lookAt( camera.position );
      };
    }
  } catch(e){
    console.log(e);
    if(e.name == "SecurityError"){
      crashSecurity(e);
    } else {
      crashOther(e);
    }
    return false;
  }
  return true;
}


window.onload = function() {
  init();
  animate();
}
