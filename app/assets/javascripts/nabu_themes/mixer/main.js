var r, b, f

$(function() {

  // Set up the renderer
  r = new GLRenderer()
  b = new BPM()
  f = new Filemanager()

  // attach modules to renderer
  r.addModule(b)
  r.addModule(f)
  r.start()

  b.bpm = 28;


})
