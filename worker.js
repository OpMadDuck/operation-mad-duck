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
  border: 2px solid gray;
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
  padding: 1.5%;
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
max-width: 90%;
min-width: 50%;
text-align:center;
}
</style>
`;

const scoreBoard = (data) => `
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
        <h1>Operation Mad Duck</h1>
        <table>
          <thead>
            <tr>
              <th style="width:15%">Time</th>
              <th style="width:25%">Flag</th>
              <th style="width:60%">Contract</th>
            </tr>
          </thead>
          <tbody id='scoreBoard'>
          </tbody>
        </table>
        <h2>Reset Scoreboard</h2>
      </div>
     </div>
  </body>
  <script>
    var populateFlags = () => {
      var scoreBoard = document.querySelector("#scoreBoard")
      const data = ${data}
      data.forEach((entry) => {
        var row = document.createElement("tr")
        var time = document.createElement("td")
        var flag = document.createElement("td")
        var contract = document.createElement("td")
        time.innerHTML = entry.time
        flag.innerHTML = entry.flag
        contract.innerHTML = entry.contract
        row.appendChild(time)
        row.appendChild(flag)
        row.appendChild(contract)
        scoreBoard.appendChild(row)
      })
    }
    var resetScoreBoard = (_event) => {
      if (confirm("The scoreboard will be reset. This action cannot be undone. Are you sure you wish to proceed?")) {
        fetch("/reset", { method: "DELETE" })
        .then(function(response) {
          if (response.ok) {
            location.reload()
          } else {
            alert("An error occurred. Please try again")
          }
        })
      }
    }
    populateFlags()
    document.querySelector("h2").addEventListener("click", resetScoreBoard)
  </script>
</html>
`;

const flag = (name) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | ${name} Flag</title>
    ${style}
  </head>
  <body>
    <div class="container">
        <div class="subcontainer">
          <h1>${name} Flag</h1>
          <h2>Capture!</h2>
        </div>
    </div>
  </body>
  <script>
    var captureFlag = (contract) => {
      let time = (new Date).toTimeString().split(" ")[0]
      if (contract) {
        fetch("/", { method: "PUT", body: JSON.stringify({flag: "${name}", time: time, contract: contract})})
        .then(function(response) {
          if (!response.ok) {
            alert("HTTP Error " + response.status + ". Please try again.");
          } else {
            alert("Successfully captured the ${name} Flag at " + time);
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

const FLAGNAMES = [
  "Broncos",
  "Buccaneers",
  "Chargers",
  "Chiefs",
  "Cowboys",
  "Dolphins",
  "Giants",
  "Jaguars",
  "Jets",
  "Patriots",
  "Redskins",
  "Saints",
  "Seahawks",
  "Texans",
  "Titans",
  "Track | Blake",
  "Track | Triangle",
  "Vikings",
  "Washington",
];

const getCache = () => FLAGS.get("data");
const setCache = (data) => FLAGS.put("data", data);

async function getScoreBoard(_request) {
  let data;
  const cache = await getCache();
  if (!cache) {
    await setCache(JSON.stringify([]));
    data = [];
  } else {
    data = JSON.parse(cache);
  }
  const body = scoreBoard(JSON.stringify(data));
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function resetScoreBoard() {
  try {
    await setCache(JSON.stringify([]));
    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response(err, { status: 500 });
  }
}

async function getFlag(number) {
  if (number >= 1 && number < FLAGNAMES.length) {
    const body = flag(FLAGNAMES[number]);
    return new Response(body, {
      headers: { "Content-Type": "text/html" },
    });
  } else {
    return new Response("The requested flag does not exist", { status: 404 });
  }
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
  } else if (request.url.includes("reset")) {
    return resetScoreBoard();
  } else if (request.url.includes("flag")) {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    return getFlag(id);
  } else {
    return getScoreBoard(request);
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
