changez = function( num ) {

  if (num != undefined ) {
    var newmovie = awesome[ num ]
    img2.src = newmovie.url
    changed = true
    once = false
    console.log("img2: ",  newmovie.name, newmovie.url )
    set_footer( newmovie.name )
    return;
  }

  var r = Math.random()
  console.log(" ######### changez!", r )

  changed = false
  if ( r < 0.2 ) {
    var newmovie = runners[ Math.floor( Math.random() * runners.length ) ]
    img1.src = newmovie.url
    changed = true
    console.log("img1: ",  newmovie.name, newmovie.url )
    set_footer( newmovie.name )
  }

  if ( r > 0.8 ) {
    var newmovie = awesome[ Math.floor( Math.random() * awesome.length ) ]
    img2.src = newmovie.url
    once = false
    changed = true
    console.log("img2: ",  newmovie.name, newmovie.url )
    set_footer( newmovie.name )
  }

  if (!changed) {
    try {
      if ( r <= 0.5 ) img1.currentTime = Math.round( Math.random() * img1.duration )
      if ( r >= 0.5 ) img2.currentTime = Math.round( Math.random() * img2.duration )
      //$('h1').html( "<small>time!</small>" )
      //$('h1').fadeIn(10).fadeOut( dur )
    }catch(e){}
  }

  var r = Math.random()
  if ( r < 0.3 ) {
    var t = []
    $.each(blendingModes, function(k,b){t.push(k)});
    var newMode = blendingModes[ t[ Math.floor( Math.random() * t.length  ) ] ]
    blendingMode = newMode
    console.log("new: ", newMode)
    //set_footer( "<small>" + newMode + "</small>" )
  }

  clearTimeout( changezTimeOut )
  changezTimeOut = setTimeout( changez, Math.round(Math.random() * 15000) )
}

//setTimeout( changez, 10000)
