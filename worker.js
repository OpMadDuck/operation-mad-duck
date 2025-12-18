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
table {
  background-color: white;
  border-collapse: collapse;
  border-radius: 18px;
  color: black;
  margin: 18px;
  min-width: 100%;
  padding: 18px;
  text-align: left;
}
th, td {
  background-color: white;
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
.controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: white;
  border-radius: 18px;
  width: 90%;
}
.button-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  background-color: #ff9500;
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
  background-color: #007AFF;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  font-size: 1em;
}
#startTimerBtn:disabled {
  background-color: #cccccc;
}
.pause-btn { background-color: #ff3b30; }
.resume-btn { background-color: #34c759; }
.refresh-btn-on { background-color: #34c759; }
.refresh-btn-off { background-color: #ff3b30; }
.reset-flag-btn { background-color: #5856d6; }
.capture-btn { background-color: #28a745; width: 100%; margin-top:10px; }

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
    const flags = ${flags};
    
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    const scoreBoard = document.querySelector("#scoreBoard");
    var redSum = 0;
    var blueSum = 0;

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

    /**
      * Admin Controls Logic
      */
    const revealChargersBtn = document.querySelector("#revealChargersBtn");
    const revealRavensBtn = document.querySelector("#revealRavensBtn");
    const resetChargersBtn = document.querySelector("#resetChargersBtn");
    const resetRavensBtn = document.querySelector("#resetRavensBtn");
    const startBtn = document.querySelector("#
