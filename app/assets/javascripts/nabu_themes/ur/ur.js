// @filtered_programs

$(function() {
  $('.videoitem').click( function() {
      $('.video_container').attr('src', '/embed2/' + $(this).data('id') + "" );
      $("html, body").animate({ scrollTop: 0 }, 600);
  });

  $('.main-color').css('color', window.main_color );
  $('.secondary-color').css('color', window.support_color );
  $('.background-color').css('color', window.background_color );
});
