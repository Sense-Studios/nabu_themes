$ ->
  duration = 1000
    
  Slider =
    init: ->      
      $('#slider ul li:last-child').prependTo('#slider ul')
      @dimensions()
      @setIndex(0)
    dimensions: -> 
      @slideCount = $('#slider ul li').length 	
      $('#slider').css({ width: '100%' })   
      @slideWidth = $('#slider').width()
      @slideHeight = $('#slider').height()
      @sliderUlWidth = @slideCount * @slideWidth   	
      $('#slider').css({ width: @slideWidth })   	
      $('#slider ul').css({ width: @sliderUlWidth, marginLeft: - @slideWidth })
      $('#slider ul li').css({ width: @slideWidth, height: @slideHeight })	
      $('.player iframe').css({ width: @slideWidth, height: @slideHeight })	  
    currentIndex: ->
      $('#slider ul li:nth-child(2)').attr('data-idx')
    setIndex: ($idx) ->
      @newIndex = $idx
      $('#category li').removeClass('active')
      $('#category li[data-idx='+@newIndex+']').addClass('active')
    moveRight: ->
      @setIndex($('#slider ul li:nth-child(1)').attr('data-idx'))
      $('#slider ul').animate({
        left: + @slideWidth
      }, duration, ->
        $('#slider ul li:last-child').prependTo('#slider ul')
        $('#slider ul').css('left', '')
      )
      @newIndex
    moveLeft: ->
      @setIndex($('#slider ul li:nth-child(3)').attr('data-idx'))
      $('#slider ul').animate({
        left: - @slideWidth
      }, duration, ->
        $('#slider ul li:first-child').appendTo('#slider ul')
        $('#slider ul').css('left', '')
      )
      @newIndex
    moveTo: ($idx) ->
      console.log('move to:', $idx)
      @setIndex($idx)
      new_index = $('#slider ul li[data-idx='+$idx+']').index()
      if new_index == 0
        @moveRight()
      else      
        steps = new_index - 1
        $('#slider ul').animate({
          left: - (steps * @slideWidth)
        }, duration, ->
          $('#slider ul li').slice(0,steps).appendTo('#slider ul')
          $('#slider ul').css('left', '')
        )
      @newIndex
      
  
  window.slider = Slider
  slider.init()
  
  $(window).resize( ->
    slider.dimensions()
  )
  
  $('#category ul li').click ->
    slider.moveTo $(@).attr('data-idx')