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

var ss_options = {
  minColumns: 2,
  enableDrag: false,
  align: 'left',
  gutterX: 10,
  gutterY: 15,
  paddingX: 0,
  paddingY: 0
};
  
var lastprogram = null

// Note that this function is a little different from the original resizer in embed.haml
var program;

// IE8 Fix, normally JQuery takes care of this, but I'm not taking chances here
if ( window.addEventListener ) {
  window.addEventListener("resize", doVideoResize);
}else{
  window.attachEvent("onresize", doVideoResize);
}

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
  if ( program !== undefined && pop !== null ) {
    
    // ##############################
    // ### WHEN PROGRAM LOADED
    // ##############################
    
    doVideoResize();
    lastprogram = program.id;
    pop.on( 'loadstart', function() { 
      $('#video_frame').delay(800).fadeIn('slow');
    });
    
    $('#video_frame').delay(800).fadeIn('slow');
    $('.program_list').shapeshift(ss_options);
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
  }else{
    setTimeout( function() { fadeInVideo() }, 500 )
  }
}

function loadProgram( p ) {
  
  console.log("BASICWHITE LOAD PROGRAM: ", p )
  $('.track_marqer').remove() // is not removed initially, so a failsafe
  
  if ( p !== undefined && p.id != lastprogram ) { // the program id isnt actually switched anymore
    program = p;
    getPlayer( p, '#video_frame', agent.technology, agent.videotype );
    lastprogram = p.id;
    $('#video_frame').hide();    
    fadeInVideo()
  }
  
  console.log("BASICWHITE RESET ANIMATION: ", p )
  
  $('.brandbox').fadeOut('slow');
  $('.middle').css('pointer-events','none');
  $('.custom_navbar').animate({'background-color':'rgba(0,0,0,0)'}, 600);
  $('.bottom').removeClass('show_bottom');
  $('.control_holder').removeClass('control_holder_higher');
  $('.video_background_hider').animate({'opacity':0}, 1200 );
  $('.video_background_hider').css('pointer-events','none');
  $('.program_list').shapeshift(ss_options);
  
  buildProgram(p)
}

function buildProgram( p ) {
  
  if ( pop == null || pop == undefined ) {
    setTimeout( function() { buildProgram( p ) }, 500 )
    return;
  }

  console.log("BASICWHITE SET INFO: ", p )

  if ( p !== undefined ) {
    var t = "";
    t += "<h3> NOW: <strong>" + p.meta.moviedescription.title + "</strong></h3>";
    t += "<small class='code'>" + p.created_at + "</small>";
    t += "<p>"+  p.meta.moviedescription.description + "</p>";
    $('#definition').html('');
    $('#definition').append(t);
    $('#definition').hide().fadeIn('slow');
  }
  
  console.log("BASICWHITE SET MARQERS: ", p )
  
  clearInterval( marqercheckup );
  $('.marqer').removeClass('hidden');
  $('.marqer').hide();
  $('.marqer').fadeIn(2400);
  
  $('.moar_button').fadeIn('slow');
  
  console.log("BASICWHITE SET MUTES: ", p )
  pop.mute(false);
  pop.volume(1);
  pop.playbackRate(1);
  
  console.log("BASICWHITE add hidden")
  $('.control_holder').addClass('hidden')

  console.log("BASICWHITE ADD LISTENERS: ", pop, p )
  
  console.log("LOADED DATA: ", pop, p )
  
  // hide controls, before play
  pop.on('loadeddata', function() {
    console.log("BASICWHITE: loaded data ... ")
    showControls()    
  })
  
  console.log("BASICWHITE CANPLAY: ", pop, p )
  // failsave
  pop.on('canplay', function() {
    console.log("BASICWHITE: canplay ... ")
    showControls()
  })  
  
  console.log("BASICWHITE ZUT: ", pop, p )
  // connect play/pause
  pop.on( 'playing', function() { checkPlayButton() } )
  pop.on( 'play', function() { checkPlayButton() } )
  pop.on( 'pause', function() { checkPlayButton() } )
  //pop.on( 'ended', function() { checkPlayButton() } )

  console.log("BASICWHITE ZUT: ", pop, p )
  pop.on('play', function() {
    console.log("BASICWHITE: play ... ")
    showControls()
  })  

  console.log("BASICWHITE MEERZUT: ", pop, p )
  // turn big play button back on (unless yotube ?)
  if ( program.program_items[0].asset._type == "Video" ) {
    $(".big-play").removeClass('hidden')  
    $('.control_holder').removeClass('hidden')
  }

  
  //CHECK IF VIDEO IS YOUTUBE????????
  //??????????????????????
  //if ( program.program_items[0].asset._type != "Video" ) {
  //  $(".quality-switcher").addClass('hidden')  
  //}
  console.log("BASIC WHITE toggleMUTE");
  pop.on( 'mute', function() { 
    console.log("BASIC WHITE toggleMUTED");
  })
  
  if(pop.mute()){
    console.log("BASIC WHITE toggleMUTED");
  }

  // reset and set marqers here with program p?
  if (p === undefined ) return;

  var temp = p.marqers;
  var originalDuration = 0;
  resetMarqers( marqers, originalDuration );  

  setTimeout( function() {
    setMarqers( temp, originalDuration );
    $('.track_marqer').hide();
    $('.track_marqer').fadeIn("slow");
    $('.marqer').hide();
    $('.marqer').fadeIn("slow");
  }, 100 );
  
  //
  $('.program_list').shapeshift(ss_options); // failsafe
}
  
var toggleMuteButton = function() {    
  console.log("BASIC WHITE toggleMUTED");
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
  $('.control_holder').removeClass('hidden')
  $('.control_holder').fadeIn();
  checkPlayButton() ; 
}

var toggleSite = function() { 
  if ( $('.brandbox').is(":visible") ) {    
    console.log("BASICWHITE SHOW VIDEO")

    // show videos
    $('.big-play').removeClass('hidden');
    $('.control_holder').fadeIn('slow'); 
    
    // why the fuck is this reloading here?
    loadProgram();

    //pop.volume(1);
    //pop.playbackRate(1);

  }else{
    console.log("BASICWHITE SHOW MENU etc.")

    // show menus
    $('.big-play').addClass('hidden');
    $('.control_holder').fadeOut('slow');  

    $('.brandbox').fadeIn('slow');
    $('.custom_navbar').animate({'background-color':'rgba(255,255,255,1)'}, 600);
    $('.middle').css('pointer-events','all');
    $('.video_background_hider').css('pointer-events','all');
    $('.bottom').removeClass('show_bottom');
    $('.control_holder').removeClass('control_holder_higher');
    $('.video_background_hider').animate({'opacity':1}, 1200 );
    $('.marqer').addClass('hidden');
    $('.moar_button').fadeOut('slow');

    $('.program_list').shapeshift(ss_options); // failsafe, re-init shapeshift

    pop.volume(0);
    pop.playbackRate(0.3);

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
  loadProgram( lookUpProgram( id ) );
  $('.side_menu').animate({right: '-300px'} ); // close menu, just in case
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
    $.each( menudata.menu, function(key, menu_category ) {
      
      // category
      var category = "";
      category += '<div class="content category'+key+'">';
      category += ' <h2>'+ menu_category.name +'</h2>';
      category += ' <div class="program_list"/>';
      category += '</div>';
      $('.brandbox').append( category );
      $('.category'+key).css('left', ((100*key)+8)+'%');
      
      $.each( menu_category.items, function( item_key, item_value ) {

        // item
        var item = "";
        var p = lookUpProgram( item_value.id );
        if ( p == undefined ) return;

        if ( item_value.emphasize ) {
          item += '<div class="item" data-ss-colspan=2>';
          item += ' <a href="javascript:loadProgramById(\'' + p.id + '\');" target="_top">';
          item += ' <img src="'+p.meta.moviedescription.thumbnail+'" width="406px" height="239px" >';
        }else{
          item += '<div class="item" data-ss-colspan=1>';
          item += ' <a href="javascript:loadProgramById(\'' + p.id + '\');" target="_top">';
          item += ' <img src="'+p.meta.moviedescription.thumbnail+'" width="198px" height="112px" >';
        }

        item += '</a>';
        item += ' <div class="image_gradient"/>';
        item += ' <div class="video_duration_bottom_left"/>';
        item += ' <h4 class="ontopof">'+p.title+'</h4';
        item += '</div>';

        // append it to this category
        $('.category'+key+' .program_list').append(item);
      });
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
  }
  
  $('.right_button').click( function() {
    $('.content').animate({
      'left': '-=100%'
    }, 800, "easeOutBack" );
    curr++;
    $('.cat_item').removeClass('active');
    $('.cat_item a').removeClass('primary-color');
    $('.cat_item:eq('+curr+')').addClass('active');
    $('.cat_item:eq('+curr+') a').addClass('primary-color');
    
    checkButtons()
  });
  
  $('.left_button').click( function() {
    $('.content').animate({
      'left': '+=100%'
    }, 800, "easeOutBack" );
    curr--;
    $('.cat_item').removeClass('active');
    $('.cat_item a').removeClass('primary-color');
    $('.cat_item:eq('+curr+')').addClass('active');
    $('.cat_item:eq('+curr+') a').addClass('primary-color');
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
	//MAKE THOSE URLS PRIMARY-COLOR
  $('.moviedescription p').html( urlifyLinks( $('.moviedescription p').html()));
  $(".moviedescriptionp *").addClass("primary-color");
  
  
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
  $('.menu_button').click(function() { $('.side_menu').animate({right: '0px'} ); } );  
  $('.close_butt').click(function() { $('.side_menu').animate({right: '-300px'} ); } );  
  $('.side_menu').css({right: '-300px'});

  // ### MAIN
  $('.program_list').shapeshift(ss_options);
  
});
