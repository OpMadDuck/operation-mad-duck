/**
 * The HTML formatted CSS style block which includes global styling
 * for all HTML responses.
 */
const style = `
<style>
body {
  background-color: #F5F5F7;
  color: #1d1d1f;
  font-family: system-ui;
  height: 100%;
  margin: 0;
  /* UPDATE: Logo Resizing */
  background-image: url('https://raw.githubusercontent.com/OpMadDuck/operation-mad-duck/d927955357373be2d3b129734c25de23c6c77417/mad-duck-toc-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  /* Logo limited to 50% width of screen */
  width: 100%;
}

h1 {
  background-color: white;
  border-radius: 18px;
  color: black;
  padding: 18px;
  text-align: center;
}
h2 {
  background-color: green;
  border-radius: 18px;
  color: white;
  padding: 18px;
  text-align: center;
  cursor: pointer;
}
/* UPDATE: Glassmorphism and Visual Depth */
table {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-collapse: collapse;
  border-radius: 18px;
  color: black;
  margin: 18px;
  min-width: 100%;
  padding: 18px;
  text-align: left;
}
th, td {
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid #F5F5F7;
  border-collapse: collapse;
  overflow: hidden;
  padding: 7px;
  text-overflow: ellipsis;
}
.container {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
}
.subcontainer {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 95%;
  min-width: 85%;
  text-align:center;
}
/* UPDATE: Stretches to fit window/screen and glassmorphism */
.controls-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(5px);
    border-radius: 18px;
    width: 100%; 
    box-sizing: border-box;
}
/* UPDATE: Buttons Centered */
.button-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%; 
}
#timerDisplay {
    font-size: 2.5em;
    font-weight: bold;
    margin-top: 10px;
    color: #1d1d1f;
}
.reveal-btn, .control-btn {
    border: none;
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    color: white;
}
.reveal-btn {
    background-color: #ff9500; /* Orange */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 1.5em;
}
.reveal-btn:disabled, .control-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
#startTimerBtn {
    background-color: #007AFF; /* Blue */
    border-radius: 50%;
    width: 100px;
    height: 100px;
    font-size: 1em;
}
#startTimerBtn:disabled {
    background-color: #cccccc;
}
.pause-btn { background-color: #ff3b30; } /* Red */
.resume-btn { background-color: #34c759; } /* Green */
.refresh-btn-on { background-color: #34c759; } /* Green */
.refresh-btn-off { background-color: #ff3b30; } /* Red */
.reset-flag-btn { background-color: #5856d6; } /* Indigo */

/* UPDATE: Capture button yellow and opaque */
.capture-btn { 
    background-color: #FFFF00 !important; 
    color: #000000 !important; 
    width: 100%; 
    margin-top:10px; 
    opacity: 1 !important;
} 

#winnerAnnouncer {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    font-size: 5vw;
    font-weight: bold;
    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.close-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    font-size: 50px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    line-height: 1;
}
</style>
`;

/**
 * flagPage consumes a flag object and returns a response body as a string.
 */
const flagPage = (flag) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | ${flag.name} Flag</title>
    ${style}
  </head>
  <body>
    <div class="container">
      <div class="subcontainer">
        <h1>${flag.name} Flag</h1>
        <h2>Capture!</h2>
      </div>
    </div>
    <script>
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get("id");
      window.history.replaceState(null, "", "/");
      const captureFlag = (contract) => {
        if (!contract) return;
        const payload = { contract };
        fetch("/capture?id=" + id, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" }
        }).then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            alert("Capture failed.\\n" + errorText);
          } else {
            window.location.replace("/confirm");
          }
        }).catch((err) => {
          alert("Unexpected error submitting contract: " + err.message);
        });
      };
      const requestContract = () => {
        const contract = prompt("Please enter your team's contract:");
        captureFlag(contract);
      };
      document.querySelector("h2").addEventListener("click", requestContract);
    </script>
  </body>
</html>
`;

/**
 * boardPage consumes an array of all flag objects and returns a response
 * body as a string.
 */
const boardPage = (flags) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Score Board</title>
    ${style}
  </head>
  <body>
    <div class="container">
      <div class="subcontainer">
        <table id="mainTable">
          <thead>
            <tr>
              <th style="width:15%">Name</th>
              <th style="width:65%">Contracts</th>
              <th style="width:10%">Red</th>
              <th style="width:10%">Blue</th>
            </tr>
          </thead>
          <tbody id='scoreBoard'>
          </tbody>
          <tr>
            <th></th>
            <th></th>
            <th id='redSum'></th>
            <th id='blueSum'></th>
          </tr>
        </table>
        <div class="controls-container">
            <div class="button-row">
                <div id="timerDisplay">30:00</div>
                <button id="startTimerBtn">Start Timer</button>
                <button id="revealChargersBtn" class="reveal-btn">1</button>
                <button id="revealRavensBtn" class="reveal-btn">2</button>
            </div>
            <div class="button-row">
                <button id="pauseResumeBtn" class="control-btn"></button>
                <button id="toggleRefreshBtn" class="control-btn"></button>
                <button id="resetChargersBtn" class="control-btn reset-flag-btn">Reset 1</button>
                <button id="resetRavensBtn" class="control-btn reset-flag-btn">Reset 2</button>
            </div>
            <button id="screenCaptureBtn" class="control-btn capture-btn">📷 Screen Capture (Copy Table)</button>
        </div>
      </div>
     </div>
    <div id="winnerAnnouncer">
        <span class="close-btn">&times;</span>
        <span id="winnerText"></span>
    </div>
  </body>
  <script>
    const flags = ${flags}
    
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    const scoreBoard = document.querySelector("#scoreBoard")
    var redSum = 0
    var blueSum = 0

    flags.forEach((flag) => {
      var row = document.createElement("tr");
      row.id = 'flag-row-' + flag.name; 

      var name = document.createElement("td");
      var contracts = document.createElement("td");
      var red = document.createElement("td");
      var blue = document.createElement("td");
      
      name.innerHTML = flag.name;

      if (flag.name === 'Chargers' && localStorage.getItem('chargersRevealed') !== 'true') {
          row.style.display = 'none';
      }
      if (flag.name === 'Ravens' && localStorage.getItem('ravensRevealed') !== 'true') {
          row.style.display = 'none';
      }

      let winningContractID;
      if(flag.winner) {
        let winnerArray = flag.winner.split(',');
        winningContractID = parseInt(winnerArray[1]);
        let pointsAwarded;
        let winningTeamColor;

        if (winnerArray[0] === 'red') {
          pointsAwarded = flag.points.red_capture;
          winningTeamColor = 'red';
        } else if (winnerArray[0] === 'blue') {
          pointsAwarded = flag.points.blue_capture;
          winningTeamColor = 'blue';
        }

        if (pointsAwarded) {
          redSum += pointsAwarded.red;
          blueSum += pointsAwarded.blue;
          red.innerHTML = pointsAwarded.red;
          blue.innerHTML = pointsAwarded.blue;
          
          /* RESTORED: This turns the row cells red or blue based on the winning team */
          const cells = [name, contracts, red, blue];
          cells.forEach(cell => {
              cell.style.backgroundColor = winningTeamColor;
              cell.style.color = 'white';
              cell.style.fontWeight = 'bold';
          });
        }
      }

      for (let i = 0; i < flag.contracts.length; i++) {
        if (i === winningContractID) {
          contracts.innerHTML += '<strong>' + flag.times[i] + 'Z - ' + escapeHtml(flag.contracts[i]) + '</strong><br>';
        } else {
          contracts.innerHTML += '<em>' + flag.times[i] + 'Z - ' + escapeHtml(flag.contracts[i]) + '</em><br>';
        }
      }

      row.appendChild(name);
      row.appendChild(contracts);
      row.appendChild(red);
      row.appendChild(blue);
      scoreBoard.appendChild(row);
    });

    document.querySelector("#redSum").innerHTML = redSum;
    document.querySelector("#blueSum").innerHTML = blueSum;

    const revealChargersBtn = document.querySelector("#revealChargersBtn");
    const revealRavensBtn = document.querySelector("#revealRavensBtn");
    const resetChargersBtn = document.querySelector("#resetChargersBtn");
    const resetRavensBtn = document.querySelector("#resetRavensBtn");
    const startBtn = document.querySelector("#startTimerBtn");
    const pauseResumeBtn = document.querySelector("#pauseResumeBtn");
    const timerDisplay = document.querySelector("#timerDisplay");
    const winnerAnnouncer = document.querySelector("#winnerAnnouncer");
    const winnerTextElement = document.querySelector("#winnerText");
    const closeBtn = document.querySelector(".close-btn");
    const toggleRefreshBtn = document.querySelector("#toggleRefreshBtn");
    const screenCaptureBtn = document.querySelector("#screenCaptureBtn");
    let timerInterval;

    screenCaptureBtn.addEventListener("click", () => {
        const table = document.querySelector("#mainTable");
        const range = document.createRange();
        range.selectNode(table);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        try {
            document.execCommand('copy');
            alert("Scoreboard copied to clipboard! You can paste it into Excel or Email.");
        } catch(err) {
            alert("Failed to copy table.");
        }
        window.getSelection().removeAllRanges();
    });

    if (localStorage.getItem('chargersRevealed') === 'true') revealChargersBtn.disabled = true;
    else revealChargersBtn.addEventListener("click", () => { localStorage.setItem('chargersRevealed', 'true'); window.location.reload(); });
    
    if (localStorage.getItem('ravensRevealed') === 'true') revealRavensBtn.disabled = true;
    else revealRavensBtn.addEventListener("click", () => { localStorage.setItem('ravensRevealed', 'true'); window.location.reload(); });

    resetChargersBtn.addEventListener('click', () => { localStorage.removeItem('chargersRevealed'); window.location.reload(); });
    resetRavensBtn.addEventListener('click', () => { localStorage.removeItem('ravensRevealed'); window.location.reload(); });

    const autoRefreshEnabled = localStorage.getItem('autoRefresh') !== 'false';
    if (autoRefreshEnabled) {
        setTimeout(() => window.location.reload(), 15000);
        toggleRefreshBtn.textContent = 'Auto-Refresh: On';
        toggleRefreshBtn.className = 'control-btn refresh-btn-on';
    } else {
        toggleRefreshBtn.textContent = 'Auto-Refresh: Off';
        toggleRefreshBtn.className = 'control-btn refresh-btn-off';
    }
    toggleRefreshBtn.addEventListener('click', () => {
      localStorage.setItem('autoRefresh', !autoRefreshEnabled);
      window.location.reload();
    });

    const startInitialCountdown = () => {
        const thirtyMinutes = 30 * 60 * 1000;
        const endTime = new Date().getTime() + thirtyMinutes;
        localStorage.setItem('timerEndTime', endTime);
        localStorage.removeItem('pausedTime');
        window.location.reload();
    };

    const pauseTimer = () => {
        const endTime = parseInt(localStorage.getItem('timerEndTime'), 10);
        const remainingTime = endTime - new Date().getTime();
        if (remainingTime > 0) {
            localStorage.setItem('pausedTime', remainingTime);
        }
        localStorage.removeItem('timerEndTime');
        window.location.reload();
    };

    const resumeTimer = () => {
        const pausedTime = parseInt(localStorage.getItem('pausedTime'), 10);
        if (pausedTime > 0) {
            const newEndTime = new Date().getTime() + pausedTime;
            localStorage.setItem('timerEndTime', newEndTime);
        }
        localStorage.removeItem('pausedTime');
        window.location.reload();
    };
    
    const announceWinner = () => {
        let winnerText = "THE WINNER IS ";
        if (redSum > blueSum) winnerText += "RED TEAM";
        else if (blueSum > redSum) winnerText += "BLUE TEAM";
        else winnerText = "IT'S A TIE!";
        winnerTextElement.textContent = winnerText;
        winnerAnnouncer.style.display = 'flex';
    };

    const storedEndTime = localStorage.getItem('timerEndTime');
    const storedPausedTime = localStorage.getItem('pausedTime');

    if (storedEndTime) {
        startBtn.disabled = true;
        pauseResumeBtn.textContent = 'Pause Timer';
        pauseResumeBtn.className = 'control-btn pause-btn';
        pauseResumeBtn.disabled = false;
        pauseResumeBtn.addEventListener('click', pauseTimer);
        const endTime = parseInt(storedEndTime, 10);
        const updateDisplay = () => {
            const now = new Date().getTime();
            const remaining = endTime - now;
            if (remaining <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
                announceWinner();
            } else {
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
                timerDisplay.textContent = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
            }
        };
        updateDisplay();
        timerInterval = setInterval(updateDisplay, 1000);
    } else if (storedPausedTime) {
        startBtn.disabled = true;
        pauseResumeBtn.textContent = 'Resume Timer';
        pauseResumeBtn.className = 'control-btn resume-btn';
        pauseResumeBtn.disabled = false;
        pauseResumeBtn.addEventListener('click', resumeTimer);
        const remaining = parseInt(storedPausedTime, 10);
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        timerDisplay.textContent = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    } else {
        startBtn.disabled = false;
        pauseResumeBtn.textContent = 'Pause/Resume';
        pauseResumeBtn.disabled = true;
        startBtn.addEventListener('click', startInitialCountdown);
    }
    closeBtn.addEventListener("click", () => {
        winnerAnnouncer.style.display = 'none';
    });
  </script>
</html>
`;

const resetPage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Reset</title>
    ${style}
  </head>
  <body>
    <div class="container">
      <div class="subcontainer">
        <h2>Reset!</h2>
      </div>
     </div>
  </body>
  <script>
    var reset = (confirmation) => {
      if (confirmation === 'RESETMADDUCK') {
        localStorage.removeItem('timerEndTime');
        localStorage.removeItem('pausedTime');
        localStorage.removeItem('chargersRevealed');
        localStorage.removeItem('ravensRevealed');
        localStorage.removeItem('autoRefresh');
        fetch("/reset", { method: "POST", body: confirmation })
        .then((response) => {
          if (!response.ok) {
            alert("HTTP Error " + response.status + ". Please try again.");
          } else {
            window.location.href = "/board";
          }
        })
      } else {
        alert("Please enter RESETMADDUCK in all caps.")
      }
    }
    var requestConfirmation = (_event) => {
      let confirmation = prompt("Please enter RESETMADDUCK to reset the scoreboard:");
      reset(confirmation)
    }
    document.querySelector("h2").addEventListener("click", requestConfirmation)
  </script>
</html>
`;

async function resetGameData(env) {
    await env.FLAGS.put("1",'{"name":"Broncos","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("2",'{"name":"Buccaneers","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":5000,"blue":-1000},"blue_capture":{"red":-1000,"blue":5000}}}');
    await env.FLAGS.put("3",'{"name":"Chargers","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-500,"blue":100}}}');
    await env.FLAGS.put("4",'{"name":"Chiefs","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}');
    await env.FLAGS.put("5",'{"name":"Commanders","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("6",'{"name":"Cowboys","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}');
    await env.FLAGS.put("7",'{"name":"Dolphins","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}');
    await env.FLAGS.put("8",'{"name":"Eagles","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":1500,"blue":-2000},"blue_capture":{"red":-2000,"blue":1500}}}');
    await env.FLAGS.put("9",'{"name":"Giants","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("10",'{"name":"Jaguars","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("11",'{"name":"Jets","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":1500,"blue":-2000},"blue_capture":{"red":-2000,"blue":1500}}}');
    await env.FLAGS.put("12",'{"name":"Patriots","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("13",'{"name":"Ravens","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-500},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("14",'{"name":"Saints","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}');
    await env.FLAGS.put("15",'{"name":"Seahawks","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}');
    await env.FLAGS.put("16",'{"name":"Texans","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}');
    await env.FLAGS.put("17",'{"name":"Titans","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":2000,"blue":0},"blue_capture":{"red":0,"blue":2000}}}');
    await env.FLAGS.put("18",'{"name":"Vikings","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}');
}

async function getFlag(request, env) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const flag = await env.FLAGS.get(id?.toString(), { type: "json" });
  if (flag === null) {
    return new Response("The requested resource could not be found 🦆", {
      status: 404,
    });
  }
  const body = flagPage(flag);
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function captureFlag(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const json = await request.json();
    const contract = json?.contract;
    if (!id || !contract) {
      return new Response("Missing flag ID or contract.", { status: 400 });
    }
    const flag = await env.FLAGS.get(id, { type: "json" });
    if (!flag) {
      return new Response("Flag not found in KV store.", { status: 404 });
    }
    let winner = flag.winner ? flag.winner : await check(contract, id, env);
    await env.FLAGS.put(
      id,
      JSON.stringify({
        name: flag.name,
        times: flag.times.concat(new Date().toTimeString().split(" ")[0]),
        contracts: flag.contracts.concat(contract),
        points: flag.points,
        winner: winner,
      })
    );
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response("Error: " + err.toString(), { status: 500 });
  }
}

async function check(contract, id, env) {
  const flag = await env.FLAGS.get(id, { type: "json" });
  const redExp = new RegExp(
    `Red HQ(,|\\s)[\\S\\s]*?(,|\\s)Touchdown ${flag.name}`,
    "i"
  );
  const blueExp = new RegExp(
    `Blue HQ(,|\\s)[\\S\\s]*?(,|\\s)Touchdown ${flag.name}`,
    "i"
  );
  if (redExp.test(contract)) {
    return "red," + flag.contracts.length;
  } else if (blueExp.test(contract)) {
    return "blue," + flag.contracts.length;
  } else {
    return null;
  }
}

async function getBoard(env) {
  const promises = [];
  for (const key of Array(18).keys()) {
    promises.push(env.FLAGS.get((key + 1).toString(), { type: "json" }));
  }
  const data = await Promise.all(promises);
  const body = boardPage(JSON.stringify(data));
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function resetBoard(request, env) {
  if (request.method === "POST") {
    const confirmation = await request.text();
    if (confirmation === "RESETMADDUCK") {
      await resetGameData(env);
      return new Response(null, { status: 200 });
    }
  } else {
    return new Response(resetPage, {
      headers: { "Content-Type": "text/html" },
    });
  }
}

async function confirmContract() {
  return new Response("Contract received 💬", {
    status: 200,
    headers: { "Clear-Site-Data": "*" },
  });
}

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  switch (path) {
    case "/flag":
      return getFlag(request, env);
    case "/capture":
      return captureFlag(request, env);
    case "/board":
      return getBoard(env);
    case "/reset":
      return resetBoard(request, env);
    case "/confirm":
      return confirmContract();
    default:
      return new Response("The requested resource could not be found 🦆", {
        status: 404,
      });
  }
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
  async scheduled(event, env, ctx) {
    await resetGameData(env);
    console.log("Automated Midnight Reset Complete");
  }
}
