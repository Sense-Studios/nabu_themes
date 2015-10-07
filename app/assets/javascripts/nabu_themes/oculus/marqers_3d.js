var Objects3d = [
  {
    "id": "1",
    "program_id": "56009b1964657647f8000005",
    "label": "label_figuur_1",
    "position_x": -800,
    "position_y": 300,
    "position_z": -400,
    "rotation_x": 0,
    "rotation_y": 1,
    "rotation_z": 0,
    "doLookAt": false,
    "post_render": function() { console.log(" -- label_figuur_1 dit post render") }
  },
  {
    "id": "2",
    "program_id": "56009b1964657647f8000005",
    "label": "label_figuur_2",
    "position_x": 800,
    "position_y": 200,
    "position_z": -300,
    "rotation_x": 0,
    "rotation_y": -1,
    "rotation_z": 0,
    "doLookAt": false,
    "post_render": function() { console.log(" -- label_figuur_2 dit post render") }
  },
  {
    "id": "3",
    "program_id": "56009b1964657647f8000005",
    "label": "youtube_embed_test",
    "position_x": 0,
    "position_y": 200,
    "position_z": 600,
    "rotation_x": 0,
    "rotation_y": 3.14,
    "rotation_z": 0,
    "doLookAt": false,
    "post_render": function() { console.log(" -- youtube_embed_test dit post render") }
  },
  {
    "id": "4",
    "program_id": "5601da6e6465763b2c00000b",
    "label": "scoreboard",
    "position_x": -600,
    "position_y": 300,
    "position_z": 100,
    "rotation_x": 0,
    "rotation_y": 1.6,
    "rotation_z": 0,
    "doLookAt": true,
    "post_render": function() {
      console.log(" -- scoreboard dit post render")
      var scores = [
        [0, 11, 14],
        [10, 11, 15],
        [26, 12, 15],
        [46, 13, 15],
        [76, 14, 15]
      ]

      setInterval(function() {
        var currentScore = scores[0]
        $.each(scores, function(i, score) {
          if ( score[0] < video.currentTime ) {
            currentScore = score
          }
        })

        $('#scoreboard a:eq(0)').text(currentScore[1])
        $('#scoreboard a:eq(1)').text(currentScore[2])

        //console.log(currentScore)
      }, 500)

     }
  },
  {
    "id": "5",
    "program_id": "5601da6e6465763b2c00000b",
    "label": "pavilion_site",
    "position_x": 1300,
    "position_y": -400,
    "position_z": -600,
    "rotation_x": 0,
    "rotation_y": -1,
    "rotation_z": 0,
    "doLookAt": true,
    "post_render": function() {
      console.log(" -- pavilion_site dit post render")
      setTimeout( function() {
        $('#pavilion_site iframe').attr('src', $('#pavilion_site iframe').data('src'))
      }, 3000)
    }
  },
  {
    "id": "6",
    "program_id": "5601da6e6465763b2c00000b",
    "label": "youtube_holland_casino",
    "position_x": 400,
    "position_y": 400,
    "position_z": 350,
    "rotation_x": 0,
    "rotation_y": 3.14,
    "rotation_z": 0,
    "doLookAt": true,
    "post_render": function() { console.log(" -- youtube_holland_casino dit post render") }
  },
  {
    "id": "7",
    "program_id": "5601da6e6465763b2c00000b",
    "label": "youtube_sphericam",
    "position_x": -200,
    "position_y": 400,
    "position_z": 400,
    "rotation_x": 0,
    "rotation_y": 3.14,
    "rotation_z": 0,
    "doLookAt": true,
    "post_render": function() { console.log(" -- youtube_sphericam dit post render") }
  }
]
