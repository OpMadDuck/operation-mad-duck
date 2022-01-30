const scoreBoard = flags => `
<!DOCTYPE html>
<html>
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
        overflow:hidden
    }
    
    h1, h2, h3 {
        color: #1d1d1f;
        text-align:center;
        background-color: white;
        padding: 18px;
        border-radius: 18px;
    }

    table {
        color: #1d1d1f;
        background-color: white;
        padding: 18px;
        margin: 18px;
        border-radius: 18px;
        min-width: 90%;
        font-size: larger;
        
    }

    th, td {
        padding: 2%;
    }

    table, th, td {
        border: 2px solid #F5F5F7;
        background-color: white;
        border-collapse: collapse;
    }
    
    .container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap:wrap
    }
    
    .subcontainer {
        width: 100vh;
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
              <th>
                Flag #
              </th>
              <th>
                Red Team
              </th>
              <th>
                Blue Team
              </th>
            </tr>
          </thead>
          <tbody id='scoreBoard'>
            <tr>
              <td>1</td>
              <td class="red">
                1155
              </td>
              <td class="green">
                1147
              </td>
            </tr>
          </tbody>
        </table>
        <h3 id="reset">Reset Scoreboard</h3>
      </div>
     </div>
  </body>

  <script>
    window.flags = ${flags}

    var populateFlags = function() {
      var scoreBoard = document.querySelector("#scoreBoard")
      scoreBoard.innerHTML = null

      window.flags.forEach((flag, index) => {
        var row = document.createElement("tr")
        var flagIndex = document.createElement("td")
        var redTeam = document.createElement("td")
        var blueTeam = document.createElement("td")

        flagIndex.innerHTML = index + 1
        redTeam.innerHTML = flag.red
        blueTeam.innerHTML = flag.blue

        row.appendChild(flagIndex)
        row.appendChild(redTeam)
        row.appendChild(blueTeam)
        scoreBoard.appendChild(row)
      })
    }

    var resetScoreBoard = function() {
      var data = [
        { red: null, blue: null },
        { red: null, blue: null },
        { red: null, blue: null },
        { red: null, blue: null },
        { red: null, blue: null },
        { red: null, blue: null },
        { red: null, blue: null }
      ]
      fetch("/", { method: "PUT", body: JSON.stringify({ flags: data }) })
      location.reload()
    }

    populateFlags()

    document.querySelector("#reset").addEventListener("click", resetScoreBoard)

  </script>
</html>
`

const flag = (flags, number) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Flag #${number}</title>
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

    h1 {
        margin-bottom: 25%;
    }
    
    .container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap:wrap
    }
    
    .subcontainer {
        width: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align:center;
    }

    .red {
      color: white;
      background-color: red;
    }

    .blue {
      color: white;
      background-color: blue;
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
            <h1>Capture Flag #${number}</h1>
            <h2 class="blue">Blue Team</h2>
            <h2 class="red">Red Team</h2>
        </div>
    </div>
  </body>

  <script>
    window.flags = ${flags}
    window.number = ${number}

    var updateFlags = function() {
      fetch("/", { method: "PUT", body: JSON.stringify({ flags: window.flags }) })
    }

    var alertUser = function(time, team) {
      alert(team + " captured Flag #${number} at " + time);
    }

    var redCapture = function(event) {
      let now = new Date()
      let nowReadable = now.toTimeString().split(" ")[0]
      window.flags[window.number].red = nowReadable
      updateFlags()
      alertUser(nowReadable, "Red Team")
    }

    var blueCapture = function(event) {
      let now = new Date()
      let nowReadable = now.toTimeString().split(" ")[0]
      window.flags[window.number].blue = nowReadable
      updateFlags()
      alertUser(nowReadable, "Blue Team")
    }

    document.querySelector(".red").addEventListener("click", redCapture)
    document.querySelector(".blue").addEventListener("click", blueCapture)
  </script>

</html>
`

const defaultData = {
  flags: [
    { red: null, blue: null },
    { red: null, blue: null },
    { red: null, blue: null },
    { red: null, blue: null },
    { red: null, blue: null },
    { red: null, blue: null },
    { red: null, blue: null }
  ]
}

const setCache = data => FLAGS.put("data", data)
const getCache = () => FLAGS.get("data")

async function getScoreBoard(request) {
  let data
  const cache = await getCache()
  if (!cache) {
    await setCache(JSON.stringify(defaultData))
    data = defaultData
  } else {
    data = JSON.parse(cache)
  }
  const body = scoreBoard(JSON.stringify(data.flags || []))
  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  })
}

async function getFlag(number) {
  let data
  const cache = await getCache()
  if (!cache) {
    await setCache(JSON.stringify(defaultData))
    data = defaultData
  } else {
    data = JSON.parse(cache)
  }
  const body = flag(JSON.stringify(data.flags || []), number)
  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  })
}

async function captureFlag(request) {
  const body = await request.text()
  try {
    JSON.parse(body)
    await setCache(body)
    return new Response(body, { status: 200 })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function handleRequest(request) {
  if (request.method === 'PUT') {
    return captureFlag(request)
  } else if (request.url.includes("flag")) {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')
    return getFlag(id)
  } else {
    return getScoreBoard(request)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})