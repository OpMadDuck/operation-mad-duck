/**
 * Summary of changes (this version):
 * [-] Removed all geolocation prompts and geofencing checks
 * [-] Removed location/distance from payloads and scoreboard logging
 * [*] Kept all other functionality intact (board, reset, scoring, XSS sanitization)
 * [*] Passed `env` into helper functions for correctness in Module Worker scope
 */

/**
 * The HTML formatted CSS style block which includes global styling
 * for all HTML responses. These rules are a minimum requirement
 * to display data properly on the flagPage, boardPage, and resetPage.
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
.timer-container {
    text-align: center;
    margin: 20px;
    padding: 20px;
    background-color: white;
    border-radius: 18px;
}
#timerDisplay {
    font-size: 2.5em;
    font-weight: bold;
    margin-top: 10px;
    color: #1d1d1f;
}
#startTimerBtn {
    background-color: #007AFF;
    color: white;
    border: none;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: background-color 0.3s;
}
#startTimerBtn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
</style>
`;

/**
 * flagPage consumes a flag object and returns a response body as a string.
 * The response body represents a flag waypoint - the content shown to a
 * user when they scan the appropriate QR code.
 * @param {Object} flag
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
      // Save the query strings in the URL
      const queryString = window.location.search;
      // Parse the saved search parameters  
      const urlParams = new URLSearchParams(queryString);
      // Get the value of the ID (must be a value between 1-18)
      const id = urlParams.get("id");
      // Prevent the user from seeing the ID in the URL bar
      window.history.replaceState(null, "", "/");
      /**
       * captureFlag consumes a contract in the form of a String and posts it back 
       * to the Worker for logging. If the server accepts the contract, the user 
       * will be redirected to prevent them from accessing the page again directly. 
       * If the server encounters an error, then the user will be prompted to resubmit 
       * their contract.
       * @param {String} contract
       */
      const captureFlag = (contract) => {
        if (!contract) return;
        const payload = { contract }; // no location data
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
      /**
       * requestContract prompts the user to submit their team's contract to 
       * capture the flag, and then passes the result to the captureFlag function.
       */
      const requestContract = () => {
        const contract = prompt("Please enter your team's contract:");
        captureFlag(contract);
      };
      /**
       * Wait for the user to tap/click the 'Capture!' button on the page.
       */
      document.querySelector("h2").addEventListener("click", requestContract);
    </script>
  </body>
</html>
`;

/**
 * boardPage consumes an array of all flag objects and returns a response
 * body as a string. The response body represents a score board for all
 * flags, and the total scores for each team.
 * @param {Array<Object>} flags
 */
const boardPage = (flags) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="refresh" content="15">
    <title>Operation Mad Duck | Score Board</title>
    ${style}
  </head>
  <body>
    <div class="container">
      <div class="subcontainer">
        <table>
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
        <div class="timer-container">
            <button id="startTimerBtn">Start Timer</button>
            <div id="timerDisplay">30:00</div>
        </div>
      </div>
     </div>
    <div id="winnerAnnouncer"></div>
  </body>
  <script>
    /**
     * Instantiate the array of flags passed in from the worker.
     */
    const flags = ${flags}
    /**
     * escapeHtml sanitizes potentially dangerous javascript input.
     * This helps prevent accidentally or intentionally unanticipated
     * manipulation of the flag scoring and tracking mechanics.
     */
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    /**
     * Identify the score board table by its HTML ID
     */
    const scoreBoard = document.querySelector("#scoreBoard")
    /**
     * Instantiate the total point values for each team
     */
    var redSum = 0
    var blueSum = 0
    flags.forEach((flag) => {
      var row = document.createElement("tr")
      var name = document.createElement("td")
      var contracts = document.createElement("td")
      var red = document.createElement("td")
      var blue = document.createElement("td")
      
      name.innerHTML = flag.name

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

          // Apply styles to all cells in this row to ensure they override default styles
          const cells = [name, contracts, red, blue];
          cells.forEach(cell => {
              cell.style.backgroundColor = winningTeamColor;
              cell.style.color = 'white';
              cell.style.fontWeight = 'bold';
          });
        }
      }

      // Style contracts (bold winner, italic others)
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
     * Timer and Winner Announcement Logic
     */
    const startBtn = document.querySelector("#startTimerBtn");
    const timerDisplay = document.querySelector("#timerDisplay");
    const winnerAnnouncer = document.querySelector("#winnerAnnouncer");
    let timerInterval;

    const startCountdown = () => {
        // Disable the button to prevent restarting
        startBtn.disabled = true;

        let duration = 30 * 60;

        timerInterval = setInterval(() => {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;

            timerDisplay.textContent = 
                String(minutes).padStart(2, '0') + ":" + 
                String(seconds).padStart(2, '0');
            
            duration--;

            if (duration < 0) {
                clearInterval(timerInterval);
                announceWinner();
            }
        }, 1000);
    };

    const announceWinner = () => {
        let winnerText = "THE WINNER IS ";
        if (redSum > blueSum) {
            winnerText += "RED TEAM";
        } else if (blueSum > redSum) {
            winnerText += "BLUE TEAM";
        } else {
            winnerText = "IT'S A TIE!";
        }
        
        winnerAnnouncer.textContent = winnerText;
        winnerAnnouncer.style.display = 'flex';
    };

    startBtn.addEventListener("click", startCountdown);
  </script>
</html>
`;

/**
 * resetPage returns a response body as a string. The response body contains
 * a button which will revert the Worker KV database back to its original
 * state. There is no way to restore the data once the reset occurs.
 */
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
    /**
     * reset consumes a confirmation in the form of a String and posts it back 
     * to the Worker to reset the KV store. If the server accepts the confirmation,
     * the user will be redirected to the score board. If the server encounters an error, 
     * then the user will be prompted to reattempt the reset.
     * @param {String} confirmation
     */
    var reset = (confirmation) => {
      if (confirmation === 'RESETMADDUCK') {
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
    /**
     * requestConfirmation prompts the user to submit their proper confirmation 
     * message to reset the game.
     * @param {Event} _event
     */
    var requestConfirmation = (_event) => {
      let confirmation = prompt("Please enter RESETMADDUCK to reset the scoreboard:");
      reset(confirmation)
    }
    /**
     * Wait for the user to tap/click the 'Reset!' button on the page.
     */
    document.querySelector("h2").addEventListener("click", requestConfirmation)
  </script>
</html>
`;

/**
 * getFlag consumes a request forwarded by the handleRequest() function
 * and supplies a dynamic Response containing a flagPage.
 * @param {Request} request
 * @param {any} env
 * @returns {Response}
 */
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

/**
 * captureFlag consumes a request forwarded by the handleRequest() function
 * and runs a check on the submitted contract prior to logging it's contents.
 * After passing all required checks, data is updated in the KV store.
 * @param {Request} request
 * @param {any} env
 * @returns {Response}
 */
async function captureFlag(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const json = await request.json();
    const contract = json?.contract;
    if (!id || !contract) {
      return new Response("Missing flag ID or contract.", { status: 400 });
    }
    // Load flag data from KV
    const flag = await env.FLAGS.get(id, { type: "json" });
    if (!flag) {
      return new Response("Flag not found in KV store.", { status: 404 });
    }
    // Determine winner if not already set
    let winner = flag.winner ? flag.winner : await check(contract, id, env);
    // Update KV store with new contract (no location appended)
    await env.FLAGS.put(
      id,
      JSON.stringify({
        name: flag.name,
        times: flag.times.concat(new Date().toTimeString().split(" ")[0]),
        contracts: flag.contracts.concat(contract),
        points: flag.points, // Pass the points object through
        winner: winner,
      })
    );
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response("Error: " + err.toString(), { status: 500 });
  }
}

/**
 * check consumes a contract statement and flag ID from the captureFlag()
 * function. If the supplied contract is correct, then a result is returned
 * bearing the winning team and an index of the winning contract
 * @param {String} contract
 * @param {String} id
 * @param {any} env
 * @returns {String|null} winningTeam,winningContract
 */
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

/**
 * getBoard consumes a request forwarded by the handleRequest() function
 * and returns a response with boardPage in the body. All data must be
 * retrieved from the KV store prior to issuing a Response.
 * @param {any} env
 * @returns {Response}
 */
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

/**
 * resetBoard consumes a request forwarded by the handleRequest() function
 * and runs a check on the submitted confirmation message prior to resetting
 * the game state. After passing all required checks, data is reset in the KV store.
 * @param {Request} request
 * @param {any} env
 * @returns {Response}
 */
async function resetBoard(request, env) {
  if (request.method === "POST") {
    const confirmation = await request.text();
    if (confirmation === "RESETMADDUCK") {
      await env.FLAGS.put(
        "1",
        '{"name":"Broncos","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "2",
        '{"name":"Buccaneers","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":5000,"blue":-1000},"blue_capture":{"red":-1000,"blue":5000}}}'
      );
      await env.FLAGS.put(
        "3",
        '{"name":"Chargers","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-500,"blue":100}}}'
      );
      await env.FLAGS.put(
        "4",
        '{"name":"Chiefs","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}'
      );
      await env.FLAGS.put(
        "5",
        '{"name":"Commanders","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "6",
        '{"name":"Cowboys","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}'
      );
      await env.FLAGS.put(
        "7",
        '{"name":"Dolphins","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}'
      );
      await env.FLAGS.put(
        "8",
        '{"name":"Eagles","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":1500,"blue":-2000},"blue_capture":{"red":-2000,"blue":1500}}}'
      );
      await env.FLAGS.put(
        "9",
        '{"name":"Giants","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "10",
        '{"name":"Jaguars","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "11",
        '{"name":"Jets","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":1500,"blue":-2000},"blue_capture":{"red":-2000,"blue":1500}}}'
      );
      await env.FLAGS.put(
        "12",
        '{"name":"Patriots","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "13",
        '{"name":"Ravens","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-500},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "14",
        '{"name":"Saints","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":100,"blue":-100},"blue_capture":{"red":-100,"blue":500}}}'
      );
      await env.FLAGS.put(
        "15",
        '{"name":"Seahawks","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}'
      );
      await env.FLAGS.put(
        "16",
        '{"name":"Texans","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}'
      );
      await env.FLAGS.put(
        "17",
        '{"name":"Titans","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":2000,"blue":0},"blue_capture":{"red":0,"blue":2000}}}'
      );
      await env.FLAGS.put(
        "18",
        '{"name":"Vikings","times":[],"contracts":[],"winner":null,"points":{"red_capture":{"red":500,"blue":-100},"blue_capture":{"red":-100,"blue":100}}}'
      );
      return new Response(null, { status: 200 });
    }
  } else {
    return new Response(resetPage, {
      headers: { "Content-Type": "text/html" },
    });
  }
}

/**
 * confirmContract will notify the user that their submitted
 * contract has been logged successfully by the Worker.
 * @returns {Response}
 */
async function confirmContract() {
  return new Response("Contract received 💬", {
    status: 200,
    headers: { "Clear-Site-Data": "*" },
  });
}

/**
 * handleRequest consumes a request forwarded by the main event listener.
 * Depending on the URL path, this function defers Responses to the functions
 * written above. If no suitable function is found for the requested path,
 * a 404 Not Found response is issued to the user. Quack!
 * @param {Request} request
 * @param {any} env
 * @param {any} ctx
 * @returns {Response}
 */
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

/**
 * Module Worker entrypoint
 */
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
}
