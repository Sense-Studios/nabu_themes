// -----------------------------------------------------------------------------
// SETTINGS
var _width  = window.innerWidth;  // unless < video_width ( 1280 ), // viewport
var _height = window.innerHeight; // unless < video_height ( 720 ), // viewport

var video_quality = "480p_h264" //"320p_h264_mobile"; // depricated
var video_width  = 1024;        // as texture
var video_height = 1024;        // as texture

// -----------------------------------------------------------------------------
// create the renderr
var renderer = new GlRenderer( _width, _height );

// -----------------------------------------------------------------------------
// add your sources
// var gifSource = new GifSource(  renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );


var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource5 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource6 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource7 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource8 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource9 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource10 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource11 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource12 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource13 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource14 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource15 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );

// there is a maximum of 16 sources


//  var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/5611abde6465762b80000000/720p_h264.mp4', uuid: 'testSource2' } );
//  var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/5611abde6465762b80000000/720p_h264.mp4', uuid: 'testSource3' } );
//  var videosource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/557c48876465763a3b000004/720p_h264.mp4' } );
//  var videosource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/5519f9a66465764a1f8b0000/720p_h264.mp4' } );
//  var videosource2 = new VideoSource(renderer, {} );

// -----------------------------------------------------------------------------
// add your modules
//var mixer1 = new Mixer( renderer, { source1: videosource3, source2: testSource2 } );
//var mixer2 = new Mixer( renderer, { source1: mixer1, source2: testSource1 } );

// examples
// var filemanager1 = new Filemanager( testSource1, { tags: ['awesome', 'manga']} )
// var filemanager2 = new Filemanager( testSource2, { tags: ['runner', 'clutter']} )
// var mixer1 = new Mixer(renderer, testSource1, testSource1 );
// var chain = new Chain( renderer, { "sources": [ testSource1, testSource2, videosource3 ], "alphas": [ 1.0, 1.0, 1.0 ] } );
// var feedback = new Feedback( renderer, source )
// var black_and_white  = BlackAndWhite( renderer, source )

var filemanager1 = new FileManager( testSource1 )
var filemanager2 = new FileManager( testSource2 )

var mixer1  = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );


var mixer2  = new Mixer( renderer, { source1: mixer1,  source2: testSource3 } );
var mixer3  = new Mixer( renderer, { source1: mixer2,  source2: testSource4 } );
var mixer4  = new Mixer( renderer, { source1: mixer3,  source2: testSource5 } );
var mixer5  = new Mixer( renderer, { source1: mixer4,  source2: testSource6 } );
var mixer6  = new Mixer( renderer, { source1: mixer5,  source2: testSource7 } );
var mixer7  = new Mixer( renderer, { source1: mixer6,  source2: testSource8 } );
//var mixer8  = new Mixer( renderer, { source1: mixer7,  source2: testSource9 } );
//var mixer9  = new Mixer( renderer, { source1: mixer8,  source2: testSource10 } );
//var mixer10 = new Mixer( renderer, { source1: mixer9,  source2: testSource11 } );
//var mixer11 = new Mixer( renderer, { source1: mixer10, source2: testSource12 } );
//var mixer12 = new Mixer( renderer, { source1: mixer11, source2: testSource13 } );
//var mixer13 = new Mixer( renderer, { source1: mixer12, source2: testSource14 } );
//var mixer14 = new Mixer( renderer, { source1: mixer13, source2: testSource15 } );

// -----------------------------------------------------------------------------
// set the output node (needs to be last!)
var output = new Output( renderer, mixer7 )

// -----------------------------------------------------------------------------
renderer.init();         // init
renderer.render();       // start update & animation


// -----------------------------------------------------------------------------
// Render controller

// this is a hokey pokey controller
function changez() {
  if (Math.random() > 0.5 ) {
    filemanager1.change()
  }else{
    filemanager2.change()
  }
  var r = Math.floor( Math.random() * 10000 )
  setTimeout( function() {
    changez()
  }, r )
};
changez()
