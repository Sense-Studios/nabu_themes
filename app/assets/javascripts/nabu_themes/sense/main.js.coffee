# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
console.log(1)
$ ->
  console.log(2)
  $(document).on 'page:fetch', (e) ->
    console.log('fetch')
    $('#content').fadeOut()
    $('#slides').fadeOut()
    
  $(document).on 'page:restore', (e) ->
    console.log('restore')
    $('#content').fadeIn()
    
  $(document).on 'page:change', (e) ->
    console.log('change')
    $('#content').fadeIn()
    
  $(document).on 'page:receive', (e) ->
    console.log('receive')
    $('#content').fadeIn()
  
  $(document).on 'page:before-unload', (e) ->
    console.log('before-unload')
    $('#content').fadeOut()

  $('.menu_btn').click ->
    $("#menu, #menu-info").toggleClass('closed')
    console.log('menu click')
    
  $('#menu > .close-btn').click ->
    $('#menu, #menu-info').addClass('closed')