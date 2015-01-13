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
  vf.style.height = ( document.documentElement.clientHeight - ( 36 + scr ) - ipadcorr ) + "px";

  // document.getElementsByTagName("body")[0].style.overflow = "hidden";     // no scrollbar
  document.getElementsByTagName("body")[0].style.background = "#aaaaaa";  // background black
}

// IE8 Fix, normally JQuery takes care of this, but I'm not taking chances here
if ( window.addEventListener ) {
  window.addEventListener("resize", doVideoResize);
}else{
  window.attachEvent("onresize", doVideoResize);
}

// Note that this function is a little different from the original resizer in embed.haml
var program;

$('#video_frame').hide();
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

function loadProgram( p ) {
  
  if ( p !== undefined && p.id != lastprogram ) { // the program id isnt actually switched anymore
    program = p;
    getPlayer( p, '#video_frame', agent.technology, agent.videotype );
    lastprogram = p.id;
    $('#video_frame').hide();
    pop.on( 'loadstart', function() { $('#video_frame').delay(800).fadeIn('slow') } ); // youtube
    $('#video_frame').delay(800).fadeIn('slow'); // regular video
  }
  
  $('.brandbox').fadeOut('slow');
  $('.middle').css('pointer-events','none');
  $('.custom_navbar').animate({'background-color':'rgba(0,0,0,0)'}, 600);
  $('.bottom').removeClass('show_bottom');
  $('.video_background_hider').animate({'opacity':0}, 1200 );
  $('.video_background_hider').css('pointer-events','none');
  $('.program_list').shapeshift(ss_options);

  if ( p !== undefined ) {
    var t = "";
    t += "<h3> NOW: <strong>" + p.meta.moviedescription.title + "</strong></h3>";
    t += "<small class='code'>" + p.created_at + "</small>";
    t += "<p>"+  p.meta.moviedescription.description + "</p>";
    $('.video_bar_footer .video_info').html('');
    $('.video_bar_footer .video_info').append(t);
    $('.video_bar_footer .video_info').hide().fadeIn('slow');
  }
  
  clearInterval( marqercheckup );
  $('.marqer').removeClass('hidden');
  $('.marqer').hide();
  $('.marqer').fadeIn(2400);
  
  $('.moar_button').fadeIn('slow');
  pop.volume(1);  
  pop.playbackRate(1);
  
  // reset and set marqers here with program p?
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
  
  $('.program_list').shapeshift(ss_options); // failsafe
}
  
var toggleSite = function() { 
  
  if ( $('.brandbox').is(":visible") ) {
     loadProgram();
    
  }else{
    
    $('.brandbox').fadeIn('slow');
    $('.custom_navbar').animate({'background-color':'rgba(255,255,255,1)'}, 600);
    $('.middle').css('pointer-events','all');
    $('.video_background_hider').css('pointer-events','all');
    $('.bottom').removeClass('show_bottom');
    $('.video_background_hider').animate({'opacity':1}, 1200 );
    $('.marqer').addClass('hidden');
    $('.moar_button').fadeOut('slow');
    
    $('.program_list').shapeshift(ss_options); // failsafe
  }
  
  pop.volume(0);
  pop.playbackRate(0.3);
};

$('.navbar-brand').click( toggleSite );
$('.moar_button').click( toggleSite );
$('.show_info').click( function() { $('.bottom').toggleClass('show_bottom'); } );
$('.play_now').click( toggleSite );

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
}

var curr = 0;
function checkButtons() {
  $('.right_button').show();
  $('.left_button').show();
  if ( curr >= $('.content').length - 2 ) $('.right_button').hide();
  if ( curr <= 0 ) $('.left_button').hide();
}

// ########################################################################
// ### INIT
// ########################################################################

$(function() {
  
  // ### MAIN VIEWS
  var menu = "";
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

      // now add the footer
      // var footer = "<div class='footer'><h3>";
      // footer += '<a class="go_to_video over_glow" href="javascript:">';
      // footer += 'Naar video<span class="glyphicon glyphicon-play"/>';
      // footer += '</a></h3></div>';
      // $('.category'+key ).append(footer);
    });
    
    // APPEND AND ADD INTERACTION
    $.each( menudata.menu, function(key, menu_category ) {
      // category header
      var header_item = "";
      header_item += "<li class='cat_item'>";
      header_item += "<a href='javascript:'>" + menu_category.name + "</a>";
      header_item += "</li>";
      $('.cat_group').append(header_item);
      
      // do something smart
    });
  }


  $('.go_to_video').click( toggleSite );
  
  // ### SIDE MENU
  // set buttons
  $('.menu_button').click(function() { $('.side_menu').animate({right: '0px'} ); } );  
  $('.close_butt').click(function() { $('.side_menu').animate({right: '-300px'} ); } );  
  $('.side_menu').css({right: '-300px'});
  
  // ### GET ACTUAL DATA!
  // filter out the categories and fill them
  var categories = ["landbouw", "akkerbouw", "tractoren", "anders"];
  $.each( categories, function(key, c) {
    var categorie = '<ul id="' + c + '" class="side_menu_category"><span class="side_menu_category_title">' + c + '</span></ul>';
    $('.side_menu_content').append( categorie );
  });
  
  // add the programs to the categories
  $.each( programs, function( key, p ) {
    var item = '<li> <a href="/'+p.id+'"> <img src="'+p.meta.moviedescription.thumbnail+'" height="32px" width="48px"/>' + p.title + '</a></li>';
    $('#' + categories[ Math.floor( Math.random() * categories.length )]).append( item );
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
  }).mouseleave( function() {     
    $('.side_menu_category li:even').css('background-color', '#e8e8e8');
    $('.side_menu_category li:odd').css('background-color', '#dcdcdc');
    $( this ).removeClass('side_menu_over')
  });
  
  // remove at first
  $('.moar_button').hide();

  // ### MAIN
  $('.program_list').shapeshift(ss_options);
  // $('#video_frame').addClass('blurred');  
  
  $('.program_list').shapeshift(ss_options); // failsafe
  
  $('.right_button').click( function() {
    $('.content').animate({
      'left': '-=100%'
    }, 800, "easeOutBack" );
    curr++;
    $('.cat_item').removeClass('active');
    $('.cat_item:eq('+curr+')').addClass('active');
    
    checkButtons()
  });
  
  $('.left_button').click( function() {
    $('.content').animate({
      'left': '+=100%'
    }, 800, "easeOutBack" );
    curr--;
    $('.cat_item').removeClass('active');
    $('.cat_item:eq('+curr+')').addClass('active');
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
    $('.cat_item:eq('+curr+')').addClass('active');
    checkButtons()
  });
  
  // activate the first
  $('.cat_item:first').addClass('active');
  $('.left_button').hide();
});

