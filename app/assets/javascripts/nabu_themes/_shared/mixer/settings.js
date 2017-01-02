var alpha1 = 0.5; // not used ?
var alpha2 = 0.5; // not used ?
var alpha3 = 0.5; // not used ?

var autoTimeout = 0
var auto_bpm = false
var _c = 0

var trans_left = false
var trans_right = false


// shaders are written as erb files now
// ./shaders/blendmodes2.html.erb

// limit it for now?
var blendmodes = [
  [  1, "add"],
  [  2, "substract"],
  [  3, "multiply"],
  [  4, "darken"],
  [  5, "colour burn"],
  [  6, "lineair burn"],
  [  7, "lighten"],
  [  8, "screen"]
  [  9, "colour dodge"],
  [ 10, "linear dodge"],
  [ 11, "overlay"],
  [ 12, "soft light"],
  [ 13, "hard light"],
  [ 14, "vivid light"],
  [ 15, "linear light"],
  [ 16, "pin light"],
  [ 17, "difference"],
  [ 18, "exclusion"],
];

var mixes = [
  [ 1, "mix" ],
  [ 2, "hard" ],
  [ 3, "nam" ],
  [ 4, "fam" ]
]
