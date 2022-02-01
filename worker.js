const scoreBoard = (flags) => `
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
    
    h1, h2, h3 {
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
      font-size: large;
      text-align: left;
      width: 90%;
    }

    th, td {
      padding: 2%;
      border: 2px solid #F5F5F7;
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
      width: 100%;
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
              <th style="width:25%">
                Flag
              </th>
              <th style="width:37.5%">
                Red Team
              </th>
              <th style="width:37.5%">
                Blue Team
              </th>
            </tr>
          </thead>
          <tbody id='scoreBoard'>
          </tbody>
        </table>
        <h2 id="reset">Reset Scoreboard</h3>
      </div>
     </div>
  </body>

  <script>
    window.flags = ${flags}

    var populateFlags = function() {
      var scoreBoard = document.querySelector("#scoreBoard")
      scoreBoard.innerHTML = null

      window.flags.forEach((flag) => {
        var row = document.createElement("tr")
        var flagIndex = document.createElement("td")
        var redTeam = document.createElement("td")
        var blueTeam = document.createElement("td")

        flagIndex.innerHTML = flag.name

        if (flag.red.time && flag.red.contract) {
          redTeam.innerHTML = flag.red.time + " " + flag.red.contract
        }
        
        if (flag.blue.time && flag.blue.contract) {
          blueTeam.innerHTML = flag.blue.time + " " + flag.blue.contract
        }

        row.appendChild(flagIndex)
        row.appendChild(redTeam)
        row.appendChild(blueTeam)
        scoreBoard.appendChild(row)
      })
    }

    var resetScoreBoard = function() {
      if (confirm("The scoreboard will be reset. This action cannot be undone. Are you sure you wish to proceed?")) {
        var data = [
          { name: 'Broncos', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Buccaneers', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Chargers', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Chiefs', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Cowboys', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Dolphins', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Giants', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Jaguars', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Jets', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Patriots', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Redskins', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Saints', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Seahawks', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Texans', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Thai', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Track | Blake', red: { time: null, contract: null }, blue: { time: null, contract: null } },
          { name: 'Track | Triangle', red: { time: null, contract: null }, blue: { time: null, contract: null } }
        ]
        fetch("/", { method: "PUT", body: JSON.stringify({ flags: data }) })
        .then(function(response) {
          if (response.ok) {
            location.reload()
          } else {
            alert("Could not reset the scoreboard. Please try again")
          }
        })
      }
    }

    populateFlags()

    document.querySelector("#reset").addEventListener("click", resetScoreBoard)

  </script>
</html>
`;

const flag = (flags, number, name) => `
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

    .container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap:wrap
    }
    
    .subcontainer {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align:center;
    }

    .red {
      color: white;
      background-color: red;
      margin: 20% 0%;
    }

    .blue {
      color: white;
      background-color: blue;
      margin: 20% 0%;
    }

    .buttons {
      margin: 20% 0%;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #141414;
        color:#f6f5f7
      }
  
      h1 {
        color:#141414
      }
    }    
    </style>
  </head>

  <body>
    <div class="container">
        <div class="subcontainer">
            <h1>${name} Flag</h1>
            <div class="buttons">
              <h2 class="blue">Blue Team</h2>
              <h2 class="red">Red Team</h2>
            </div>
        </div>
    </div>
  </body>

  <script>
    window.flags = ${flags}
    window.number = ${number}

    var updateFlags = function(team, contract) {
      let time = (new Date).toTimeString().split(" ")[0]
      if (team === "Red") {
        window.flags[window.number - 1].red.time = time
        window.flags[window.number - 1].red.contract = contract
      } else if (team === "Blue") {
        window.flags[window.number - 1].blue.time = time
        window.flags[window.number - 1].blue.contract = contract
      }

      if (contract) {
        fetch("/", { method: "PUT", body: JSON.stringify({ flags: window.flags }) })
        .then(function(response) {
          if (!response.ok) {
            alert("HTTP Error " + response.status + ". Please try again.");
          } else {
            alert(team + " Team captured ${name} Flag at " + time);
          }
        })
      }
    }

    var requestContract = function(team) {
      let contract = prompt("Please enter " + team + " Team's contract:");
      updateFlags(team, contract)
    }

    document.querySelector(".red").addEventListener("click", (event) => {requestContract("Red")})
    document.querySelector(".blue").addEventListener("click", (event) => {requestContract("Blue")})
  </script>

</html>
`;

const defaultData = {
  flags: [
    {
      name: "Broncos",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Buccaneers",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Chargers",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Chiefs",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Cowboys",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Dolphins",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Giants",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Jaguars",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Jets",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Patriots",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Redskins",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Saints",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Seahawks",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Texans",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Thai",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Track | Blake",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
    {
      name: "Track | Triangle",
      red: { time: null, contract: null },
      blue: { time: null, contract: null },
    },
  ],
};

const setCache = (data) => FLAGS.put("data", data);
const getCache = () => FLAGS.get("data");

async function getScoreBoard(request) {
  let data;
  const cache = await getCache();
  if (!cache) {
    await setCache(JSON.stringify(defaultData));
    data = defaultData;
  } else {
    data = JSON.parse(cache);
  }
  const body = scoreBoard(JSON.stringify(data.flags || []));
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function getFlag(number) {
  let data;
  const cache = await getCache();
  if (!cache) {
    await setCache(JSON.stringify(defaultData));
    data = defaultData;
  } else {
    data = JSON.parse(cache);
  }
  const body = flag(
    JSON.stringify(data.flags || []),
    number,
    data.flags[number - 1]["name"]
  );
  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  });
}

async function captureFlag(request) {
  const body = await request.text();
  try {
    JSON.parse(body);
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
    if (id >= 1 && id <= 17) {
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
