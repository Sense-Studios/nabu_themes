var VideoSource = function( _options ) {

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
