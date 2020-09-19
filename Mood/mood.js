var moodList = {moods: []}
function addMood (task,mood){
    var stored = localStorage.getItem("moodBank"), thedatetoday = new Date();
    if (stored) {
        moodList = JSON.parse(stored);
    }
    moodList.moods.push({task:task, score:mood, day: thedatetoday.toDateString(), time: getPreciseTime(thedatetoday)});
    localStorage.setItem("moodBank", JSON.stringify(moodList));
}
function getPreciseTime(dateObject){
    var currentHour = dateObject.getHours() < 10 ? "0" + dateObject.getHours() : dateObject.getHours(),
        currentMinute = dateObject.getMinutes() < 10 ? "0" + dateObject.getMinutes() : dateObject.getMinutes(),
        currentSeconds = dateObject.getSeconds() < 10 ? "0" + dateObject.getSeconds() : dateObject.getSeconds();
    return currentHour+":"+currentMinute+":"+currentSeconds;
}