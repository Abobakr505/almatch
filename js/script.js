const $ = (id) => document.getElementById(id);
let mMode,
  mTarget,
  mS = [0, 0],
  mOn = false,
  mDone = false,
  mTick = null,
  mEnd = 0;

// ---- pickers ----
let timeVal = 60,
  goalsVal = 4;

function changeTime(d) {
  timeVal = Math.max(5, Math.min(240, timeVal + d));
  $("time-val").textContent = timeVal;
}
function setTime(v) {
  timeVal = v;
  $("time-val").textContent = v;
}
function getTime() {
  return timeVal;
}

function changeGoals(d) {
  goalsVal = Math.max(1, Math.min(20, goalsVal + d));
  $("goals-val").textContent = goalsVal;
}
function setGoals(v) {
  goalsVal = v;
  $("goals-val").textContent = v;
}
function getGoals() {
  return goalsVal;
}

// ---- navigation ----
function go(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- match ----
function initMatch(mode, target) {
  mMode = mode;
  mTarget = target;
  mS = [0, 0];
  mOn = false;
  mDone = false;
  clearInterval(mTick);
  $("sc1").textContent = "0";
  $("sc2").textContent = "0";
  $("m-result").style.display = "none";
  $("m-startbtn").style.display = "flex";
  $("m-rematch").style.display = "none";
  $("m-newgame").style.display = "none";
  $("gb1").disabled = true;
  $("gb2").disabled = true;
  $("n1").disabled = false;
  $("n2").disabled = false;
  $("m-timer").textContent = "";
  $("m-badge").textContent =
    mode === "time" ? "⏱️ " + target + " دقيقة" : "🥅 حتى " + target + " أهداف";
  go("s-match");
}

function beginMatch() {
  mOn = true;
  $("gb1").disabled = false;
  $("gb2").disabled = false;
  $("n1").disabled = true;
  $("n2").disabled = true;
  $("m-startbtn").style.display = "none";
  if (mMode === "time") {
    mEnd = Date.now() + mTarget * 60000;
    mTick = setInterval(tick, 500);
    tick();
  }
}

function tick() {
  const r = mEnd - Date.now();
  if (r <= 0) {
    clearInterval(mTick);
    $("m-timer").textContent = "00:00";
    timeUp();
    return;
  }
  const m = Math.floor(r / 60000);
  const s = Math.floor((r % 60000) / 1000);
  $("m-timer").textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function timeUp() {
  mDone = true;
  $("gb1").disabled = true;
  $("gb2").disabled = true;
  if (mS[0] > mS[1]) showResult($("n1").value, false);
  else if (mS[1] > mS[0]) showResult($("n2").value, false);
  else showResult("تعادل!", true);
}

function goal(t) {
  if (!mOn || mDone) return;
  mS[t - 1]++;
  $(t === 1 ? "sc1" : "sc2").textContent = mS[t - 1];
  if (mMode === "goals" && mS[t - 1] >= mTarget) {
    mDone = true;
    $("gb1").disabled = true;
    $("gb2").disabled = true;
    clearInterval(mTick);
    showResult($(t === 1 ? "n1" : "n2").value, false);
  }
}

function undo(t) {
  if (!mOn || mDone) return;
  if (mS[t - 1] > 0) {
    mS[t - 1]--;
    $(t === 1 ? "sc1" : "sc2").textContent = mS[t - 1];
  }
}

function showResult(name, draw) {
  $("m-result").style.display = "block";
  $("m-banner").className = "result-banner" + (draw ? " draw" : "");
  $("m-rlbl").textContent = draw ? "🤝" : "🏆 الفائز";
  $("m-rname").textContent = name;
  $("m-rematch").style.display = "inline-flex";
  $("m-newgame").style.display = "inline-flex";
}

function rematch() {
  initMatch(mMode, mTarget);
}
function newGame() {
  clearInterval(mTick);
  go(mMode === "time" ? "s-hagz" : "s-share3");
}
function leaveMatch() {
  clearInterval(mTick);
  go("s-home");
}
