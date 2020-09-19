var tasks, menuArea = document.getElementById("menu"), heading1 = document.getElementById("heading1"), heading2 = document.getElementById("heading2"), addBtn = document.getElementById("addBtn"), heading3 = document.getElementById("heading3"), heading4 = document.getElementById("heading4"), nowBtn = document.getElementById("nowBtn"), laterBtn = document.getElementById("laterBtn"), minDisplay = document.getElementById("minDisplay"), selectMins = document.getElementById("selectMins"), heading5 = document.getElementById("heading5"), heading6 = document.getElementById("heading6"), taskSelect = document.getElementById("tasks"), readyBtn = document.getElementById("readyBtn"), waitBtn = document.getElementById("waitBtn"), heading7 =  document.getElementById("heading7"), heading8 = document.getElementById("heading8"), okBtn = document.getElementById("okBtn"), backBtn = document.getElementById("backBtn"), finishBtn = document.getElementById("finishBtn"), cancelBtn = document.getElementById("cancelBtn"), heading9 =  document.getElementById("heading9"), heading10 = document.getElementById("heading10"), currentTask, countDown = document.getElementById("app"), heading13 = document.getElementById("heading13"), returnBtn = document.getElementById("returnBtn"), minOut = document.getElementById("minOut"), deleteBtn = document.getElementById("deleteBtn"), nextBtn = document.getElementById("nextBtn"), yesBtn = document.getElementById("yesBtn"), noBtn = document.getElementById("noBtn");
function Initialise () {
    heading2.style.display = "none";
}
function Add() {
    myTask = prompt("What do you want to do?", "Wash car");
    if (myTask) {
        addToList(myTask);
        sayThis(myTask);
    }
}
function addToList(myTask) {
    populateList(myTask);
    if (tasks.length == 0) {
        Initialise();
    }
    tasks.push(myTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function selectTask(taskDesc, targetItem){
    console.log(taskDesc == "take a break");
    deselectTask();
    if (taskDesc !== "take a break") {
        deleteBtn.style.display = "initial";
        deleteBtn.onclick = function(){delItem(targetItem)};
    }
    readyBtn.style.display = "initial";
    targetItem.id = "selected";
    currentTask = taskDesc;
}
function deselectTask(){
    targetItem = document.getElementById("selected");
    deleteBtn.style.display = "none";
    readyBtn.style.display = "none";
    if(targetItem){
        targetItem.id = "";
    }
}
function delItem(targetItem){
    var index = tasks.indexOf(targetItem.innerHTML);
    if (index > -1) {
       tasks.splice(index, 1);
       localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    deleteBtn.style.display = "none";
    targetItem.remove();
    if (tasks.length == 0) {
        heading2.style.display = "initial";
    }
    deselectTask();
}
function stepTwo(){
    //Step 1 -> 2
    deselectTask();
    //heading1.style.display = "none";
    heading2.style.display = "none";
    //heading3.style.display = "initial";
    heading4.style.display = "initial";
    nowBtn.style.display = "initial";
    //laterBtn.style.display = "initial";
    minDisplay.style.display = "initial";
    selectMins.style.display = "initial";
    sayThis("When do you want to start?");
}
function exitList(){
    var list = document.getElementsByTagName("li");
    while (list[0]) list[0].parentNode.removeChild(list[0]);
    addBtn.style.display = "none";
    //nextBtn.style.display = "none";
}
function Now() {
    //Step 2 -> 3a
    //heading3.style.display = "none";
    heading4.style.display = "none";
    nowBtn.style.display = "none";
    //laterBtn.style.display = "none";
    minDisplay.style.display = "none";
    selectMins.style.display = "none";
    
    //heading5.style.display = "initial";
    heading6.style.display = "initial";
    //taskSelect.style.display = "initial";
    //readyBtn.style.display = "initial";
    //waitBtn.style.display = "initial";
    tasks.forEach(populateList);
    populateList("take a break");
    addBtn.style.display = "initial";
    sayThis("What are you going to do?");
}
function Wait() {
    //Step 3a -> 2
    //heading5.style.display = "none";
    heading6.style.display = "none";
    taskSelect.style.display = "none";
    //readyBtn.style.display = "none";
    //waitBtn.style.display = "none";
    exitList();
    stepTwo();
}
function Ready() {
    howLong(currentTask);
    deselectTask();
}
function howLong(taskDesc) {
    //Step 3a. -> 4
    currentTask = taskDesc;
    //heading5.style.display = "none";
    heading6.style.display = "none";
    noBtn.style.display = "none";
    yesBtn.style.display = "none";
    heading13.style.display = "none";
    //taskSelect.style.display = "none";
    exitList();
    //readyBtn.style.display = "none";
    //waitBtn.style.display = "none";
    
    //heading7.style.display = "initial";
    heading8.style.display = "initial";
    minDisplay.style.display = "initial";
    selectMins.style.display = "initial";
    okBtn.style.display = "initial";
    backBtn.style.display = "initial";
    heading8.innerHTML = "How long will it take to <span>" + currentTask + "</span>?";
    sayThis("How long will it take to " + currentTask + "?");
}
function Back(){
    //Step 4. -> 3a.
    //heading7.style.display = "none";
    heading8.style.display = "none";
    minDisplay.style.display = "none";
    selectMins.style.display = "none";
    okBtn.style.display = "none";
    backBtn.style.display = "none";
    
    //heading5.style.display = "initial";
    heading6.style.display = "initial";
    addBtn.style.display = "initial";
    //taskSelect.style.display = "initial";
    //readyBtn.style.display = "initial";
    //waitBtn.style.display = "initial";
    
    tasks.forEach(populateList);
    populateList("take a break");
    sayThis("What are you going to do?");
}
function Okay(time){
    var sentence;
    time = parseInt(time);
    if (time == 1){
        sentence = "I'll check back with you in 1 minute";
    } else {
        sentence = "I'll check back with you in "+time+" minutes";
    }
    //heading7.style.display = "none";
    heading8.style.display = "none";
    minDisplay.style.display = "none";
    selectMins.style.display = "none";
    okBtn.style.display = "none";
    backBtn.style.display = "none";
    
    //heading9.style.display = "initial";
    heading10.style.display = "initial";
    finishBtn.style.display = "initial";
    cancelBtn.style.display = "initial";
    countDown.style.display = "initial";
 
    heading10.innerHTML = sentence;
    sayThis(sentence);

    startTimer(time*60);
}
function Later(time){
    var sentence;
    time = parseInt(time);
    if (time == 1){
        sentence = "I'll check back with you in 1 minute";
    } else {
        sentence = "I'll check back with you in "+time+" minutes";
    }
    //heading3.style.display = "none";
    heading4.style.display = "none";
    minDisplay.style.display = "none";
    selectMins.style.display = "none";
    nowBtn.style.display = "none";
    //laterBtn.style.display = "none";
    
    heading10.style.display = "initial";
    heading13.style.display = "initial";
    returnBtn.style.display = "initial";
    countDown.style.display = "initial";
 
    heading10.innerHTML = sentence;
    sayThis(sentence);

    startTimer(time*60);
}
function Return() {
    heading10.style.display = "none";
    heading13.style.display = "none";
    returnBtn.style.display = "none";
    countDown.style.display = "none";
    
    //heading5.style.display = "initial";
    heading6.style.display = "initial";
    addBtn.style.display = "initial";
    //taskSelect.style.display = "initial";
    //readyBtn.style.display = "initial";
    //waitBtn.style.display = "initial";
    
    
    tasks.forEach(populateList);
    populateList("take a break");
    sayThis("What are you going to do?");
    onTimesUp();
}

function Finished() {
    console.log(currentTask, "complete");
    //remove task from list if not "take a break"
    //say congratulations! taskName complete.
    //heading9.style.display = "none";
    heading10.style.display = "none";
    finishBtn.style.display = "none";
    cancelBtn.style.display = "none";
    countDown.style.display = "none";
    noBtn.style.display = "none";
    yesBtn.style.display = "none";
    heading13.style.display = "none";
    
    //heading5.style.display = "initial";
    heading6.style.display = "initial";
    addBtn.style.display = "initial";
    //taskSelect.style.display = "initial";
    //readyBtn.style.display = "initial";
    //waitBtn.style.display = "initial";
    


    if (currentTask !== "take a break"){
        var index = tasks.indexOf(currentTask), length = taskSelect.options.length;
        if (index > -1) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        tasks.forEach(populateList);
        for (i = length-1; i >= 0; i--) {
            if (taskSelect.options[i].textContent == currentTask){
                taskSelect.options[i] = null;
            }
        }
    }
    populateList("take a break");
    sayThis("Congratulations!"+ currentTask +" is complete. What are you going to do next?");
    onTimesUp();
}
function Cancel() {
    console.log("Iwozere");
    //heading9.style.display = "none";
    heading10.style.display = "none";
    finishBtn.style.display = "none";
    cancelBtn.style.display = "none";
    countDown.style.display = "none";
    
    //heading5.style.display = "initial";
    heading6.style.display = "initial";
    addBtn.style.display = "initial";
    //taskSelect.style.display = "initial";
    //readyBtn.style.display = "initial";
    //waitBtn.style.display = "initial";
    tasks.forEach(populateList);
    populateList("take a break");
    sayThis("What are you going to do?");
    onTimesUp();
}
function Status() {
    var sentence = "Did you "+currentTask+"?"
    heading10.style.display = "none";
    finishBtn.style.display = "none";
    cancelBtn.style.display = "none";
    countDown.style.display = "none";
    
    heading13.style.display = "initial";
    yesBtn.style.display = "initial";
    noBtn.style.display = "initial";
 
    heading13.innerHTML = sentence;
    sayThis(sentence);
}
function startOver() {
    //Step 3a -> 1
    //heading5.style.display = "none";
    heading6.style.display = "none";
    taskSelect.style.display = "none";
    //readyBtn.style.display = "none";
    //waitBtn.style.display = "none";
    
    exitList();
    Initialise();
    tasks.forEach(populateList);
}
function sayThis(string){
    var utterance = new SpeechSynthesisUtterance(string);
    window.speechSynthesis.cancel();
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            utterance.voice = voices[i];
        }
    }
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
    console.log(utterance);
}
function populateList(myTask){
    var li = document.createElement("li");
    li.innerHTML = myTask;
    li.onclick = function(){selectTask(myTask, li)};
    document.body.appendChild(li);
}
function updateMins(mins){
    minOut.innerHTML = mins;
    //laterBtn.innerHTML = mins+ " minutes";
    okBtn.innerHTML = mins+ " minutes";
}
if(localStorage.length){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks.length) {
        Initialise();
        tasks.forEach(populateList);
        for(i = 0; i < tasks.length ; i++) {
            var option = document.createElement('option');
            option.textContent = tasks[i];
            taskSelect.appendChild(option);
        }
        //nextBtn.style.display = "initial";
    } else {
        heading2.style.display = "initial";
    }
} else {
    tasks = [];
}