// Credit: Mateusz Rybczonec
const FULL_DASH_ARRAY = 283, WARNING_THRESHOLD = 30, ALERT_THRESHOLD = 15;
let TIME_LIMIT = 0, timePassed = 0, timeLeft = TIME_LIMIT, timerInterval = null;
function onTimesUp() {
  clearInterval(timerInterval);
}
function startTimer(task, limit) {
  clearInterval(timerInterval);
  TIME_LIMIT = 0;
  timePassed = 0;
  TIME_LIMIT = limit;
  timeLeft = TIME_LIMIT;
  timerInterval = null;
  document.getElementById("task-timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining"
        style="color: rgb(65, 184, 131)"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
</div>
`;
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      onTimesUp();
      completed.play();
      Checking(task);
    }
  }, 1000);
}

function formatTime(time) {
  var hours = Math.floor(time / 3600),
      minutes = Math.floor(time % 3600 / 60),
      seconds = Math.floor(time % 3600 % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  if (timeLeft <= ALERT_THRESHOLD) {
    document.getElementById("base-timer-path-remaining").style.color = "red";
  } else if (timeLeft <= WARNING_THRESHOLD) {
    document.getElementById("base-timer-path-remaining").style.color = "orange";
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}