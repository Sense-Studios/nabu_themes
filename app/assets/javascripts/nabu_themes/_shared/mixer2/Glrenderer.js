var GlRenderer = function( w, h ) {

  var _self = this

  _self.glrenderer = new THREE.WebGLRenderer( { canvas: glcanvas, alpha: false } );
  _self.glrenderer.setSize( _width, _height );

  console.log("created renderer", w, h)

  // set up threejs scene
  _self.scene = new THREE.Scene();
  _self.camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
  _self.camera.position.z = 20

  _self.clock = new THREE.Clock();

  _self.nodes = [] // sources modules and effects

  _self.add = function( module ) {
    console.log('add module:', module )
    _self.nodes.push( module )
  }

  // defaults
  _self.customUniforms = {
    effect:        { type: "i", value: 1 },
    time: 			   { type: "f", value: 1.0 },
    wave: 			   { type: "f", value: 1.0 }
  }

  // not used
  _self.customDefines = {
    FOO: true
  }

  // base vertexShader
  _self.vertexShader = "\
\nvarying vec2 vUv;\
\nvoid main() {\
\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
\n  vUv = uv;\
\n}"

  // base fragment shader
  _self.fragmentShader = "\
\nuniform sampler2D textureTest;\
\nuniform float wave;\
\n/* custom_uniforms */\n\
\n/* custom_helpers */\n\
\nvarying vec2 vUv;\
\nvoid main() {\
\n  /* custom_main */\n\
\n}"

  _self.init = function(  ) {
    console.log("init renderer")

    // init nodes
    _self.nodes.forEach(function(n){ n.init() });

    _self.shaderMaterial = new THREE.ShaderMaterial({
       uniforms: _self.customUniforms,
       defines: _self.customDefines,
       vertexShader: _self.vertexShader,
       fragmentShader: _self.fragmentShader,
       side: THREE.DoubleSide,
       transparent: true
    })

    // apply the material to a surface
    var flatGeometry = new THREE.PlaneGeometry( 67, 38 );
    flatGeometry.translate( 0, 0, 0 );
    var surface = new THREE.Mesh( flatGeometry, _self.shaderMaterial );
    // surface.position.set(60,50,150);

    _self.scene.add( surface );
    _self.update();
  }

  _self.render = function() {
    // this is for the renderer
  	requestAnimationFrame( _self.render );
  	_self.glrenderer.render( _self.scene, _self.camera );
    _self.glrenderer.setSize( window.innerWidth, window.innerHeight );

    // this is for everything else
    _self.update();
  }

  _self.update = function(){
    // console.log("update")
  	var delta = _self.clock.getDelta();
  	_self.customUniforms.time.value += delta;
    var dinges = ( Math.sin( _self.customUniforms.time.value )/2 ) + 0.5
    // customUniforms.wave.value = Math.sin(delta / 100) * 900;
    // console.log(customUniforms.wave.value)
    _self.customUniforms.wave.value = dinges;
    //console.log(dinges)
    _self.nodes.forEach( function(n) { n.update() } );
  }
}
