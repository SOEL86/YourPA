const HAPPY_FACE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.7 121.7"><path class="good" d="M60.8 121.7c-33.5 0-60.8-27.3-60.8-60.8C0 27.3 27.3 0 60.8 0s60.8 27.3 60.8 60.8C121.7 94.4 94.4 121.7 60.8 121.7zM60.8 6C30.6 6 6 30.6 6 60.8c0 30.2 24.6 54.8 54.8 54.8s54.8-24.6 54.8-54.8C115.7 30.6 91.1 6 60.8 6z"/><path d="M60.6 100.4c-10 0-18.2-7.3-18.2-16.2h6c0 5.6 5.5 10.2 12.2 10.2 6.7 0 12.2-4.6 12.2-10.2h6C78.8 93.2 70.7 100.4 60.6 100.4z"/><path d="M46.4 66.2h-6c0-5.4-3.7-9.9-8.2-9.9s-8.2 4.4-8.2 9.9h-6c0-8.7 6.4-15.9 14.2-15.9S46.4 57.5 46.4 66.2z"/><path d="M103.8 66.2h-6c0-5.4-3.7-9.9-8.2-9.9s-8.2 4.4-8.2 9.9h-6c0-8.7 6.4-15.9 14.2-15.9S103.8 57.5 103.8 66.2z"/></svg>',
      NORMAL_FACE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.7 121.7" onclick="addMood(doing,2);hide(MOOD_SCALE);Finished();"><path class="average" d="M60.8 121.7c-33.5 0-60.8-27.3-60.8-60.8C0 27.3 27.3 0 60.8 0s60.8 27.3 60.8 60.8C121.7 94.4 94.4 121.7 60.8 121.7zM60.8 6C30.6 6 6 30.6 6 60.8c0 30.2 24.6 54.8 54.8 54.8s54.8-24.6 54.8-54.8C115.7 30.6 91.1 6 60.8 6z"/><circle cx="26.8" cy="60.8" r="8.4"/><circle cx="94.8" cy="60.8" r="8.4"/><rect x="44.3" y="87.8" width="33" height="6"/></svg>',
      SAD_FACE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.7 121.7" onclick="addMood(doing,1);hide(MOOD_SCALE);Finished();"><path class="bad" d="M60.8 121.7C27.3 121.7 0 94.4 0 60.8 0 27.3 27.3 0 60.8 0s60.8 27.3 60.8 60.8C121.7 94.4 94.4 121.7 60.8 121.7zM60.8 6C30.6 6 6 30.6 6 60.8c0 30.2 24.6 54.8 54.8 54.8s54.8-24.6 54.8-54.8C115.7 30.6 91.1 6 60.8 6z"/><path d="M78.8 97.4h-6c0-5.6-5.5-10.2-12.2-10.2s-12.2 4.6-12.2 10.2h-6c0-8.9 8.2-16.2 18.2-16.2S78.8 88.5 78.8 97.4z"/><path d="M32.1 69.2c-7.9 0-14.2-7.1-14.2-15.9h6c0 5.4 3.7 9.9 8.2 9.9s8.2-4.4 8.2-9.9h6C46.4 62.1 40 69.2 32.1 69.2z"/><path d="M89.5 69.2c-7.9 0-14.2-7.1-14.2-15.9h6c0 5.4 3.7 9.9 8.2 9.9s8.2-4.4 8.2-9.9h6C103.8 62.1 97.4 69.2 89.5 69.2z"/></svg>';
var moodList = {moods: []},previousDay = "DayZero";
loadMoods();
function loadMoods(){
    var stored = localStorage.getItem("moodBank");
    if (stored) {
        moodList = JSON.parse(stored);
        moodList.moods.forEach(populateMoodList);
    } else {
        console.log("no tasks completed");
    }
}
function populateMoodList(a){
    var li = document.createElement("li"), face, thisDay;
    console.log(previousDay, a.day);
    if (previousDay !== a.day){
        li.innerHTML = "<div>"+a.day+"</div><div class='titleBar'><h1>title</h1><h2>time</h2><h3>mood</h3></div>";
        document.body.appendChild(li);
        li = document.createElement("li");
        previousDay = a.day;
    }
    if (a.score == 3) face = HAPPY_FACE;
    if (a.score == 2) face = NORMAL_FACE;
    if (a.score == 1) face = SAD_FACE;
    li.innerHTML = "<div class='moodReadout'><h1>" + a.task + "</h1><h2>" + a.time + "</h2>" + face + "</div>";
    document.body.appendChild(li);
}
