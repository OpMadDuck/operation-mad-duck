const scoreBoard = (data) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Score Board</title>
    <style>
    body {
      margin: 0;
      font-family: system-ui;
      background-color: #F5F5F7;
      color: #1d1d1f;
      height: 100%;
    }
    
    h1, h2 {
      color: #1d1d1f;
      text-align:center;
      background-color: white;
      padding: 18px;
      border-radius: 18px;
    }

    table, th, td {
      background-color: white;
      border-collapse: collapse;
    }

    table {
      color: #1d1d1f;
      padding: 18px;
      margin: 18px;
      border: 2px solid #F5F5F7;
      border-radius: 18px;
      text-align: left;
      width: 100%;
    }

    th, td {
      padding: 1.5%;
      border: 2px solid #F5F5F7;
      overflow: hidden;
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
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap:wrap
    }
    
    .subcontainer {
      min-width: 50%;
      max-width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align:center;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #141414;
        color:#f6f5f7
      }
  
      h1 {
        color:#141414
      }

      table, th, td {
        border: 2px solid #141414;
      }
    }    
    </style>
  </head>

  <body>
    <div class="container">
      <div class="subcontainer">
        <h1>Operation Mad Duck</h1>
        <table>
          <thead>
            <tr>
              <th style="width:15%">
                Flag
              </th>
              <th style="width:15%">
                Time
              </th>
              <th style="width:70%">
                Contract
              </th>
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
    var populateFlags = function() {
      var scoreBoard = document.querySelector("#scoreBoard")
      const data = ${data}
      data.forEach((entry) => {
        var row = document.createElement("tr")

        var flag = document.createElement("td")
        var time = document.createElement("td")
        var contract = document.createElement("td")

        flag.innerHTML = entry.flag
        time.innerHTML = entry.time 
        contract.innerHTML = entry.contract

        row.appendChild(flag)
        row.appendChild(time)
        row.appendChild(contract)
        scoreBoard.appendChild(row)
      })
    }

    var resetScoreBoard = function() {
      if (confirm("The scoreboard will be reset. This action cannot be undone. Are you sure you wish to proceed?")) {
        fetch("/", { method: "PUT", body: JSON.stringify([]) })
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
    <style>
    body {
      margin: 0;
      font-family: system-ui;
      background-color: #F5F5F7;
      color: #1d1d1f;
      height: 100%;
      overflow:hidden
    }
    
    h1, h2 {
      color: #1d1d1f;
      text-align:center;
      background-color: white;
      padding: 18px;
      border-radius: 18px;
    }

    h2 {
      color: white;
      background-color: green;
    }

    .container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap:wrap
    }
    
    .subcontainer {
      min-width: 50%;
      max-width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align:center;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #141414;
        color: #f6f5f7;
      }
  
      h1 {
        color: #141414;
      }
    }    
    </style>
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
        fetch("/", { method: "PUT", body: JSON.stringify({flag: "${name}", time: time, contract: contract}) })
        .then(function(response) {
          if (!response.ok) {
            alert("HTTP Error " + response.status + ". Please try again.");
          } else {
            alert("Successfully captured the name Flag at " + time);
          }
        })
      }
    }

    var requestContract = () => {
      let contract = prompt("Please enter your team's contract:");
      captureFlag(contract)
    }

    document.querySelector("h2").addEventListener("click", (event) => {requestContract()})
  </script>

</html>
`;

const getData = () => FLAGS.get("data");
const setData = (data) => FLAGS.put("data", data);

const defaultData = [
  {
    flag: "Broncos",
    time: "10:12:33",
    contract: "RED GLAMOR BRONCOS"
  }
]

const FLAGNAMES = ["Broncos", "Buccaneers", "Chargers", 
"Chiefs", "Cowboys", "Dolphins", "Giants", "Jaguars", 
"Jets", "Patriots", "Redskins", "Saints", "Seahawks", 
"Texans", "Titans", "Track | Blake", "Track | Triangle", 
"Vikings", "Washington"]

async function getScoreBoard(_request) {
  let data;
  const cache = await getData();
  if (!cache) {
    await setData(JSON.stringify(defaultData));
    data = defaultData;
  } else {
    data = JSON.parse(cache);
  }
  const body = scoreBoard(JSON.stringify(data || []));
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function getFlag(number) {
  const body = flag(FLAGNAMES[number]);
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function captureFlag(request) {
  const body = await request.text();
  console.log(body)
  try {
    console.log(JSON.parse(body))
    await setCache(body);
    return new Response(body, { status: 200 });
  } catch (err) {
    return new Response(err, { status: 500 });
  }
}

async function handleRequest(request) {
  if (request.method === "PUT") {
    return captureFlag(request);
  } else if (request.url.includes("flag")) {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    if (id >= 1 && id <= FLAGNAMES.length) {
      return getFlag(id);
    } else {
      return getScoreBoard(request);
    }
  } else {
    return getScoreBoard(request);
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
