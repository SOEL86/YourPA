const
    START_PROMPT = document.getElementById("start-prompt"),
    PAGE_HEADING = document.getElementById("page-heading"),
    SPEECH_READOUT = document.getElementById("speech-readout"),
    TASK_TIMER = document.getElementById("task-timer"),
    MOOD_SCALE = document.getElementById("mood-scale"),
    START_BUTTON = document.getElementById("init-button"),
    FINISHED_BUTTON = document.getElementById("finished-button"),
    CANCEL_BUTTON = document.getElementById("cancel-button"),
    SETTINGS_BAR = document.getElementById("settings-bar"),
    VOICE_SELECT = document.getElementById("voice-select"),
    THEME_SWITCH = document.getElementById("theme-switch"),
    THEME_SET = document.getElementById("theme-set"),
    CHECKTASK_SET = document.getElementById("checktask-set"),
    CHECKTIME_SET = document.getElementById("checktime-set"),
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
var sentence, recognition, checkTask = false, checkTime = false, lightTheme = true, currentTask = "",
    listening = new Audio("../Shared/listening.wav"), completed = new Audio("../Shared/completed.wav"),
    SpeechRecognition = SpeechRecognition || webkitSpeechRecognition,
    SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList,
    SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

Init();
function Init() {
    stored = localStorage.getItem("theme");
    if (stored) {
        lightTheme = stored == "true" ? true : false;
        THEME_SET.checked = !lightTheme;
        document.body.classList = lightTheme ? "light" : "dark";
    } else {
        document.body.classList = "light";
    }
    stored = localStorage.getItem("checktask");
    if (stored) {
        checkTask = stored == "true" ? true : false;
        CHECKTASK_SET.checked = checkTask;
    }
    stored = localStorage.getItem("checktime");
    if (stored) {
        checkTime = stored == "true" ? true : false;
        CHECKTIME_SET.checked = checkTime;
    }
    allVoicesObtained.then(function (voices) {
        populateVoiceList();
        stored = localStorage.getItem("voice");
        if (stored) {
            VOICE_SELECT.selectedIndex = findVoice(stored).index;
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
function Start(){
    hide(START_PROMPT, START_BUTTON);
    show(PAGE_HEADING, CANCEL_BUTTON);
    Tasking();
}
function Tasking() {
    sentence = "What are you going to do?";
    PAGE_HEADING.textContent = sentence;
    getTask(function(spoken){
        if (checkTask){
            verifyInput(spoken.text,function(correct){correct.truth ? Timing(spoken.text) : Tasking()});
        } else Timing(spoken.text);
    });
}
function Timing(task){
    currentTask = task;
    sentence = "How long will it take to " + currentTask + "?";
    PAGE_HEADING.textContent = sentence;
    getTiming(function(timing){
        if (checkTime){
            verifyTimeInput(timing.number, timing.string,function(correct){correct.truth ? Counting(timing.number, timing.string) : Timing()});
        } else Counting(timing.number, timing.string);
    });
}
function Counting(timing, period){
    sentence = "I'll check back with you in " + timing + " " + period;
    PAGE_HEADING.textContent = sentence;
    show(TASK_TIMER, FINISHED_BUTTON);
    if(period == "second" || period == "seconds"){
        startTimer(currentTask, timing);
    } else if (period == "minute" || period == "minutes"){
        startTimer(currentTask, timing*60);
    } else {
        startTimer(currentTask, timing*60*60);
    }
    sayThis(sentence);
}
function Checking(){
    hide(TASK_TIMER, FINISHED_BUTTON);
    sentence = "Did you " + currentTask + "?";
    SPEECH_READOUT.textContent = "";
    PAGE_HEADING.textContent = sentence;
    getStatus(function(status){status.truth ? Mood() : Timing(currentTask)});
}
function Mood(){
    hide(TASK_TIMER,FINISHED_BUTTON,CANCEL_BUTTON);
    MOOD_SCALE.style.display = "flex";
    completed.play();
    sentence = "How did completing " + currentTask + " make you feel?";
    SPEECH_READOUT.textContent = "";
    PAGE_HEADING.textContent = sentence;
    getMood(function(mood){
        addMood(currentTask,mood.score);
        show(CANCEL_BUTTON);
        hide(MOOD_SCALE);
        Tasking();
    });
}
function getMood(callback){
    var threewords = ['great', 'fanstatic', 'amazing', 'excellent', 'perfect', 'super', 'awesome', 'really good', 'very good', 'happy', 'positive', 'cheerful', 'good', 'calm', 'relaxed', 'optimistic'],
        twowords = ['fine', 'ok', 'okay', 'not bad', 'so so', 'normal', 'average'],
        onewords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'negative', 'down', 'depressed', 'abysmal'],
        responses = threewords.concat(twowords,onewords),
        grammar = '#JSGF V1.0; grammar responses; public <response> = ' + responses.join(' | ') + ' ;',
        recognition = new SpeechRecognition(),
        speechRecognitionList = new SpeechGrammarList(),
        heardYou = false;
    speechRecognitionList.addFromString(grammar, 1);
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function() {listening.play()}
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        transcript = transcript.toLowerCase();
        SPEECH_READOUT.textContent = transcript;
        pop(SPEECH_READOUT);
        heardYou = true;
        if (threewords.includes(transcript)) {
            callback ({score: 3});
        } else if (twowords.includes(transcript)) {
            callback ({score: 2});
        } else if (onewords.includes(transcript)) {
            callback ({score: 1});
        } else {
            sayThisAndWait("Say any word or phrase meaning good, avarage or bad.", function() {
                heardYou = false;
                recognition.start();
            });
        }
    }
    recognition.onend = function(event) {
        if (!heardYou){
            sayThisAndWait(sentence, function() {
                recognition.start();
            });
        }
    }
    sayThisAndWait(sentence, function() {
        recognition.start();
    });
}
function getTask(callback){
    var heardYou = false;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function() {listening.play()}
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        transcript = transcript.toLowerCase();
        heardYou = true;
        SPEECH_READOUT.textContent = transcript;
        pop(SPEECH_READOUT);
        callback ({text: transcript});
    }
    recognition.onend = function(event) {
        if (!heardYou){
            sayThisAndWait(sentence, function() {
                recognition.start();
            });
        }
    }
    sayThisAndWait(sentence, function() {
        recognition.start();
    });
}
function getTiming(callback){
    var heardYou = false;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function() {listening.play()}
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript,
            readTime = transcript.split(" "),
            period,
            sentence = "Say a number followed by seconds, minutes, or hours",
            intervals = [ "minutes", "minute", "seconds", "second", "hours", "hour" ];
        SPEECH_READOUT.textContent = transcript;
        pop(SPEECH_READOUT);
        heardYou = true;
        if (readTime.length == 2){
            readTime[0] == "one" || readTime[0] == "a" || readTime[0] == "an" ? period = 1 : period = parseInt(readTime[0]);
            readTime[1] = readTime[1].toLowerCase();
            if (period && intervals.includes(readTime[1])) {
                callback ({number: period, string: readTime[1]});
            } else {
                PAGE_HEADING.textContent = sentence;
                sayThisAndWait(sentence,function(){recognition.start()});
            }
        } else {
            PAGE_HEADING.textContent = sentence;
            sayThisAndWait(sentence,function(){recognition.start()});
        }
    }
    recognition.onend = function(event) {
        if (!heardYou) sayThisAndWait(sentence,function(){recognition.start()});
    }
    sayThisAndWait(sentence,function(){
        recognition.start();
    });
}
function getStatus(callback){
    var positives = ['yes', 'yep', 'affirmative', 'sure', 'yup', 'yeah', 'absolutely', 'of course'],
        negatives = ['no', 'nope', 'negative', 'nah', 'no way'],
        responses = positives.concat(negatives),
        grammar = '#JSGF V1.0; grammar responses; public <response> = ' + responses.join(' | ') + ' ;',
        recognition = new SpeechRecognition(),
        speechRecognitionList = new SpeechGrammarList(),
        heardYou = false;
    speechRecognitionList.addFromString(grammar, 1);
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function() {listening.play()}
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        transcript = transcript.toLowerCase();
        SPEECH_READOUT.textContent = transcript;
        pop(SPEECH_READOUT);
        heardYou = true;
        if (transcript == "yes" || transcript == "yep" || transcript == "affirmative") {
            callback ({truth: true});
        } else if (transcript == "no" || transcript == "nope" || transcript == "negative"){
            callback ({truth: false});
        } else {
            sayThisAndWait("Please say yes, no, or cancel.", function() {
                heardYou = false;
                recognition.start();
            });
        }
    }
    recognition.onend = function(event) {
        if (!heardYou){
            sayThisAndWait(sentence, function() {
                recognition.start();
            });
        }
    }
    sayThisAndWait(sentence, function() {
        recognition.start();
    });
}
function verifyInput(response,callback){
    var positives = ['yes', 'yep', 'affirmative', 'sure', 'yup', 'yeah', 'absolutely', 'of course'],
        negatives = ['no', 'nope', 'negative', 'nah', 'no way'],
        responses = positives.concat(negatives),
        grammar = '#JSGF V1.0; grammar responses; public <response> = ' + responses.join(' | ') + ' ;',
        recognition = new SpeechRecognition(),
        speechRecognitionList = new SpeechGrammarList(),
        heardYou = false,
        sentence = "Did you say "+response+"?";
    speechRecognitionList.addFromString(grammar, 1);
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function() {listening.play()}
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript,
            sentence = "Please say yes or no.";
        transcript = transcript.toLowerCase();
        SPEECH_READOUT.textContent = transcript;
        pop(SPEECH_READOUT);
        heardYou = true;
        if (positives.includes(transcript)) {
            callback ({truth: true});
        } else if (negatives.includes(transcript)){
            callback ({truth: false});
        } else {
            PAGE_HEADING.textContent = sentence;
            sayThisAndWait(sentence, function() {
                heardYou = false;
                recognition.start();
            });
        }
    }
    recognition.onend = function(event) {
        if (!heardYou){
            PAGE_HEADING.textContent = sentence;
            sayThisAndWait(sentence, function() {
                recognition.start();
            });
        }
    }
    PAGE_HEADING.textContent = sentence;
    sayThisAndWait(sentence, function() {
        recognition.start();
    });
}
function verifyTimeInput(timing,period,callback){
    var positives = ['yes', 'yep', 'affirmative', 'sure', 'yup', 'yeah', 'absolutely', 'of course'],
        negatives = ['no', 'nope', 'negative', 'nah', 'no way'],
        responses = positives.concat(negatives),
        grammar = '#JSGF V1.0; grammar responses; public <response> = ' + responses.join(' | ') + ' ;',
        recognition = new SpeechRecognition(),
        speechRecognitionList = new SpeechGrammarList(),
        heardYou = false,
        sentence = "Did you say "+timing+" "+period+"?";
    speechRecognitionList.addFromString(grammar, 1);
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function() {listening.play()}
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript,
            sentence = "Please say yes or no.";
        transcript = transcript.toLowerCase();
        SPEECH_READOUT.textContent = transcript;
        pop(SPEECH_READOUT);
        heardYou = true;
        if (positives.includes(transcript)) {
            callback ({truth: true});
        } else if (negatives.includes(transcript)){
            callback ({truth: false});
        } else {
            PAGE_HEADING.textContent = sentence;
            sayThisAndWait(sentence, function() {
                heardYou = false;
                recognition.start();
            });
        }
    }
    recognition.onend = function(event) {
        if (!heardYou){
            PAGE_HEADING.textContent = sentence;
            sayThisAndWait(sentence, function() {
                recognition.start();
            });
        }
    }
    PAGE_HEADING.textContent = sentence;
    sayThisAndWait(sentence, function() {
        recognition.start();
    });
}

function sayThisAndWait(string, callback){
    utterance = new SpeechSynthesisUtterance(string);
    window.speechSynthesis.cancel();
    var selectedOption = VOICE_SELECT.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            utterance.voice = voices[i];
        }
    }
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
    utterance.onend = function(event) {callback();};
}
function sayThis(string){
    utterance = new SpeechSynthesisUtterance(string);
    window.speechSynthesis.cancel();
    var selectedOption = VOICE_SELECT.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            utterance.voice = voices[i];
        }
    }
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
    utterance.onend = function(event) {};
}

function toggleSettings(){
    SETTINGS_BAR.style.display == "none" ? SETTINGS_BAR.style.display = "initial" : SETTINGS_BAR.style.display = "none";
    if (VOICE_SELECT.style.display == "initial") { VOICE_SELECT.style.display = "none" }
    else if (THEME_SWITCH.style.display == "initial") THEME_SWITCH.style.display = "none";
}
function toggleVoiceSelect(){
    VOICE_SELECT.style.display == "none" ? VOICE_SELECT.style.display = "initial" : VOICE_SELECT.style.display = "none";
    if (SETTINGS_BAR.style.display == "initial") { SETTINGS_BAR.style.display = "none" }
    else if (THEME_SWITCH.style.display == "initial") THEME_SWITCH.style.display = "none";
}
function toggleThemeSwitch(){
    THEME_SWITCH.style.display == "none" ? THEME_SWITCH.style.display = "initial" : THEME_SWITCH.style.display = "none";
    if (SETTINGS_BAR.style.display == "initial") { VOICE_SELECT.style.display = "none" }
    else if (VOICE_SELECT.style.display == "initial") VOICE_SELECT.style.display = "none";
}
function switchTheme() {
    lightTheme = lightTheme ? false : true;
    document.body.classList = lightTheme ? "light" : "dark";
    localStorage.setItem("theme", lightTheme);
}
function toggleCheckTask() {
    checkTask = checkTask ? false : true;
    localStorage.setItem("checktask", checkTask);
}
function toggleCheckTime() {
    checkTime = checkTime ? false : true;
    localStorage.setItem("checktime", checkTime);
}
function changeVoice() {
    localStorage.setItem("voice", VOICE_SELECT.selectedOptions[0].getAttribute('data-name'));
}