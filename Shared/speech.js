var synth = window.speechSynthesis, voices = [];

function populateVoiceList() {
  var selectedIndex = 0, stored, object;
  voices = synth.getVoices();
  VOICE_SELECT.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name;
    if(voices[i].name == "Google UK English Female") {
        selectedIndex = i;
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    VOICE_SELECT.appendChild(option);
  }
  VOICE_SELECT.selectedIndex = selectedIndex;
}