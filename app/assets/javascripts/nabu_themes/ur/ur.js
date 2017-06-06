// @filtered_programs
$(window).on('hashchange', function() {
  $('.video_container').attr('src', '/embed2/' + window.location.hash.slice(1) + "" );
});

$(function() {
  $('.videoitem').click( function() {
      window.location.hash = $(this).data('id')
      $("html, body").animate({ scrollTop: 0 }, 600);
  });

  $('.main-color').css('color', window.main_color );
  $('.secondary-color').css('color', window.support_color );

  // set navs, a
  $('a').css('color', window.support_color );
  $('a').hover(function() {
    $(this).css('color', window.background_color )
    $(this).css('background-color', window.main_color )
  }, function() {
    $(this).css('color', window.support_color )
    $(this).css('background-color', 'rgba(0,0,0,0)' )
  } );

  $('.background-color').css('background-color', window.background_color );

  if (window.location.hash == "") {
    $('.video_container').attr('src', '/embed2/' + firstprogramid );
  }else{
    $('.video_container').attr('src', '/embed2/' + window.location.hash.slice(1) );
  }

});
