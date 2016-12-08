var Renderer = function( _settings ) {

  // le variables
  var _self = this

  // public
  _self.blendingMode = blendingModes.normal
  _self.src1 = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/480p_h264.mp4?r=840953931550"
  _self.src2 = "//nabu-dev.s3.amazonaws.com/uploads/video/558b39266465760a3700001b/480p_h264.mp4?r=101294694802"
  _self.width = 640
  _self.height = 380
  _self.optimize = true // force 30fps
  _self.alpha = 1
  _self.alpha2 = 1


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
  });

  // overrides
  if (_settings != undefined) {
    $.each( _settings, function(k, v) {
      if (_self[k] != undefined ) _self[k] = v
    });
  }

  // private
  var img1, img2, canvas, context;
  var changezTimeOut;
  var changez;
  var changed = false;
  var once = false;
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
    // defaults
    var video1_src = _self.src1 //awesome[ Math.floor( Math.random() * awesome.length ) ].url;
    var video2_src = _self.src2 //runners[ Math.floor( Math.random() * runners.length ) ].url;

    img1 = document.getElementById('video1');
    img2 = document.getElementById('video2');

    img1.volume = 0;
    img2.volume = 0;
    img1.src = video1_src;
    img2.src = video2_src;

    //img1.w = img1.video_self.width, img1.video_self.height
    //img2.w = img2.video_self.width, img2.video_self.height
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.width = _self.width;
    canvas.height = _self.height;

    //$('title').text('IN THE HOUSSSEE')
    console.log("got initial w and h", _self.width, _self.height);

    // first run
    _self.update();

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
      img1.src = url;
      _self.src1 = url
    }

    if ( num == 2 ) {
      img2.src = url;
      _self.src2 = url
    }
  }

  var pixels1, pixels2, image1, image2, imageData1, imageData2
  var r, g, b, oR, oG, oB, alpha1 = 1 - _self.alpha;
  var bar = "||||||||||||||||||||"

  _self.update = function() {
      c++;
      if (c%2 !== 0 && _self.optimize) {
        window.requestAnimationFrame( _self.update );
        return;
      }

      // update other functions
      $.each( modules, function(i, module) {
        module.update();
      });

      // retreive the context
      context.drawImage(img2, 0, 0, _self.width, _self.height);
      image1 = context.getImageData(0, 0, _self.width, _self.height);
      imageData1 = image1.data;

      context.drawImage(img1, 0, 0, _self.width, _self.height);
      image2 = context.getImageData(0, 0, _self.width, _self.height);
      // var imageData2 = image2.data;

      // debug
      // if (c%60==0) console.log("---", c/30, "fps: ", c/(g/1000), g/1000, _self.c_a, _self.bpm, _self.alpha)

      pixels1 = image1.data; // @type Array
      pixels2 = image2.data; // @type Array

      //if (c%60==0) console.log("---", _self.alpha, alpha1)
      alpha1 = 1 - _self.alpha

      window.a1_mod = ((_self.alpha * 2))
      if (a1_mod > 1) a1_mod = 1
      window.a2_mod = ((alpha1 * 2))
      if (a2_mod > 1) a2_mod = 1
      //console.log( a1_mod, a2_mod )


      //$('.render_info').html()
      $('.render_info').html( bar.substr(0, Math.round(a1_mod * 20)) + "<br> " + bar.substr(0, Math.round(a2_mod * 20)) )


      // blend images
      for (var i = 0, il = pixels1.length; i < il; i += 4) {
        oR = pixels1[i]     //* _self.alpha2;
        oG = pixels1[i + 1] //* _self.alpha2;
        oB = pixels1[i + 2] //* _self.alpha2;

        // calculate blended color
        r = _self.blendingMode( pixels2[i]     * a1_mod, oR * a2_mod );
        g = _self.blendingMode( pixels2[i + 1] * a1_mod, oG * a2_mod );
        b = _self.blendingMode( pixels2[i + 2] * a1_mod, oB * a2_mod );

        // _self.alpha compositing

        // _/ \)
        pixels1[i] =     r  //* a1_mod + oR * a2_mod;
        pixels1[i + 1] = g  //* a1_mod + oG * a2_mod;
        pixels1[i + 2] = b  //* a1_mod + oB * a2_mod;
      }

      image1.data = imageData1;
      context.putImageData(image1, 0, 0);

      // AGAIN !!
      window.requestAnimationFrame( _self.update );

    } // update

}; // end renderer;
