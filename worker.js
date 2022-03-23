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
            window.location.href = "/confirm";
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
        <!-- <h1>Operation Mad Duck</h1> -->
        <table>
          <thead>
            <tr>
              <th style="width:15%">Name</th>
              <th style="width:65%">Contracts</th>
              <th style="width:10%">Red Points</th>
              <th style="width:10%">Blue Points</th>
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
    var populateData = () => {
      const scoreBoard = document.querySelector("#scoreBoard")
      const flags = ${flags}
      var redSum = 0
      var blueSum = 0
      flags.forEach((flag) => {
        var row = document.createElement("tr")

        var name = document.createElement("td")
        var contracts = document.createElement("td")
        var red = document.createElement("td")
        var blue = document.createElement("td")

        name.innerHTML = flag.name
        let winnerArray;
        let winningContractID;
        if(flag.winner) {
          winnerArray = flag.winner.split(',')
          winningContractID = parseInt(winnerArray[1])
          if (winnerArray[0] === 'red') {
            redSum += flag.red
            red.innerHTML = flag.red
          } else if (winnerArray[0] === 'blue') {
            blueSum += flag.blue
            blue.innerHTML = flag.blue
          }
        }
        for (let i = 0; i < flag.contracts.length; i++) {
          if (i === winningContractID) {
            contracts.innerHTML += '<strong>' + flag.times[i] + ': ' + flag.contracts[i] + '</strong><br>'
          } else {
            contracts.innerHTML += '<em>' + flag.times[i] + ': ' + flag.contracts[i] + '</em><br>'
          }
        }

        row.appendChild(name)
        row.appendChild(contracts)
        row.appendChild(red)
        row.appendChild(blue)

        scoreBoard.appendChild(row)

        document.querySelector("#redSum").innerHTML = redSum
        document.querySelector("#blueSum").innerHTML = blueSum
      })
    }
    populateData()
  </script>
</html>
`;

const resetPage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Admin</title>
    ${style}
  </head>
  <body>
    <div class="container">
      <div class="subcontainer">
        <h2>Reset Scoreboard</h2>
      </div>
     </div>
  </body>
  <script>
    var reset = (confirmation) => {
      if (confirmation === 'RESET') {
        fetch("/reset", { method: "POST", body: confirmation })
        .then((response) => {
          if (response.ok) {
            alert("The score board has been reset!")
          } else {
            alert("An error occurred. Please try again")
          }
        })
      } else {
        alert("Please enter 'RESET' in all caps.")
      }
    }
    var requestConfirmation = (_event) => {
      let confirmation = prompt("Please enter RESET to reset the scoreboard:");
      reset(confirmation)
    }
    document.querySelector("h2").addEventListener("click", requestConfirmation)
  </script>
</html>
`;

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
    headers: { "Content-Type": "text/html" },
  });
}

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

async function getBoard(_request) {
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

async function resetBoard(request) {
  if (request.method === "POST") {
    const confirmation = await request.text();
    if (confirmation === "RESET") {
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

async function confirmContract() {
  return new Response("Contract received 💬", {
    status: 200,
  });
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  switch (path) {
    case "/flag":
      return getFlag(request);
    case "/capture":
      return captureFlag(request);
    case "/board":
      return getBoard(request);
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

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
