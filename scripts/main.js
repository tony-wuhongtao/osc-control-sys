function cue() {
  var cues = document.getElementsByName('cueGroup');
  var cueButton = document.getElementById('cueButton');
  d3.cue(cues[0].value, cues[1].value, cues[2].value);
}
