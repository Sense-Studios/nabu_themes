/* globals
program
programs
menudata
pop
vf
agent
getPlayer
marqers
setMarqers
resetMarqers
*/

var analytics_urchin = null;
var pop_under_set = false;
var menu_toggle = 0;
var side_menu = 0;
var mouseTimer = null;
var controlsVisible = true;
var playtoggle = false;
var videoToggle = false;

var ss_options = {
  minColumns: 1,
  enableDrag: false,
  columns: 4,
  align: 'center',
  gutterX: 10,
  gutterY: 10,
  paddingX: 0,
  paddingY: 0
};
  
var lastprogram = null;

// Note that this function is a little different from the original resizer in embed.haml
var program;

// IE8 Fix, normally JQuery takes care of this, but I'm not taking chances here
if ( window.addEventListener ) {
  window.addEventListener("resize", doVideoResize);
}else{
  window.attachEvent("onresize", doVideoResize);
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


var categories;
$(document).ready(function(){
  var myElement = $('.brandbox');
  
  // create a simple instance
  // by default, it only adds horizontal recognizers
  var mc = new Hammer(myElement.get(0));
 
  setTimeout(function(){
    categories = $('.content').length - 2;
  }, 200);
  
  // listen to events...cur
  mc.on("swipeleft", function(ev) {
    
    if ( curr < categories) $('.right_button').trigger('click');
  });
  
  mc.on("swiperight", function(ev) {
    
    if ( curr > 0 ) $('.left_button').trigger('click');
  });
  
});


var sidemenuOpen = false;
if($(window).width() < 700) { 
  var relatedvideoWidth = $('.video_list .item').width();
  var relatedvideoHeight = (relatedvideoWidth / 16) * 9;
  $('.video_list .item').css('height', relatedvideoHeight);
  
  
  $('.custom_navbar_mobile_menu').click(function(){
    if(!sidemenuOpen) {
      $('.cat_group').css({'transform': 'translateX(-260px)','-webkit-transform': 'translateX(-260px)'}).addClass('background-color'); 
      $('.content').css({'transform': 'translateX(-250px)','-webkit-transform': 'translateX(-250px)'}); 
      sidemenuOpen = true; 
    }
    else { 
      $('.cat_group').removeAttr('style')
      $('.content').css({'transform': 'translateX(0)','-webkit-transform': 'translateX(0)'});
      sidemenuOpen = false; 
    }
  });
  
  $('.custom_navbar_left span').removeClass('glyphicon-menu-hamburger').addClass('glyphicon glyphicon-arrow-left');
}



var sideMenuTop = function() {
  if($(window).width() < 700) {
    console.log('wtf', $(window).width());
    $('.brandbox').css('background-color', secundary_color);
    var side_menuTop = $('.video_background').height();
    side_menuTop = side_menuTop + 138;
    $('.side_menu').css('top', side_menuTop); 
  }
}

//secundary_color 
var secundary_color = $('.secondary-color').css('color');

if(isMobile.any()) {
   $('.control_holder').remove();
   $('.brandbox').css('background-color', secundary_color);
   setTimeout(function(){
     $('#video').prop("controls",true);
   }, 500);
}


// initially hide the videoframe
$('#video_frame').hide();

// ########################################################################
// Video Resize Script
// ########################################################################

function doVideoResize() {
  var vf = document.getElementById("video_frame");

  // HEIGHT
  // check for scrubbar
  var scr = 0;
  var ipadcorr = 0;
  if (agent.label == 'IPAD') ipadcorr = 24;    
  if ( program.meta.player_options.scrubbar == "true" ) { scr = 20 }
  // vf.style.height = ( document.documentElement.clientHeight - ( 36 + scr ) - ipadcorr ) + "px";
  vf.style.height = ( document.documentElement.clientHeight - ipadcorr ) + "px";

  // document.getElementsByTagName("body")[0].style.overflow = "hidden";     // no scrollbar
  document.getElementsByTagName("body")[0].style.background = "#aaaaaa";  // background black
}

function initResize() {
  console.log("BABYLON INITRESIZE");
  setSocial();
  if ( program !== undefined && pop !== null ) {
    
    // ##############################
    // ### WHEN PROGRAM LOADED
    // ##############################
    
    doVideoResize();
    lastprogram = program.id;
    pop.on( 'loadstart', function() { 
      $('#video_frame').delay(800).fadeIn('slow');
      //console.log("BABYLON >>> INTERCEPT LOADSTART!")
      $('.control_holder').hide();
      setTimeout( function() { $('.control_holder').hide() }, 500 ) // de fuck?!
    });
    
    //pop.on( 'canplay', function() {
      //console.log("BABYLON >>> INTERCEPT CANPLAY!")
      //$('.control_holder').hide();
      //setTimeout( function() { $('.control_holder').hide() }, 500 ) // de fuck?!
    //})
    
    $('#video_frame').delay(800).fadeIn('slow');
    $('.control_holder').hide();
    setTimeout( function() { $('.control_holder').hide() }, 500 ) // de fuck?!
    $('.program_list').shapeshift(ss_options);
    var programHeight = $('.program_list').height();
    programHeight = programHeight + 40;
    $('.program_list').css('height', programHeight);
    sideMenuTop();
  }else{
    setTimeout(initResize, 300);
  }
}
initResize();

// ########################################################################
// INIT
// ########################################################################

// Yes, this is fucking evil
var marqercheckup = setInterval( function() {
  $('.marqer').addClass('hidden');
}, 300);

function fadeInVideo() {
  if (pop != null ) {
    $('#video_frame').delay(800).fadeIn('slow'); // regular video 
    pop.on( 'loadstart', function() { $('#video_frame').delay(800).fadeIn('slow') } ); // youtube    
    setTimeout(function(){
      sideMenuTop();
    }, 900);
  }else{
    setTimeout( function() { fadeInVideo() }, 500 )
  }
}

function loadProgram( p ) {
  
  console.log("BABYLON LOAD PROGRAM: ")
  $('.track_marqer').remove() // is not removed initially, so a failsafe
  
  if ( p !== undefined && p.id != lastprogram ) { // the program id isnt actually switched anymore
    program = p;
    getPlayer( p, '#video_frame', agent.technology, agent.videotype );
    lastprogram = p.id;
    $('#video_frame').hide();    
    fadeInVideo()
  }
  
  console.log("BABYLON RESET ANIMATION: ", p )
  
  $('.brandbox').fadeOut('slow');
  $('.middle').css('pointer-events','none');
  $('.bottom').removeClass('show_bottom');
  $('.control_holder').removeClass('control_holder_higher');
  $('.video_background_hider').animate({'opacity':0}, 1200 );
  $('.video_background_hider').css('pointer-events','none');  
  try {
    $('.program_list').shapeshift(ss_options);
  }catch(e){
    // fuch it
  }
  
  //Aanpassingen andre
  $('.custom_navbar_navbar').fadeOut();
  $('.custom_navbar_menu').fadeIn();
  $('.custom_navbar_mobile_menu').fadeOut();
  $('.navbar-brand').css('margin-left', '20%');
  $('.custom_navbar_brand').addClass('hidden_navbar_brand');
  $('.custom_navbar_menu').addClass('background-color');
  $('.custom_navbar_menu span').removeClass('primary-color');
  $('.custom_navbar_menu span').css('color','#FFF');
  $('.side_menu').fadeIn();
  $('.control_holder').fadeIn();
  
  console.log("BABYLON BUILDS PROGRAM ... : ", p )
  buildProgram(p)  

  sideMenuTop();
}

function buildProgram( p ) {
  
  console.log("BABYLON BUILDING PROGRAM")
  
  if ( pop == null || pop == undefined ) {
    setTimeout( function() { buildProgram( p ) }, 500 )
    return;
  }
  
  if ( p !== undefined ) {
    // Set Info    
    var time = p.created_at;
    time = new Date(time);
    time = time.toLocaleString();
    var t = "";
    t += "<h3> NOW: <strong>" + p.meta.moviedescription.title + "</strong></h3>";
    t += "<small class='code'>" + time + "</small>";
    t += "<p>"+  p.meta.moviedescription.description + "</p>";
    $('#info').html('');
    $('#info').append(t);
    $('#info p').html( urlifyLinks( $('#info p').html()));
    $('#info p a').addClass('secondary-color-links');
    $('#info').hide().fadeIn('slow');

    var related_programs = []
    $.each( p.tags, function(k, t) { 
      $.each( programs, function( pk, rp ) {
        if ( rp.tags.toString().indexOf(t) != -1 ) { // || p.title.indexOf(t) ) {
          console.log("match!", t, rp.tags.toString() )
          related_programs.push( rp )
        }
      });
    });

    // Set Related
    $('.video_list').html("")
    var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec' ]
    $.each( related_programs, function( i, p ) { 
      var related = ""
      var d = new Date( p.created_at )
      var t = toTime( p.meta.moviedescription.duration_in_ms/1000 )      
      related += '<div class="item">'
      related += '  <a class="relatedvideolink" href="javascript:loadProgramById(\''+p.id+'\');" target="_top"></a>'
      related += '  <img alt="'+p.title+'" src="'+p.meta.moviedescription.thumbnail.replace('mqdefault', 'hqdefault')+'" >'
      related += '  <div class="relatedvideohover"></div>'
      related += '  <div class="playtime"><span class="glyphicon glyphicon-play background-color"></span><div class="time secondary-color">' + t.m + ':' + t.s + '</div></div>'
      related += '  <div class="image_gradient"></div>'
      related += '  <div class="ontopof"><strong class="latest_title secondary-color">'+truncate(p.title, 64)+'</strong>'            
      related += ' <date class="primary-color"><div class="month background-color">'+ months[ d.getMonth() ] + '</div><div class="day">' + d.getDate() + '</div></date>'
      related += '</div></div>'
      $('.video_list').append(related)
    });

    // if we got none
    if ( related_programs.length == 0 ) $('.video_list').append('<h3>Geen gerelateerde videos</h3>')
  }
  
  clearInterval( marqercheckup );
  $('.marqer').removeClass('hidden');
  $('.marqer').hide();
  $('.marqer').fadeIn(2400);
  $('.moar_button').fadeIn('slow');
  
  //console.log("GAZETVANANTWERPEN SET MUTES: ", p )
  pop.mute(false);
  doControl("unmute")
  pop.volume(1);
  pop.playbackRate(1);
  
  //console.log("GAZETVANANTWERPEN add hidden")
  $('.control_holder').fadeOut()
  
  // hide controls, before play
  pop.on('loadeddata', function() {
    console.log("BABYLON: loaded data ... ")
    //console.log("GAZETVANANTWERPEN: loaded data ... ")
    //showControls()
  })
  
  // console.log("GAZETVANANTWERPEN CANPLAY: ", pop, p )
  // failsave
  pop.on('canplay', function() {
    console.log("BABYLON: canplay ... ")
    showControls()
    $('.sense-layer').fadeIn();    
  });
  
  //console.log("GAZETVANANTWERPEN ZUT: ", pop, p )
  // connect play/pause
  pop.on( 'playing', function() { checkPlayButton() } )
  pop.on( 'play', function() { checkPlayButton() } )
  pop.on( 'pause', function() { checkPlayButton() } )
  //pop.on( 'ended', function() { checkPlayButton() } )

  //console.log("GAZETVANANTWERPEN ZUT: ", pop, p )
  pop.on('play', function() {
    //console.log("GAZETVANANTWERPEN: play ... ")
    $('.control_holder .play-button_scrub-bar .playpausebutton span').addClass('glyphicon-pause');
    closeSideMenu();
    showControls()
    pop.mute(false);
    doControl("unmute")
  })
  
  //console.log("GAZETVANANTWERPEN ZUT: ", pop, p )
  pop.on('pause', function() {
    //console.log("GAZETVANANTWERPEN: pause ... ")
    $('.control_holder .play-button_scrub-bar .playpausebutton span').removeClass('glyphicon-pause');
    showControls()
  })    

  //console.log("GAZETVANANTWERPEN MEERZUT: ", pop, p )
  // turn big play button back on (unless yotube ?)
  if ( program.program_items[0].asset._type == "Video" ) {
    $(".big-play").removeClass('hidden')  
    $('.control_holder').fadeIn()
  }

  
  //CHECK IF VIDEO IS YOUTUBE????????
  //??????????????????????
  //if ( program.program_items[0].asset._type != "Video" ) {
  //  $(".quality-switcher").addClass('hidden')  
  //}
  //console.log("GAZETVANANTWERPEN toggleMUTE");
  pop.on( 'mute', function() { 
    //console.log("GAZETVANANTWERPEN toggleMUTED");
  })
  
  if(pop.mute()){
    //console.log("GAZETVANANTWERPEN toggleMUTED");
  }

  // reset and set marqers here with program p?
  if (p === undefined ) return;

  var temp = p.marqers;
  var originalDuration = 0;
  resetMarqers( marqers, originalDuration );  
  //console.log('test p' + p.meta.moviedescription);
  setTimeout( function() {
    setMarqers( temp, originalDuration );
    $('.track_marqer').hide();
    $('.track_marqer').fadeIn("slow");
    $('.marqer').hide();
    $('.marqer').fadeIn("slow");
  }, 100 );
    
  setTimeout( function() { 
    console.log( isPlaying, program.program_items[0].asset._type )
    if (!isPlaying && program.program_items[0].asset._type == 'Video') $('.big-play').removeClass('hidden'); 
    sideMenuTop();   
  }, 800 ) 
  setSocial();
  //
  $('.program_list').shapeshift(ss_options); // failsafe 
}
  
var toggleMuteButton = function() {    
  //console.log("GAZETVANANTWERPEN toggleMUTED");
}  
  
/*
var checkPlayButton = function() {
  if ( pop.paused() ) {
    // set controller o play
    $(".glyphicon-play").removeClass("display");
    $(".glyphicon-pause").addClass("display");
  }else{
    // set op pause
    $(".glyphicon-play").addClass("display");
    $(".glyphicon-pause").removeClass("display");
    $(".big-play").addClass('hidden')
  }
}
*/

var showControls = function() {    
  $('.control_holder').fadeIn();
  checkPlayButton() ; 
}

var toggleSite = function() { 
  if ( $('.brandbox').is(":visible") ) {    
    //console.log("GAZETVANANTWERPEN SHOW VIDEO")

    // show videos
    if (!isPlaying && program.program_items[0].asset._type == 'Video') $('.big-play').removeClass('hidden');
    $('.control_holder').fadeIn('slow'); 

    // why the fuck is this reloading here?
    // chill, its doing nothing when no progam is loading
    loadProgram();

    pop.volume(1);
    pop.playbackRate(1);
    pop.mute(false);
    doControl("unmute")


  }else{
    //console.log("GAZETVANANTWERPEN SHOW MENU etc.")

    // show menus
    $('.big-play').addClass('hidden');
    $('.control_holder').fadeOut('slow');  

    $('.brandbox').fadeIn('slow');

    $('.middle').css('pointer-events','all');
    $('.video_background_hider').css('pointer-events','all');
    $('.bottom').removeClass('show_bottom');
    $('.control_holder').removeClass('control_holder_higher');
    $('.video_background_hider').animate({'opacity':1}, 1200 );
    $('.marqer').addClass('hidden');
    $('.moar_button').fadeOut('slow');
    $('.control_holder .play-button_scrub-bar .playpausebutton span').removeClass('glyphicon-pause');
    
    
    $('.custom_navbar_navbar').fadeIn();
    $('.custom_navbar_menu').fadeOut();
    $('.custom_navbar_mobile_menu').fadeIn();
    $('.navbar-brand').css('margin-left', '10%');
    $('.custom_navbar_brand').removeClass('hidden_navbar_brand');
    $('.custom_navbar_menu').css('background-color','#FFF');
    $('.custom_navbar_menu span').addClass('primary-color');
    
    //Just in case
    closeSideMenu();
    $('.side_menu').fadeOut();
    $('.program_list').shapeshift(ss_options); // failsafe, re-init shapeshift
    videoToggle = false;
    window.clearTimeout(mouseTimer);
    pop.volume(0);
    //pop.pause();
    pop.playbackRate(0.1);

  }
};

// ########################################################################
// ### HELPERS
// ########################################################################

function lookUpProgram(id) {
  var p;
  $.each( programs, function(key, value) { if (value.id == id) {p = value;} });
  return p;
}

function loadProgramById(id) {
  // close menu, just in case
  console.log("load program by id ...");
  if(sidemenuOpen) {
    $('.custom_navbar_mobile_menu').trigger('click'); 
  }
  closeSideMenu();
  videoToggle = true;
  pop.play();
  loadProgram( lookUpProgram( id ) );
}

var curr = 0;
function checkButtons() {
  $('.right_button').show();
  $('.left_button').show();
  if ( curr >= $('.content').length - 2 ) $('.right_button').hide();
  if ( curr <= 0 ) $('.left_button').hide();
}

function createMainContent() {
    
  if ( menudata.menu !== undefined ) { 
    // ### Make Menu Categories!
    //Create dynamic thumbnails for different screens. 
    var screenHeight = $(document).height();
    var screenWidth = $(document).width() - 400;
    var contentHeight = $('.brandbox .content').height();
    var contentWidth = $('.brandbox .content').width();
    var colspanbig;
    var colspan;
    console.log('contentwidth: ', contentWidth);
    if (contentWidth < 700){
      //Big thumbs
      contentWidth = contentWidth / 100 * 80;
      var bigThumbWidth = contentWidth;
      var bigThumbHeight = (bigThumbWidth / 16) * 9;
      //Small thumbs
      var smallThumbWidth = bigThumbWidth;
      var smallThumbHeight = bigThumbHeight;
      colspanbig = 4
      colspan = 4;
    } 
    else if(screenWidth > screenHeight) 
    {
      //Big thumbs
      var bigHeight = Math.floor((contentHeight / 2) - 8);
      var bigThumbHeight = 2 * Math.round(bigHeight  / 2);
      var bigWidth = (bigThumbHeight / 9) * 16;
      var bigThumbWidth = 2 * Math.round(bigWidth / 2);
      //Small thumbs
      var smallThumbWidth = (bigThumbWidth / 2) - 5;
      var smallThumbHeight = (bigThumbHeight / 2) - 5;
      console.log('test 3');
      colspanbig = 2;
      colspan = 1;
    } 
    else 
    {
      //Big thumbs
      var bigWidth = Math.floor((contentWidth / 2) - 10);
      var bigThumbWidth = 2 * Math.round(bigWidth / 2);
      var bigHeight = (bigThumbWidth / 16) * 9;
      var bigThumbHeight = 2 * Math.round(bigHeight / 2);
      //Small thumbs
      var smallThumbWidth = (bigThumbWidth / 2) - 5;
      var smallThumbHeight = (bigThumbHeight / 2) - 5;
      console.log('test 4');
      colspanbig = 2
      colspan = 1;
    }
    var contentHeight = (bigThumbHeight * 2) + 16; 
    var smallThumbClass = (smallThumbHeight < 140) ? "ontopoffsmall" : "ontopoff"; 
    
    $.each( menudata.menu, function(key, menu_category ) {
      if(key == 0) {
        $('.custom_navbar_brand .navbar-brand h1').text(menu_category.name);
      }
      // category
      var category = "";
      category += '<div class="content category'+key+'">';
      category += ' <h2>'+ menu_category.name +'</h2>';
      category += '<div class="contentwrapper contentwrapper'+key+'">';
      category += ' <div class="program_list"/>';
      category += '</div></div>';
      $('.brandbox').append( category );
      $('.category'+key).css('left', ((100*key)+10)+'%');
    
      //Count the items to check if an "More video" button needs to be added
      var videoCount = 0;
      $.each( menu_category.items, function( item_key, item_value ) {
        
        // item
        var item = "";
        var p = lookUpProgram( item_value.id );
        if ( p == undefined ) return;

        if ( item_value.emphasize ) {
          item += '<div class="item item_big" data-ss-colspan="' + colspanbig + '" data-ss-rowspan="2">';
          item += ' <a href="javascript:loadProgramById(\'' + p.id + '\');" target="_top">'; 
          item += ' <img src="'+p.meta.moviedescription.thumbnail.replace('mqdefault', 'hqdefault')+'" width="' + bigThumbWidth + '" height="' + bigThumbHeight + '" >';
          var title = p.title;
          title = title.substring(0, 80);
          videoCount = videoCount + 4;
        }else{
          item += '<div class="item item_smal ' + smallThumbClass + '" data-ss-colspan="' + colspan + '" data-ss-rowspan="1">';
          item += ' <a href="javascript:loadProgramById(\'' + p.id + '\');" target="_top">';
          item += ' <img src="'+p.meta.moviedescription.thumbnail+'" width="' + smallThumbWidth + '" height="' + smallThumbHeight + '" >';
          var title = p.title;
          title = title.substring(0, 42);
          videoCount = videoCount + 1;
        }
        var created = new Date(p.created_at);
        var months = [ "JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC" ];
        var monthName = months[created.getMonth()];
        var date = created.getDate();
        var ms = p.meta.moviedescription.duration_in_ms;
        var seconds = Math.floor((ms / 1000) % 60);
        var minutes = Math.floor((ms / (60 * 1000)) % 60);
        //Seconds always 2 digits.
        if(seconds.toString().length <= 1) { seconds = '0' + seconds; }
        var duration = minutes + ":" + seconds;
        item += '<div class="playtime"><span class="glyphicon glyphicon-play background-color"></span><div class="time secondary-color">' + duration + '</div></div>';
        item += ' <div class="image_gradient"/>';
        item += ' <div class="video_duration_bottom_left"/>';
        item += ' <div class="ontopof"><strong class="title secondary-color">'+ title +'</strong><date class="primary-color"><div class="month background-color">' + monthName + '</div><div class="day ">' + date + '</div></date></div>';
        item += '</a>';
        item += '</div>';

        // append it to this category
        $('.category'+key+' .program_list').append(item);
      });
      if(videoCount > 16 && contentWidth > 500) {
        var button = "";
        button += "<div class='moreVideosButton moreVideosButton" + key + " primary-color' >";
        button += "<p>Meer videos</p>";
        button += "<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>";
        button += "</div><div class='clear'></div>";
        $('.category' + key).append(button);
      
        $(".moreVideosButton" + key ).click(function(){
          var contentwrapper = $('.contentwrapper' + key + ' .program_list').height();
          var contentwrapperCheck = $('.contentwrapper' + key).height();

          if(contentHeight >= contentwrapperCheck) {
            $('.contentwrapper' + key).css('height', contentwrapper);
            $('.category' + key).css({'height': 'auto', 'padding-bottom': '40px'});
            $('p', this).text('Minder videos');
            $('span', this).css({'transform': 'rotateX(180deg)','-webkit-transform':'rotateX(180deg)'})
            var scroller = contentHeight + 65;
            $('.brandbox').animate({scrollTop: scroller}, 1000);
          } else {
            $('.contentwrapper' + key).css('height', contentHeight);
            $('p', this).text('Meer videos');
            $('span', this).css({'transform': 'rotateX(0deg)','-webkit-transform':'rotateX(0deg)'})
            setTimeout(function(){  $('.category' + key).css({'height': '', 'padding-bottom': '0px'});},1000);
          }
        });
      }
      //Content div height
      if(contentWidth > 500) {
        $('.contentwrapper' + key).css('height', contentHeight);
      } else {
        $('.contentwrapper' + key).css('padding-bottom', '40px');
      }
    });
    
    // APPEND AND ADD INTERACTION
    $.each( menudata.menu, function(key, menu_category ) {
      // category header
      var header_item = "";
      header_item += "<li class='cat_item'>";
      header_item += "<a href='javascript:'>" + menu_category.name + "</a>";
      header_item += "</li>";
      $('.cat_group').append(header_item);
    });
    $('.cat_item').click(function(){ $('.custom_navbar_mobile_menu').trigger('click'); });
  }
  
  
  $('.right_button').click( function() {
    $('.content').animate({
      'left': '-=100%'
    }, 1000, "easeOutBack" );
    curr++;
    $('.cat_item').removeClass('active');
    $('.cat_item a').removeClass('primary-color');
    $('.cat_item:eq('+curr+')').addClass('active');
    $('.cat_item:eq('+curr+') a').addClass('primary-color');
    var navbarTitle = $('.cat_group .active').text();
    $(".custom_navbar_brand .navbar-brand h1").fadeOut('fast', function() {
      $(this).text(navbarTitle).fadeIn('fast');
    });
    checkButtons()
  });
  
  $('.left_button').click( function() {
    $('.content').animate({
      'left': '+=100%'
    }, 1000, "easeOutBack" );
    curr--;
    $('.cat_item').removeClass('active');
    $('.cat_item a').removeClass('primary-color');
    $('.cat_item:eq('+curr+')').addClass('active');
    $('.cat_item:eq('+curr+') a').addClass('primary-color');
    var navbarTitle = $('.cat_group .active').text();
    $(".custom_navbar_brand .navbar-brand h1").fadeOut('fast', function() {
      $(this).text(navbarTitle).fadeIn('fast');
    });
    checkButtons()
  });
  
  
  
  // set interaction
  $('.cat_item').click( function(e){
    
    // FIX THIS
    var cli = $('.cat_item').index( $(this) );
    var gotopos = (cli * 100 ) - ( curr * 100 );
    $('.content').animate({
      'left': "-=" + gotopos + "%",
    }, 800, "easeOutBack" );

    curr = $('.cat_item').index( $(this) );
    $('.cat_item').removeClass('active');
    $('.cat_item a').removeClass('primary-color');
    $('.cat_item:eq('+curr+')').addClass('active');
    $('.cat_item:eq('+curr+') a').addClass('primary-color');
    var navbarTitle = $('.cat_group .active').text();
    $(".custom_navbar_brand .navbar-brand h1").fadeOut('fast', function() {
      $(this).text(navbarTitle).fadeIn('fast');
    });
    checkButtons()
  });
  
  // activate the first
  $('.cat_item:first').addClass('active');
  $('.cat_item:first a').addClass('primary-color');
  $('.left_button').hide();  
}
function createMenu() {
  // ### GET ACTUAL DATA!
  // filter out the categories and fill them  
  $.each( menudata.menu, function(key, c) {
    var categorie = ''
    categorie += '<ul id="' + c.name.toLowerCase().split(' ').join('_') + '" class="side_menu_category">'
    categorie += '<span class="side_menu_category_title primary-color">' + c.name + '</span></ul>';
    $('.side_menu_content').append( categorie );
    $.each( c.items, function( key, i) {

      var item = '';
      item += '<li> <a href="javascript:loadProgramById(\'' + i.id + '\');">';
      // item += '<img src="' + i.name + '" height="32px" width="48px"/>';
      item += i.name;
      item += '</a>';
      item += '</li>';      
      $('.side_menu_category:last').append( item );   
    })
  });
  
  // activate & open the first (?)
  $('ul:first').addClass('active');
  
  // init search interaction
  $('#search_field').on('input', function() { 
  });
  
  // set interaction
  $('.side_menu_category').find('li:first').css('box-shadow', 'inset 0px 2px 4px rgba(0,0,0,0.3)');
  $('.side_menu_category li:even').css('background-color', '#e8e8e8');
  $('.side_menu_category li:odd').css('background-color', '#dcdcdc');
  $('.side_menu_category li').mouseenter( function() {     
    $( this ).addClass('side_menu_over')
    $( this ).addClass('primary-background-color')

  }).mouseleave( function() {     
    $('.side_menu_category li:even').css('background-color', '#e8e8e8');
    $('.side_menu_category li:odd').css('background-color', '#dcdcdc');
    $( this ).removeClass('side_menu_over')
    $( this ).removeClass('primary-background-color')
  });
}


//SLIDING CAROUSEL IN FOOTER FOR VIDEOS
function createFooter() {

    popTimeUpdate();

    $('#myCarousel').carousel({
      interval: false
    });

    $('.fdi-Carousel .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));
        

      for (var i=0;i<4;i++) {
          next=next.next();
          if (!next.length) {
          	next = $(this).siblings(':first');
        	}
          
          next.children(':first-child').clone().appendTo($(this));
        }
    });
    
  /* HIDE CONTROLS AFTER INACTIVITY 2000MS 
  NOT WORKING PROPERLY
  var onmousestop = function(){
    $("#controls").hide();
  }
  
  $("*").mousemove(function(e){
    $("#controls").show();
    clearTimeout(timer);
    timer = setTimeout(onmousestop, 2000)
  });
  */

	//ANIMATE SIDE-MENU ITEMS TO AUTO HEIGHT
	 var clicked = 0; 
   $(".side_menu_category_title").click(function(){
    var curheight = $(this).parent().height();
      if(curheight > 40){
        $(this).parent().animate({height: "33px"}, 500);
      }
      else {
        if (clicked == 1){
          $(".side_menu_category_title").parent().animate({height: "33px"}, 500);
        }
        $(this).parent().css('height', 'auto');
        var clickeddiv = $(this).parent().height();
        $(this).parent().css('height', '33px');
        $(this).parent().animate({height: clickeddiv}, 500);
        clicked = 1; 
      }
	}); 
	
	
	//SEARCH FOR URLS IN DESCRIPTION TEXT
	//MAKE THOSE URLS SECUNDAIRY-COLOR

  $(".moviedescriptionp *").addClass("secondary-color");
  
  
  //QUALITY SWITCHER TEXT REPLACE SD WITH HD WHEN SWITCH
  //AND BACK
  $(".quality-switch-button").click(function(){
  var innertext = $(".quality-switch-button").text();

    if(innertext.indexOf("SD")>=0){
      (this).innerHTML = "HD";
    }
    else {
      (this).innerHTML = "SD";
    }
  });
  
  //SWITCH ICON MUTE IF CLICKED
  $("#butt-togglemute").click(function() {
    $(".glyphicon-volume-off").toggleClass("display");
    $(".glyphicon-volume-up").toggleClass("display");
  });
  
  //SCRUBBER
  //popProgress();
  
};


// ########################################################################
// ### INIT
// ########################################################################

$(function() {
  
  // ### MAIN VIEWS
  var menu = "";  
  createMainContent();
  createMenu();
  createFooter();

  // NAVBAR
  $('.navbar-brand').click( toggleSite );
  
  // MOAR (depricated)
  $('.moar_button').click( toggleSite );   
  $('.moar_button').hide();  
  
  // FOOTER
  $('.show_info').click( function() {  
    $('.bottom').toggleClass('show_bottom'); 
    $('.control_holder').toggleClass('control_holder_higher');
  } );
  $('.play_now').click( toggleSite );

  //PRIMARY COLORS FOR TAB TITLE
  $('h3','.active').addClass('primary-color');
  $('#tabs a').click(function (e) {
    $('h3').removeClass('primary-color');
    $('h3', this).addClass('primary-color');
    e.preventDefault()
    $(this).tab('show')
  }); 

  $('.go_to_video').click( toggleSite );
  
  // ### SIDE MENU
  // set buttons
  $('.menu_button').click(function() {  $('.side_menu').removeClass('open_side_menu'); } );  
  $('.close_butt').click(function() { $('.side_menu').removeClass('open_side_menu'); } );  
  $('.side_menu').removeClass('open_side_menu');

  // ### MAIN
  $('.program_list').shapeshift(ss_options);
  var programHeight = $('.program_list').height();
  programHeight = programHeight + 40;
  $('.program_list').css('height', programHeight);
  
});

//Aanpassingen Andre
$('.custom_navbar_menu').click( function() { toggleSite(); videoToggle = false; window.clearTimeout(mouseTimer);});
$('.tabpanel ul li').click( function() { openSideMenu(); });
$('.fa-close').click( function() { closeSideMenu(); });
//$('div:not(.item,.top)').click( function() { 
//  if ( $('.brandbox').is(":visible") ) { 
//    toggleSite(); videoToggle = false; window.clearTimeout(mouseTimer);
//  } 
//});
$('.sense-layer').css('display','block');
$('.sense-layer').click(function() {
  if(playtoggle == false) {
    pop.play(); 
    playtoggle = true;
  } else {
    pop.pause();
    playtoggle = false;
  }
})


var openSideMenu = function() {
    $('.side_menu').addClass('open_side_menu');
    videoToggle = false;
    window.clearTimeout(mouseTimer);
}

var closeSideMenu = function() {
    $('.side_menu').removeClass('open_side_menu');
    videoToggle = true;
    window.clearTimeout(mouseTimer);
}


//HIDE CONTROLS SIDE MENU AND NAVBAR WHILE PLAYING
//AFTER .. SECONDS MOUSE INACTIVITY
var disappearControls = function() {
    mouseTimer = null;
    $('.custom_navbar').addClass('fadeOutHidden');
    $('.side_menu').addClass('fadeOutHidden');
    $('.control_holder').addClass('fadeOutHidden');
    controlsVisible = false;
}

$(document).mousemove(function(){ 
  if(videoToggle == true){
    if (mouseTimer) {
      window.clearTimeout(mouseTimer);
    }
    if (!controlsVisible) {
      $('.custom_navbar').removeClass('fadeOutHidden');
      $('.side_menu').removeClass('fadeOutHidden');
      $('.control_holder').removeClass('fadeOutHidden');
      cursorVisible = true;
    }
    mouseTimer = window.setTimeout(disappearControls, 3000);
  }
});


//this is bad
setTimeout(function(){
  sideMenuTop();
},2000);