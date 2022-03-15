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

th:first-of-type {
  border-top-left-radius: 18px;
}

th:last-of-type {
  border-top-right-radius: 18px;
}

tr:last-of-type td:first-of-type {
  border-bottom-left-radius: 18px;
}

tr:last-of-type td:last-of-type {
  border-bottom-right-radius: 18px;
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

const board = (flags) => `
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
              <th style="width:20%">Name</th>
              <th style="width:20%">Time</th>
              <th style="width:40%">Contract</th>
              <th style="width:10%">Red Points</th>
              <th style="width:10%">Blue Points</th>
            </tr>
          </thead>
          <tbody id='scoreBoard'>
          </tbody>
          <tfoot>
            <tr>
            <th></th>
            <th></th>
            <th></th>
            <th id='redSum'></th>
            <th id='blueSum'></th>
            </tr>
          </thead>
        </table>
        <h2>Reset Scoreboard</h2>
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
        var time = document.createElement("td")
        var contract = document.createElement("td")
        var red = document.createElement("td")
        var blue = document.createElement("td")

        name.innerHTML = flag.name
        time.innerHTML = flag.time
        contract.innerHTML = flag.contract
        red.innerHTML = (flag.winner === 'red') ? flag.red : null
        blue.innerHTML = (flag.winner === 'blue') ? flag.blue : null

        row.appendChild(name)
        row.appendChild(time)
        row.appendChild(contract)
        row.appendChild(red)
        row.appendChild(blue)

        scoreBoard.appendChild(row)

        if (flag.winner === 'red') {
          redSum += flag.red
        } else if (flag.winner === 'blue') {
          blueSum += flag.blue
        }

        document.querySelector("#redSum").innerHTML = redSum
        document.querySelector("#blueSum").innerHTML = blueSum
      })
    }
    var reset = (confirmation) => {
      if (confirmation === 'RESET') {
        fetch("/reset", { method: "DELETE", body: confirmation })
        .then( (response) => {
          if (response.ok) {
            location.reload()
          } else {
            alert("An error occurred. Please try again")
          }
        })
      }
    }
    var requestConfirmation = (_event) => {
      let confirmation = prompt("Please enter RESET to reset the scoreboard:");
      reset(confirmation)
    }
    document.querySelector("h2").addEventListener("click", requestConfirmation)
    populateData()
  </script>
</html>
`;

const banner = (flag) => `
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
    var captureFlag = (contract) => {
      let time = (new Date).toTimeString().split(" ")[0]
      if (contract) {
        fetch("/", { method: "PUT", body: JSON.stringify({time: time, contract: contract})})
        .then((response) => {
          if (!response.ok) {
            alert("HTTP Error " + response.status + ". Please try again.");
          } else {
            alert("Captured flag at " + time);
          }
        })
      }
    }
    var requestContract = (_event) => {
      let contract = prompt("Please enter your team's contract:");
      captureFlag(contract)
    }
    document.querySelector("h2").addEventListener("click", requestContract)
  </script>
</html>
`;

// V2 COMPATIBLE
async function getScoreBoard(_request) {
  const promises = [];

  for await (const key of Array(18).keys()) {
      promises.push(FLAGS.get((key + 1).toString(), {type: "json"}))
  }

  const data = await Promise.all(promises)
  const body = board(JSON.stringify(data));
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function reset(request) {
  const confirmation = await request.text();
  if (confirmation === "RESET") {
    await setCache("[]");
    return new Response(null, { status: 200 });
  }
}

async function getFlag(request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("id")
  const flag = await FLAGS.get(number)
  if (flag === null) {
    return new Response("The requested flag does not exist!", { status: 404 });
  }

  const body = banner(flag);
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function captureFlag(request) {
  try {
    const update = await request.json();
    const cache = await getCache();
    let data = JSON.parse(cache);
    data.push(update);
    await setCache(JSON.stringify(data));
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response(err, { status: 500 });
  }
}

async function handleRequest(request) {
  if (request.method === "PUT") {
    return captureFlag(request);
  } else if (request.method === "DELETE") {
    return reset(request);
  } else if (request.url.includes("flag")) {
    return getFlag(request);
  } else {
    return getScoreBoard(request);
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
