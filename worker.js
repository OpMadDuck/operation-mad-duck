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
</style>
`;

/**
 * flagPage consumes a flag object and returns a response body as a string.
 * The response body represents a flag waypoint - the content shown to a
 * user when they scan the appropriate QR code. Additional code is included in
 * the body of the response (see below).
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
  </body>
  <script>
    // Save the query strings in the URL
    const queryString = window.location.search;

    // Parse the saved search parameters
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the ID (must be a value between 1-18)
    const id = urlParams.get('id')

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
    var captureFlag = (contract) => {
      if (contract) {
        fetch("/capture?id=" + id, { method: "POST", body: contract })
        .then((response) => {
          if (!response.ok) {
            alert("HTTP Error " + response.status + ". Please try again.");
          } else {
            window.location.replace("/confirm");
          }
        })
      }
    }

    /**
     * requestContract prompts the user to submit their team's contract to 
     * capture the flag, and then passes the result to the captureFlag function.
     * @param {Event} _event
     */
    var requestContract = (_event) => {
      let contract = prompt("Please enter your team's contract:");
      captureFlag(contract)
    }

    /**
     * Wait for the user to tap/click the 'Capture!' button on the page.
     */
    document.querySelector("h2").addEventListener("click", requestContract)
  </script>
</html>
`;

/**
 * boardPage consumes an array of all flag objects and returns a response
 * body as a string. The response body represents a score board for all
 * flags, and the total scores for each team. Every contract logged is made
 * visible on the board. Additional code is included in the body of the response.
 * @param {Array<Object>} flags
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
      </div>
     </div>
  </body>
  <script>
    /**
     * Instantiate the array of flags passed in from the worker.
     */
    const flags = ${flags}

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
      /**
       * Create the HTML elements for the row
       * that will represent this flag, including:
       * - The flag name
       * - The contracts issued for this flag
       * - The red team's points for this flag
       * - The blue team's points for this flag
       */
      var row = document.createElement("tr")
      var name = document.createElement("td")
      var contracts = document.createElement("td")
      var red = document.createElement("td")
      var blue = document.createElement("td")

      /**
       * Set the name of the flag
       */
      name.innerHTML = flag.name

      /** 
       * Determine the winning contract and the team
       * which won this flag. Assign the correct point
       * value to the winning team and add it to the
       * total point value for the team.
       */
      let winningContractID;
      if(flag.winner) {
        let winnerArray = flag.winner.split(',')
        winningContractID = parseInt(winnerArray[1])
        if (winnerArray[0] === 'red') {
          redSum += flag.red
          red.innerHTML = flag.red
        } else if (winnerArray[0] === 'blue') {
          blueSum += flag.blue
          blue.innerHTML = flag.blue
        }
      }

      /**
       * Style the contract log, italicizing the improper
       * contracts, and bolding the proper/winning contract.
       */
      for (let i = 0; i < flag.contracts.length; i++) {
        if (i === winningContractID) {
          contracts.innerHTML += '<strong>' + flag.times[i] + 'Z - ' + flag.contracts[i] + '</strong><br>'
        } else {
          contracts.innerHTML += '<em>' + flag.times[i] + 'Z - ' + flag.contracts[i] + '</em><br>'
        }
      }

      /**
       * Append the newly loaded data into the table row
       */
      row.appendChild(name)
      row.appendChild(contracts)
      row.appendChild(red)
      row.appendChild(blue)
      scoreBoard.appendChild(row)
    })

    /** 
     * Set the sum total values in the table
     */
    document.querySelector("#redSum").innerHTML = redSum
    document.querySelector("#blueSum").innerHTML = blueSum
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
 * @returns {Response}
 */
async function getFlag(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const flag = await FLAGS.get(id.toString(), { type: "json" });
  if (flag === null) {
    return new Response("The requested resource could not be found 🦆", {
      status: 404,
    });
  }

  const body = flagPage(flag);
  return new Response(body, {
    headers: { "Content-Type": "text/html"},
  });
}

/**
 * captureFlag consumes a request forwarded by the handleRequest() function
 * and runs a check on the submitted contract prior to logging it's contents.
 * After passing all required checks, data is updated in the KV store.
 * @param {Request} request
 * @returns {Response}
 */
async function captureFlag(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const contract = await request.text();
    const flag = await FLAGS.get(id, { type: "json" });
    let winner;
    if (flag.winner) {
      winner = flag.winner;
    } else {
      winner = await check(contract, id);
    }
    await FLAGS.put(
      id,
      JSON.stringify({
        name: flag.name,
        times: flag.times.concat(new Date().toTimeString().split(" ")[0]),
        contracts: flag.contracts.concat(contract),
        red: flag.red,
        blue: flag.blue,
        winner: winner,
      })
    );
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response(err, { status: 500 });
  }
}

/**
 * check consumes a contract statement and flag ID from the captureFlag()
 * function. If the supplied contract is correct, then a result is returned
 * bearing the winning team and an index of the winning contract
 * @param {String} contract
 * @param {String} id
 * @returns {String} winningTeam,winningContract
 */
async function check(contract, id) {
  const flag = await FLAGS.get(id, { type: "json" });
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
 * @returns {Response}
 */
async function getBoard() {
  const promises = [];

  for (const key of Array(18).keys()) {
    promises.push(FLAGS.get((key + 1).toString(), { type: "json" }));
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
 * @returns {Response}
 */
async function resetBoard(request) {
  if (request.method === "POST") {
    const confirmation = await request.text();
    if (confirmation === "RESETMADDUCK") {
      await FLAGS.put(
        "1",
        '{"name":"Broncos", "times":[], "contracts":[], "red":800, "blue":800, "winner":null}'
      );
      await FLAGS.put(
        "2",
        '{"name":"Buccaneers", "times":[], "contracts":[], "red":0, "blue":1200, "winner":null}'
      );
      await FLAGS.put(
        "3",
        '{"name":"Chargers", "times":[], "contracts":[], "red":400, "blue":400, "winner":null}'
      );
      await FLAGS.put(
        "4",
        '{"name":"Chiefs", "times":[], "contracts":[], "red":800, "blue":200, "winner":null}'
      );
      await FLAGS.put(
        "5",
        '{"name":"Commanders", "times":[], "contracts":[], "red":400, "blue":400, "winner":null}'
      );
      await FLAGS.put(
        "6",
        '{"name":"Cowboys", "times":[], "contracts":[], "red":600, "blue":400, "winner":null}'
      );
      await FLAGS.put(
        "7",
        '{"name":"Dolphins", "times":[], "contracts":[], "red":600, "blue":600, "winner":null}'
      );
      await FLAGS.put(
        "8",
        '{"name":"Eagles", "times":[], "contracts":[], "red":400, "blue":400, "winner":null}'
      );
      await FLAGS.put(
        "9",
        '{"name":"Giants", "times":[], "contracts":[], "red":200, "blue":600, "winner":null}'
      );
      await FLAGS.put(
        "10",
        '{"name":"Jaguars", "times":[], "contracts":[], "red":800, "blue":200, "winner":null}'
      );
      await FLAGS.put(
        "11",
        '{"name":"Jets", "times":[], "contracts":[], "red":200, "blue":200, "winner":null}'
      );
      await FLAGS.put(
        "12",
        '{"name":"Patriots", "times":[], "contracts":[], "red":800, "blue":200, "winner":null}'
      );
      await FLAGS.put(
        "13",
        '{"name":"Ravens", "times":[], "contracts":[], "red":200, "blue":200, "winner":null}'
      );
      await FLAGS.put(
        "14",
        '{"name":"Saints", "times":[], "contracts":[], "red":200, "blue":600, "winner":null}'
      );
      await FLAGS.put(
        "15",
        '{"name":"Seahawks", "times":[], "contracts":[], "red":800, "blue":200, "winner":null}'
      );
      await FLAGS.put(
        "16",
        '{"name":"Texans", "times":[], "contracts":[], "red":200, "blue":800, "winner":null}'
      );
      await FLAGS.put(
        "17",
        '{"name":"Titans", "times":[], "contracts":[], "red":1200, "blue":600, "winner":null}'
      );
      await FLAGS.put(
        "18",
        '{"name":"Vikings", "times":[], "contracts":[], "red":200, "blue":800, "winner":null}'
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
 * @returns {Response}
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  switch (path) {
    case "/flag":
      return getFlag(request);
    case "/capture":
      return captureFlag(request);
    case "/board":
      return getBoard();
    case "/reset":
      return resetBoard(request);
    case "/confirm":
      return confirmContract();
    default:
      return new Response("The requested resource could not be found 🦆", {
        status: 404,
      });
  }
}

/**
 * Listen for a fetch event. When such an event occurs, respond with
 * the data provided by the handleRequest() function above.
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
