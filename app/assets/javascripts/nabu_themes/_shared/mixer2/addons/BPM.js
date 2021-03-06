function BPM( renderer ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "BPM_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Addon"
  _self.bpm = 128              // beats per minute
  _self.bps = 2.133333         // beats per second
  _self.sec = 0                // second counter, from which the actual float is calculated
  _self.bpm_float = 0.46875    // 60 / 128, current float of bpm
  _self.mod = 1                // 0.25, 0.5, 1, 2, 4, etc.

  _self.useAutoBpm = true      // auto bpm
  _self.autoBpmData = {}       // info object for the auto bpm
  _self.useMicrophone = false  // use useMicrophone for autoBPM
  _self.audio_src = ""         // audio file or stream (useMicrophone = false)
  _self.bypass = false

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  _self.blinkCallBack = function(){} // for override

  // define scheme for this Addon
  _self.scheme = function() {
    var scheme = {
      description: {
        "name": "BPM",
        "type": "Addon"
      },
      inputs: {
        "bypass": "Boolean",
        "audio": "Addon",
        "mod": "number"
      },
      outputs: {
        "bpm": "number",
        "bpm_float": "float"
      }
    }
    return scheme;
  }

  // init with a tap contoller
  _self.init = function() {
    console.log("init BPM contoller.")

    // initialize autoBPM with an audio object
    initializeAutoBpm()
  }

  // UPDATE
  var starttime = (new Date()).getTime()
  _self.update = function() {
    nodes.forEach( function( node ) {
      node( _self.render() );
    });

    c = ((new Date()).getTime() - starttime) / 1000;
    _self.sec = c * Math.PI * ( _self.bpm * _self.mod ) / 60            // * _self.mod
    _self.bpm_float = ( Math.sin( _self.sec ) + 1 ) / 2       // Math.sin( 128 / 60 )
  }

  // half or double the bpm
  _self.modUp = function() { _self.mod *= 2; }
  _self.modDown = function() { _self.mod *= .5; }

  // add nodes
  _self.add = function( _func ) {
    nodes.push( _func )
  }

  _self.render = function() {
    // returns current bpm 'position' as a value between 0 - 1
    return _self.bpm_float
  }

  // ---------------------------------------------------------------------------
  // Tapped beat control
  var last = Number(new Date());
  var bpms = [ 128, 128 ,128 ,128 ,128 ];
  var time = 0;
  var avg = 0;

  _self.tap = function() {
    useAutoBPM = false
    time  = Number(new Date()) - last
    last = Number(new Date());
    if ( time < 10000 && time > 10 ) {
      bpms.splice(0,1)
      bpms.push( 60000/time )
      avg = bpms.reduce(function(a, b) { return a + b; }) / bpms.length;
      _self.bpm = avg
      _self.bps = avg/60
    }
  }

  // ---------------------------------------------------------------------------
  // AUTO BPM
  // because of timing issues, autobpm runs seperate from the update call

  // setup ---------------------------------------------------------------------
  var audio = new Audio()
  var context = new AudioContext(); // AudioContext object instance
  var source = context.createMediaElementSource(audio);
  var bandpassFilter = context.createBiquadFilter();
  var analyser = context.createAnalyser();
  var start = Date.now();
  var d = 0; // counter for non-rendered bpm

  // config --------------------------------------------------------------------
  // with ~ 200 samples/s it takes ~ 20 seconds to adjust
  var sampleLength = 4000;
  var dataSet = new Array(sampleLength);
  var peaks = new Array(sampleLength);
  var bufferLength
  var foundpeaks = [];
  var peak_max = 60;
  var peak_min = 15;
  var treshold = 1;
  var intervalCounts = [];

  // audio.src = 'http://nabu.sense-studios.com/proxy.php?url=http://208.123.119.17:7904';
  audio.src =  '//nabu.sense-studios.com/proxy.php?url=http://37.220.36.51:8906';
  // audio.src = '/audio/rage_hard.mp3'
  // audio.src = '/audio/i_own_it.mp3'
  // audio.src = '/audio/100_metronome.mp3'
  // audio.src = '/audio/120_metronome.mp3'
  // audio.src = '/audio/140_metronome.mp3'

  var setSrs = function( _src ) {
    audio.src = _src
  }

  audio.controls = true;
  audio.loop = true;
  audio.autoplay = true;

  bandpassFilter.type = "lowpass";
  bandpassFilter.frequency.value = 350 //(settings.passFreq ? settings.passFreq : 400);
  bandpassFilter.Q.value = 1

  analyser.fftSize = 128;
  bufferLength = analyser.frequencyBinCount;

  // firstload for mobile
  $("body").click(function() {
    audio.play();
    document.body.webkitRequestFullScreen()
  });

  // initialize Audio, used in the first run
  var initializeAudio = new Promise( function( resolve, reject ) {
    source.connect(bandpassFilter);
    bandpassFilter.connect(analyser);

    // HERE
    // comment for sound
    source.connect(context.destination);

    resolve(audio);
    reject(err);
  })

  var initializeAutoBpm = function() {
    initializeAudio.then( function(r) {
      setInterval( sampler, 1);                 // as fast as we can, we need those samples
      console.log("Auto BPM is initialized!");

    }).catch( function(err){
      console.log("Error: Auto BPM ERROR ", err);
    });
  }

  var sampler = function() {
    if ( !_self.useAutoBpm ) return;
    if ( _self.audio_src != "" && !_self.useMicrophone ) return;
    if ( _self.bypass ) return;
    // if  no src && no mic -- return
    // if ... -- return

    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray)

    // precalc
    var now = Date.now()
    var high = 0
    dataArray.forEach( (d,i)=> { if ( d > high ) high = d })
    dataSet.push( [ now, high ] )

    if (dataSet.length > sampleLength) dataSet.splice(0, dataSet.length - sampleLength)
    d++

    // SLOWPOKE
    // take a snapshot every 1/10 second and calculate beat
    if ( ( now - start) > 100 ) {

      var tempoData = getTempo(dataSet)
      //var tempoCounts = tempoData.tempoCounts
      // getBlackout // TODO
      // getAmbience // TODO
      // drawData(dataSet) // DEPRICATED
      //if (tempoCounts[0] !== undefined) window.bpm = tempoCounts[0].tempo

      // $('#info').html( dataSet.length + "\t " + c * 10 + " samples/s" + "\t peaks: "  + foundpeaks.length + "\tBPM: <strong>"+ Math.round(window.bpm) + " </strong> ("+Math.round(window.bpm2)+") \t\tconfidence: <em>" + window.confidence + " <strong>" + window.calibrating + "</strong></em>" ) //.+ " -- " + _dataSet[ _dataSet.length - 1 ] )
      // console.log(" ### AUTOBPM: ",  window.calibrating, tempoData.bpm, d, tempoData.foundpeaks.length, treshold )
      window.bpm_test = tempoData.bpm
      _self.sec = c * Math.PI * tempoData.bpm / 60
      start = Date.now()
      d = 0
    }

  }

  // blink on the beat
  var doBlink = function() {
    if ( audio.paused ) {
      $('.blink').hide()
    }else{
      $('.blink').toggle()
      _self.blinkCallBack()
    }
    setTimeout( doBlink, (60/window.bpm_test)*1000 )
  }
  doBlink()

  // rewrite of getTempo without display and local vars
  var getTempo = function( _data ) {
    foundpeaks = []                    // reset foundpeaks
    peaks = new Array( _data.length )  // reset peaks

    // find peaks
    for ( var i = 0; i < _data.length; i++ ) {
      if ( _data[i] !== undefined && _data[i][1] > ( treshold * 128 ) ) {
        peaks[i] = [ dataSet[i][0], 1 ];           // update in peaks
        foundpeaks.push( [ _data[i][0], 1 ] );     // add to foundpeaks
        i += 50;                                   // += 0.4s, to move past this peak
      }
    }

    // make sure we have enough peaks by adjusting the treshhold
    if ( foundpeaks.length < peak_min ) treshold -= 0.05;
    if ( foundpeaks.length > peak_max ) treshold += 0.05;
    if ( treshold > 2 ) treshold = 2;
    if ( treshold < 1 ) treshold = 1;

    // calculate tempo by grouping peaks and calculate interval between them
    // see: http://joesul.li/van/beat-detection-using-web-audio/
    // for more information on this method and the sources of the algroritm
    var tempoCounts = groupNeighborsByTempo( countIntervalsBetweenNearbyPeaks( foundpeaks ) );
    tempoCounts.sort( mycomparator );                             // sort tempo's by 'score', or most neighbours
    if ( tempoCounts.length == 0 ) {
      tempoCounts[0] = { tempo: 0 }; // if no temp is found, return 0
    }else{
      // DISPLAY
      var html = ""
      tempoCounts.reverse().forEach(function(v,i) {
        html += i + ", " + v.tempo + ", " + v.count + "\t ["
        var j = 0
        while( j < v.count) {
          html += '#'
          j++
        }
        html += ']<br/>'
      })
      $('#info').html(html)
    }

    var confidence = "calibrating"
    var calibrating = false
    if ( _data[0] === undefined ) {
      calibrating = true
      $('.blink').css('background-color','rgba(150,150,150,0.5) !important')
    }else{
      calibrating = false
      var confidence_mod = tempoCounts[0].count - tempoCounts[1].count
      if ( confidence_mod <= 2 ) {
        confidence = "low"
        $('.blink').css('background-color','red')
      }else if( confidence_mod > 2 && confidence_mod <= 7) {
        confidence = "average"
        $('.blink').css('background-color','yellow')
      }else if( confidence_mod > 7 ) {
        confidence = "high"
        $('.blink').css('background-color','white')
      }
    }

    // return an object with all the necc. data.
    var tempoData = {
      bpm: tempoCounts[0].tempo,     // suggested bpm
      confidence: confidence,
      calibrating: calibrating,
      treshold: treshold,            // current treshold
      tempoCounts: tempoCounts,      // current tempoCounts
      foundpeaks:  foundpeaks,       // current found peaks
      peaks: peaks                   // all peaks, for display only
    }

    return tempoData;
  }

  // HELPERS
  // sort helper
  var mycomparator = function ( a,b ) {
    return parseInt( a.count, 10 ) - parseInt( b.count, 10 );
  }

  // generate interval counter
  var countIntervalsBetweenNearbyPeaks = function( _peaks ) {

    // reset
    intervalCounts = [];

    _peaks.forEach(function(peak, index) {
      for(var i = 0; i < 10; i++) {
        if ( _peaks[index + i] !== undefined ) {
          var interval = _peaks[index + i][0] - peak[0];
          var foundInterval = intervalCounts.some( function(intervalCount) {
            if (intervalCount.interval === interval) return intervalCount.count++;
          });
          if (!foundInterval) intervalCounts.push({ interval: interval, count: 1 });
        }
      }
    });

    return intervalCounts;
  }

  // group intervalcounts by temp
  var groupNeighborsByTempo = function( intervalCounts ) {

    // reset
    var tempoCounts = []
    var noTempo = false

    // start the interval counts
    intervalCounts.forEach(function(intervalCount, i) {

      // Convert an interval to tempo
      if (intervalCount.interval != 0 && !isNaN(intervalCount.interval)) {
        var theoreticalTempo = 60 / (intervalCount.interval / 1000)
      }

      // Adjust the tempo to fit within the 90-180 BPM range
      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      // round to 2 beat
      theoreticalTempo = Math.round( theoreticalTempo/2 ) * 2

      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo && !noTempo )
          return tempoCount.count += intervalCount.count;
      });

      // add it to the tempoCounts
      if (!foundTempo) {
        if ( theoreticalTempo && !noTempo ) {
          tempoCounts.push({
            tempo: theoreticalTempo,
            count: intervalCount.count
          })
        }
      }
    });

    return tempoCounts
  } // end groupNeighborsByTempo

} // end BPM
