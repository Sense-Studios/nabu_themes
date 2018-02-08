
var GIFSource = function( _options ) {

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
