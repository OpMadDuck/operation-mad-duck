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
}
h1 {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
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
/* TABLE: High transparency with Glassmorphism blur */
table {
  background-color: rgba(255, 255, 255, 0.6); 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-collapse: collapse;
  border-radius: 18px;
  color: #1d1d1f;
  margin: 18px;
  min-width: 100%;
  padding: 18px;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
th, td {
  background-color: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-collapse: collapse;
  overflow: hidden;
  padding: 10px;
  text-overflow: ellipsis;
}
/* WINNING ROWS: Semi-transparent so logo is visible */
.winner-red {
    background-color: rgba(255, 59, 48, 0.4) !important;
    color: black !important;
    font-weight: bold;
}
.winner-blue {
    background-color: rgba(0, 122, 255, 0.4) !important;
    color: black !important;
    font-weight: bold;
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
.controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  width: 90%;
  margin-top: 20px;
  margin-bottom: 40px;
}
/* CENTERED BUTTONS */
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
  color: #1d1d1f;
}
.reveal-btn, .control-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: white;
}
.reveal-btn {
  background-color: #ff9500;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5em;
}
#startTimerBtn {
  background-color: #007AFF;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
.pause-btn { background-color: #ff3b30; }
.resume-btn { background-color: #34c759; }
.refresh-btn-on { background-color: #34c759; }
.refresh-btn-off { background-color: #ff3b30; }
.reset-flag-btn { background-color: #5856d6; }

/* OPAQUE YELLOW CAPTURE BUTTON */
.capture-btn { 
    background-color: #FFD700; 
    color: black; 
    width: 100%; 
    margin-top: 10px;
}
#winnerAnnouncer {
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
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
  top: 20px; right: 40px;
  font-size: 50px;
  cursor: pointer;
}
</style>
`;

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
        fetch("/capture?id=" + id, {
          method: "POST",
          body: JSON.stringify({ contract }),
          headers: { "Content-Type": "application/json" }
        }).then(async (res) => {
          if (!res.ok) alert("Capture failed.");
          else window.location.replace("/confirm");
        });
      };
      document.querySelector("h2").addEventListener("click", () => {
        const contract = prompt("Enter team contract:");
        captureFlag(contract);
      });
    </script>
  </body>
</html>
`;

const boardPage = (flags) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Score Board</title>
    ${style}
    <style>
        body {
            background-image: url('https://raw.githubusercontent.com/OpMadDuck/operation-mad-duck/d927955357373be2d3b129734c25de23c6c77417/mad-duck-toc-logo.png');
            background-size: 35%; 
            background-position: center center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            background-color: #F5F5F7;
        }
    </style>
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
          <tbody id='scoreBoard'></tbody>
          <tr>
            <th>Total</th><th></th>
            <th id='redSum'></th><th id='blueSum'></th>
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
    const flags = ${flags};
    const scoreBoard = document.querySelector("#scoreBoard");
    let redSum = 0, blueSum = 0;

    flags.forEach((flag) => {
      const row = document.createElement("tr");
      if ((flag.name === 'Chargers' && localStorage.getItem('chargersRevealed') !== 'true') ||
          (flag.name === 'Ravens' && localStorage.getItem('ravensRevealed') !== 'true')) {
          row.style.display = 'none';
      }

      let winningContractID;
      if(flag.winner) {
        const winnerArray = flag.winner.split(',');
        winningContractID = parseInt(winnerArray[1]);
        const team = winnerArray[0];
        const points = flag.points[team + '_capture'];
        redSum += points.red; blueSum += points.blue;
        row.className = team === 'red' ? 'winner-red' : 'winner-blue';
        
        let contractHtml = '';
        flag.contracts.forEach((c, i) => {
          contractHtml += (i === winningContractID ? '<strong>' : '<em>') + flag.times[i] + 'Z - ' + c + (i === winningContractID ? '</strong>' : '</em>') + '<br>';
        });
        row.innerHTML = '<td>'+flag.name+'</td><td>'+contractHtml+'</td><td>'+points.red+'</td><td>'+points.blue+'</td>';
      } else {
        row.innerHTML = '<td>'+flag.name+'</td><td>'+flag.contracts.join('<br>')+'</td><td>0</td><td>0</td>';
      }
      scoreBoard.appendChild(row);
    });

    document.querySelector("#redSum").innerText = redSum;
    document.querySelector("#blueSum").innerText = blueSum;

    // --- ADMIN LOGIC ---
    const revealChargersBtn = document.querySelector("#revealChargersBtn");
    const revealRavensBtn = document.querySelector("#revealRavensBtn");
    const startBtn = document.querySelector("#startTimerBtn");
    const pauseResumeBtn = document.querySelector("#pauseResumeBtn");
    const toggleRefreshBtn = document.querySelector("#toggleRefreshBtn");
    const timerDisplay = document.querySelector("#timerDisplay");

    // Reveal Logic
    if (localStorage.getItem('chargersRevealed') === 'true') revealChargersBtn.disabled = true;
    revealChargersBtn.onclick = () => { localStorage.setItem('chargersRevealed', 'true'); window.location.reload(); };
    if (localStorage.getItem('ravensRevealed') === 'true') revealRavensBtn.disabled = true;
    revealRavensBtn.onclick = () => { localStorage.setItem('ravensRevealed', 'true'); window.location.reload(); };

    // Auto Refresh Logic
    const autoRefresh = localStorage.getItem('autoRefresh') !== 'false';
    toggleRefreshBtn.innerText = autoRefresh ? 'Auto-Refresh: On' : 'Auto-Refresh: Off';
    toggleRefreshBtn.className = autoRefresh ? 'control-btn refresh-btn-on' : 'control-btn refresh-btn-off';
    toggleRefreshBtn.onclick = () => { localStorage.setItem('autoRefresh', !autoRefresh); window.location.reload(); };
    if(autoRefresh) setTimeout(() => window.location.reload(), 15000);

    // Timer Logic
    const endTime = localStorage.getItem('timerEndTime');
    const pausedTime = localStorage.getItem('pausedTime');

    if (endTime) {
        startBtn.disabled = true;
        pauseResumeBtn.innerText = 'Pause Timer';
        pauseResumeBtn.className = 'control-btn pause-btn';
        pauseResumeBtn.onclick = () => {
            localStorage.setItem('pausedTime', endTime - new Date().getTime());
            localStorage.removeItem('timerEndTime');
            window.location.reload();
        };
        setInterval(() => {
            const rem = endTime - new Date().getTime();
            if (rem <= 0) { timerDisplay.innerText = "00:00"; return; }
            const m = Math.floor(rem / 60000), s = Math.floor((rem % 60000) / 1000);
            timerDisplay.innerText = String(m).padStart(2,'0')+":"+String(s).padStart(2,'0');
        }, 1000);
    } else if (pausedTime) {
        startBtn.disabled = true;
        pauseResumeBtn.innerText = 'Resume Timer';
        pauseResumeBtn.className = 'control-btn resume-btn';
        pauseResumeBtn.onclick = () => {
            localStorage.setItem('timerEndTime', new Date().getTime() + parseInt(pausedTime));
            localStorage.removeItem('pausedTime');
            window.location.reload();
        };
    } else {
        startBtn.onclick = () => {
            localStorage.setItem('timerEndTime', new Date().getTime() + (30 * 60 * 1000));
            window.location.reload();
        };
    }

    document.querySelector("#screenCaptureBtn").onclick = () => {
        const range = document.createRange();
        range.selectNode(document.getElementById("mainTable"));
        window.getSelection().addRange(range);
        document.execCommand('copy');
        alert("Table Copied!");
    };
  </script>
</html>
`;

// Helper for KV Reset
async function resetGameData(env) {
    const names = ["Broncos", "Buccaneers", "Chargers", "Chiefs", "Commanders", "Cowboys", "Dolphins", "Eagles", "Giants", "Jaguars", "Jets", "Patriots", "Ravens", "Saints", "Seahawks", "Texans", "Titans", "Vikings"];
    for(let i=0; i<names.length; i++){
        await env.FLAGS.put((i+1).toString(), JSON.stringify({
            name: names[i], times: [], contracts: [], winner: null,
            points: { red_capture: {red:100, blue:-100}, blue_capture: {red:-100, blue:100} }
        }));
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if(url.pathname === "/board") {
            const data = [];
            for(let i=1; i<=18; i++) data.push(await env.FLAGS.get(i.toString(), {type:"json"}));
            return new Response(boardPage(JSON.stringify(data)), {headers:{"Content-Type":"text/html"}});
        }
        if(url.pathname === "/capture") {
            const id = url.searchParams.get("id");
            const flag = await env.FLAGS.get(id, {type:"json"});
            const json = await request.json();
            flag.contracts.push(json.contract);
            flag.times.push(new Date().toTimeString().split(' ')[0]);
            await env.FLAGS.put(id, JSON.stringify(flag));
            return new Response("OK");
        }
        if(url.pathname === "/reset") {
            await resetGameData(env);
            return new Response("Reset");
        }
        return new Response("Worker Live");
    },
    async scheduled(event, env) { await resetGameData(env); }
}
