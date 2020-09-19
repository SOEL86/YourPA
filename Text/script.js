const SETTINGS_BAR = document.getElementById("settings-bar"),
      VOICE_SELECT = document.getElementById("voice-select"),
      THEME_SWITCH = document.getElementById("theme-switch"),
      PAGE_HEADING = document.getElementById("page-heading"),
      TASK_TIMER = document.getElementById("task-timer"),
      MOOD_SCALE = document.getElementById("mood-scale"),
      BUTTON_BAR = document.getElementById("button-bar"),
      ADD_BUTTON = document.getElementById("add-button"),
      CANCEL_BUTTON = document.getElementById("cancel-button"),
      DELETE_BUTTON = document.getElementById("delete-button"),
      START_BUTTON = document.getElementById("start-button"),
      READY_BUTTON = document.getElementById("ready-button"),
      FINISHED_BUTTON = document.getElementById("finished-button"),
      YES_BUTTON = document.getElementById("yes-button"),
      NO_BUTTON = document.getElementById("no-button"),
      TIME_SELECT = document.getElementById("time-select"),
      QUANTITY_OPTION = document.getElementById("quantity-option"),
      INTERVAL_OPTION = document.getElementById("interval-option"),
      SPEECH_SET = document.getElementById("speech-set"),
      THEME_SET = document.getElementById("theme-set"),
      allVoicesObtained = new Promise(function(resolve, reject) {
          let voices = window.speechSynthesis.getVoices();
            if (voices.length !== 0) {
            resolve(voices);
        } else {
            window.speechSynthesis.addEventListener("voiceschanged", function() {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            });
        }
      });

var tasks = [], doing = "", lightTheme = true, completed = new Audio("../Shared/completed.wav"), speech = true;
Init();
function Init() {
    var stored = localStorage.getItem("tasks")
    if (stored) {
        tasks = JSON.parse(stored);
        tasks.forEach(populateList);
    }
    stored = localStorage.getItem("theme");
    if (stored) {
        lightTheme = stored == "true" ? true : false;
        THEME_SET.checked = !lightTheme;
        document.body.classList = lightTheme ? "light" : "dark";
    } else {
        document.body.classList = "light";
    }
    stored = localStorage.getItem("speech");
    if (stored) {
        speech = stored == "true" ? true : false;
        SPEECH_SET.checked = speech;
    }
    allVoicesObtained.then(function (voices) {
        populateVoiceList();
        stored = localStorage.getItem("voice");
        if (stored) {
            VOICE_SELECT.selectedIndex =findVoice(stored).index;
        }
    });

}
function findVoice(stored) {
    var i, option;
    for (i = 0; i < VOICE_SELECT.length; i++){
        option = VOICE_SELECT.options[i];
        if (option.textContent == stored) return option;
    }
}
function Add() {
    var a = prompt("What do you want to do?", "wash car");
    if (a) addToList(a);
}
function populateList(a) {
    var li = document.createElement("li");
    li.textContent = a;
    li.onclick = function(){selectTask(a, li)};
    document.body.appendChild(li);
}
function addToList(a) {
    populateList(a);
    tasks.push(a);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function selectTask(a, e) {
    deselectTask();
    show(DELETE_BUTTON, START_BUTTON);
    DELETE_BUTTON.onclick = function(){Delete(e)};
    e.id = "selected";
    doing = a;
}
function deselectTask() {
    var e = document.getElementById("selected");
    hide(DELETE_BUTTON, START_BUTTON);
    if (e) e.id = "";
    doing = "";
}
function Delete() {
    var e = document.getElementById("selected"),
        i = tasks.indexOf(doing);
    if (i > -1) {
       tasks.splice(i, 1);
       localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    hide(DELETE_BUTTON);
    e.remove();
    deselectTask();
}
function toggleSettings( ){
    SETTINGS_BAR.style.display == "none" ? SETTINGS_BAR.style.display = "initial" : SETTINGS_BAR.style.display = "none";
    if (VOICE_SELECT.style.display == "initial") { VOICE_SELECT.style.display = "none" }
    else if (THEME_SWITCH.style.display == "initial") THEME_SWITCH.style.display = "none";
}
function toggleVoiceSelect() {
    VOICE_SELECT.style.display == "none" ? VOICE_SELECT.style.display = "initial" : VOICE_SELECT.style.display = "none";
    if (SETTINGS_BAR.style.display == "initial") { SETTINGS_BAR.style.display = "none" }
    else if (THEME_SWITCH.style.display == "initial") THEME_SWITCH.style.display = "none";
}
function toggleThemeSwitch() {
    THEME_SWITCH.style.display == "none" ? THEME_SWITCH.style.display = "initial" : THEME_SWITCH.style.display = "none";
    if (SETTINGS_BAR.style.display == "initial") { VOICE_SELECT.style.display = "none" }
    else if (VOICE_SELECT.style.display == "initial") VOICE_SELECT.style.display = "none";
}
function switchTheme() {
    lightTheme = lightTheme ? false : true;
    document.body.classList = lightTheme ? "light" : "dark";
    localStorage.setItem("theme", lightTheme);
}
function toggleSpeech() {
    speech = speech ? false : true;
    localStorage.setItem("speech", speech);
}
function changeVoice() {
    localStorage.setItem("voice", VOICE_SELECT.selectedOptions[0].getAttribute('data-name'));
}
function Start() {
    var sentence = "How long will it take to " + doing + "?";
    if (speech) sayThis(sentence);
    hide(DELETE_BUTTON, START_BUTTON, ADD_BUTTON);
    show(CANCEL_BUTTON, READY_BUTTON, TIME_SELECT);
    PAGE_HEADING.textContent = sentence;
    exitList();
}
function exitList() {
    var list = document.getElementsByTagName("li");
    while (list[0]) list[0].parentNode.removeChild(list[0]);
}
function Ready() {
    var sentence = "I'll check back with you in " + QUANTITY_OPTION.value + " " + INTERVAL_OPTION.value + ".";
    if (speech) sayThis(sentence);
    hide(READY_BUTTON, TIME_SELECT);
    show(FINISHED_BUTTON, TASK_TIMER);
    PAGE_HEADING.textContent = sentence;
    if(INTERVAL_OPTION.value == "seconds"){
        startTimer(doing, QUANTITY_OPTION.value);
    } else if(INTERVAL_OPTION.value == "minutes"){
        startTimer(doing, QUANTITY_OPTION.value*60);
    } else {
        startTimer(doing, QUANTITY_OPTION.value*60*60);
    }
}
function Finished() {
    i = tasks.indexOf(doing);
    if (i > -1) {
       tasks.splice(i, 1);
       localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    document.location.reload(false);
}
function Checking() {
    var sentence = "Did you " + doing + "?";
    if (speech) sayThis(sentence);
    show(YES_BUTTON, NO_BUTTON);
    hide(FINISHED_BUTTON, TASK_TIMER);
    PAGE_HEADING.textContent = sentence;
}
function Mood(){
    hide(TASK_TIMER,FINISHED_BUTTON,CANCEL_BUTTON);
    MOOD_SCALE.style.display = "flex";
    completed.play();
    sentence = "How did completing " + doing + " make you feel?";
    PAGE_HEADING.textContent = sentence;
    sayThis(sentence);
}
function sayThis(string){
    var utterance = new SpeechSynthesisUtterance(string), selectedOption = VOICE_SELECT.selectedOptions[0].getAttribute('data-name');
    window.speechSynthesis.cancel();
    for(i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            utterance.voice = voices[i];
        }
    }
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
    utterance.onend = function() {};
}