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
    
    h1, h2 {
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
    
    a {
        color: white;
        text-decoration:none
    }
    
    a:hover {
        text-decoration:underline
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
        color: red;
    }

    .green {
        color: green;
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
      </div>
     <div id="todos"></div>
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

    populateFlags()

  </script>
</html>
`

const flag = todos => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Flag 1</title>
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
    
    a {
        color: white;
        text-decoration:none
    }
    
    a:hover {
        text-decoration:underline
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
        background-color: red;
    }

    .blue {
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
            <h1>Capture Flag #1</h1>
            <h2 class="blue"><a href='#blue'>Blue Team</a></h2>
            <h2 class="red"><a href='#red'>Red Team</a></h2>
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

  populateFlags()

  </script>

</html>
`

const defaultData = {
  flags: [
    // { red: 1155, blue: 1147 },
    // { red: null, blue: 1153 },
    // { red: 1202, blue: 1230 },
    // { red: 1215, blue: 1246 },
    // { red: null, blue: 1300 },
    // { red: 1305, blue: 1327 },
    // { red: 1309, blue: null }
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
  const body = scoreBoard(JSON.stringify(data.flags))
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
  const body = flag(JSON.stringify(data.todos || []).replace(/</g, "\\u003c"))
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
  } else if (request.url.includes("flag1")) {
    return getFlag(1)
  } else {
    return getScoreBoard(request)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})