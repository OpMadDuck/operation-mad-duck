/**
 * Summary of changes:
 * [+] Added input sanitization for XSS vulnerability
 * [+] Added geofencing functionality so users must be within 50 meters when submitting contracts to capture flags
 * [++] NOTE: Geofencing will require users to allow mobile browser location permissions
 * [++] Recommend requiring users to test a QR code together in class prior to ROC drill
 * [+] Added functionality to append user's current location data and distance from flag to scoreboard upon successful submission
 * [+] Added redirect to send user directly to scoreboard upon succesful contract submission for positive verification
 * [+] Remove password text from reset dialog box to ensure only the instructor can reset the scoreboard
 * [+] Added color-coding for successful flag captures to make appearance more appealing
 * [+] Added splashPage html variable and case for visiting / (instead of just a 404 like before)
 * [+] Added buttons to enable inject points, which are now disabled by default
 * 
 * [ ] To Do:
 * [ ] Find a way to push injects via scoreboard alerts?
 * [ ] Breadcrumb tracking?
 * [ ] Penalties based on inverse geofencing? Could have a /penalty page that users get redirected to if they enter fenced-off area that displays penalty timer and prevents contract submission via session cookie?
 * [ ] Only show Chargers and Ravens on scoreboard after inject has been released
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
        if (contract) {
          console.log("About to ask for location...");
          navigator.geolocation.getCurrentPosition((position) => {

            // Include the user's location and distance from the flag in contract logs. -GKT
            const userLocation = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            const targetLocation = ${JSON.stringify(FLAG_COORDS)}; // Inject FLAG_COORDS into the page -GKT
            const target = targetLocation[id]; // Updated to prevent stringify errors? -GKT

            // Gives user error if bad QR code is scanned prior to geolocation math. -GKT
            if (!id || !target) {
              alert("Invalid flag ID.");
              return;
            }

            const distance = Math.round(
              (function calculateDistance(loc1, loc2) {
                const toRad = (val) => val * Math.PI / 180;
                const R = 6371e3;
                const dLat = toRad(loc2.lat - loc1.lat);
                const dLon = toRad(loc2.lon - loc1.lon);
                const a = Math.sin(dLat / 2) ** 2 +
                          Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
                          Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
              })(userLocation, target)
            );

            const payload = {
              contract,
              location: userLocation,
              distance
            };

            fetch("/capture?id=" + id, {
              method: "POST",
              body: JSON.stringify(payload),
              headers: { "Content-Type": "application/json" }
            }).then(async (response) => {
              if (!response.ok) {
                const errorText = await response.text();
                alert("Capture failed.\\n" +
                      "Your location: (" + payload.location.lat.toFixed(6) + ", " + payload.location.lon.toFixed(6) + ")\\n" +
                      errorText);
              } else {
                window.location.replace("/confirm");
              }
            }).catch((err) => {
              alert("Unexpected error submitting contract: " + err.message);
            });
          }, (error) => {
            alert("Geolocation is required to capture this flag.\\n\\n" +
                  "Error: " + error.message + "\\n" +
                  "Please enable location access in your browser settings and reload the page.");
          });
        }
      };

    /**
     * requestContract prompts the user to submit their team's contract to 
     * capture the flag, and then passes the result to the captureFlag function.
     * @param {Event} _event
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
  </body> <!-- Moved /body tag to encompass JS code section due to button click (document.querySelector("h2") returning null. -GKT -->
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
       * Keep both team and index for color-coded contract submissions. -GKT
       */

      name.textContent = flag.name || "";
      if (flag.enabled === false) {
        name.textContent += " (disabled)";
        name.style.opacity = "0.6";
      };

      // Determine winner
      var winningTeam = null;
      var winningContractID = -1;

      if (flag.winner) {
        var parts = flag.winner.split(',');
        winningTeam = parts[0];                 // 'red' or 'blue'
        winningContractID = parseInt(parts[1], 10);

        if (winningTeam === 'red') {
          red.textContent = String(flag.red);
        } else if (winningTeam === 'blue') {
          blue.textContent = String(flag.blue);
        }

        // Style the flag name cell to indicate winner
        if (winningTeam === 'red') {
          name.style.backgroundColor = 'rgb(255,0,0)';
          name.style.color = '#fff';
          name.style.fontWeight = '700';
          name.textContent = '🏆 ' + flag.name;   // optional flair
        } else if (winningTeam === 'blue') {
          name.style.backgroundColor = 'rgb(0,0,255)';
          name.style.color = '#fff';
          name.style.fontWeight = '700';
          name.textContent = '🏆 ' + flag.name;   // optional flair
        }
      }

      for (var i = 0; i < flag.contracts.length; i++) {
        var isWinner = (i === winningContractID);
        var line = flag.times[i] + 'Z - ' + escapeHtml(flag.contracts[i]);

        if (isWinner) {
          contracts.innerHTML += '<strong>' + line + '</strong><br>';
        } else {
          contracts.innerHTML += '<em>' + line + '</em><br>';
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
        <h2>Test</h2>
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
        alert("Please enter instructor password.")
      }
    }

    /**
     * requestConfirmation prompts the user to submit their proper confirmation 
     * message to reset the game.
     * @param {Event} _event
     */
    var requestConfirmation = (_event) => {
      let confirmation = prompt("Please enter instructor password to reset the scoreboard:");
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
 * injectPage returns a response body as a string. The response body contains
 * buttons which will enable new points to be captured and populate them on
 * the score board. A board reset will revert these points to a deactivated state. -GKT
 */
const injectPage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Injects</title>
    ${style}
  </head>
  <body>
    <div class="container">
      <div class="subcontainer">
        <h2 data-type="chargers">Enable Chargers Inject!</h2>
        <h2 data-type="ravens">Enable Ravens Inject!</h2>
      </div>
     </div>
  </body>
  <script>
    function callInject(qs, confirmation) {
      return fetch("/inject" + qs, { method: "POST", body: confirmation });
    }

    function requestConfirmation(ev) {
      var el = ev.currentTarget;
      var type = el.getAttribute("data-type");
      var confirmation = prompt("Please enter instructor password to enable the new point:");
      if (!confirmation) return;

      var qs = "?type=" + encodeURIComponent(type);
      callInject(qs, confirmation).then(function(res) {
        if (!res.ok) alert("Please enter instructor password.");
        else window.location.href = "/board";
      }).catch(function(err) {
        alert("Unexpected error: " + err.message);
      });
    }

    var buttons = document.querySelectorAll("h2[data-type]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", requestConfirmation);
    }
  </script>
</html>
`;


/**
 * splashPage returns a response body as a string. The response body contains
 * a simple landing page for Operation Mad Duck with links to key game
 * functions, such as viewing the scoreboard and capturing flags. It serves
 * as the default page when visiting the root ("/") of the Worker. -GKT
 */
const splashPage = `
<!DOCTYPE html>
<html>
<head>
<title>Operation Mad Duck</title>
<style>
  body { font-family: Arial, sans-serif; text-align: center; margin-top: 10%; }
  h1 { color: #333; }
  a { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
  a:hover { background: #0056b3; }
</style>
</head>
<body>
  <h1>Welcome to Operation Mad Duck</h1>
  <p>Select an option below:</p>
  <a href="/board">View Scoreboard</a><br>
  <a href="/reset">Reset Scoreboard</a><br>
  <a href="/inject">Enable Injects</a><br>
</body>
</html>
`;


/**
 * FLAG_COORDS contains (updated*) coordinates of each flag for geofencing. Adjust as needed. -GKT
 */
const FLAG_COORDS = {
  "1": { lat: 30.4200, lon: -88.7736 }, // Broncos lat: 30.4062, lon: -88.9197
  "2": { lat: 30.4163, lon: -88.9237 }, // Buccaneers
  "3": { lat: 30.4148, lon: -88.9170 }, // Chargers 
  "4": { lat: 30.4126, lon: -88.9131 }, // Chiefs 
  "5": { lat: 30.4049, lon: -88.9123 }, // Commanders 
  "6": { lat: 30.4006, lon: -88.9139 }, // Cowboys 
  "7": { lat: 30.4100, lon: -88.9132 }, // Dolphins 
  "8": { lat: 30.4081, lon: -88.9191 }, // Eagles 
  "9": { lat: 30.4010, lon: -88.9284 }, // Giants 
  "10": { lat: 30.4112, lon: -88.9127 }, // Jaguars 
  "11": { lat: 30.4089, lon: -88.9063 }, // Jets 
  "12": { lat: 30.4137, lon: -88.9094 }, // Patriots 
  "13": { lat: 30.4089, lon: -88.9132 }, // Ravens 
  "14": { lat: 30.3987, lon: -88.9293 }, // Saints 
  "15": { lat: 30.4051, lon: -88.9098 }, // Seahawks 
  "16": { lat: 30.4105, lon: -88.9107 }, // Texans 
  "17": { lat: 30.4003, lon: -88.9282 }, // Titanss
  "18": { lat: 30.3995, lon: -88.9109 }  // Vikings
};

/** calculateDistance shows the user's current distance from the specified flag. -GKT
 */

function calculateDistance(loc1, loc2) {
  const toRad = (val) => val * Math.PI / 180;
  const R = 6371e3; // meters
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lon - loc1.lon);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** isWithinRadius compares user's current location to predefined flag coordinates.
 * Flags can only be captured if user is within 50m of flag. 
 * Update radiusMeters below to increase/decrease the geofence radius size. -GKT 
 */
function isWithinRadius(loc1, loc2, radiusMeters = 50) {
  return calculateDistance(loc1, loc2) <= radiusMeters; // Return result of calculateDistance instead. -GKT
}

/**
 * getFlag consumes a request forwarded by the handleRequest() function
 * and supplies a dynamic Response containing a flagPage.
 * @param {Request} request
 * @returns {Response}
 * Updated scope for env. -GKT
 */
async function getFlag(request, env) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const flag = await env.FLAGS.get(id.toString(), { type: "json" });

  // Determine if flag exists
  if (!flag) return new Response("The requested resource could not be found 🦆", { status: 404 });

  // Determine if flag is enabled (for inject flags)
  if (!flag.enabled) return new Response("This flag isn't active yet.", { status: 403 });

  const body = flagPage(flag);
  return new Response(body, {
    headers: { "Content-Type": "text/html",
    "Permissions-Policy": "geolocation=self" // Added Permissions-Policy header for mobile browser compatibility (especially Safari). -GKT
    },
  });
}

/**
 * captureFlag consumes a request forwarded by the handleRequest() function
 * and runs a check on the submitted contract prior to logging it's contents.
 * After passing all required checks, data is updated in the KV store.
 * @param {Request} request
 * @returns {Response}
 * Updated scope for env. -GKT
 */
async function captureFlag(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const json = await request.json();
    const contract = json.contract;
    const location = json.location;

    const target = FLAG_COORDS[id];

    // Check for missing location data
    if (!location || !target) {
      return new Response("Missing geolocation data or invalid flag ID.", {
        status: 400,
      });
    }

    // Calculate distance from user to flag
    const distance = calculateDistance(location, target);

    // Check geofence radius (50 meters)
    if (!isWithinRadius(location, target)) {
      return new Response(
        `You are outside the allowed location to capture this flag.\nDistance: ${Math.round(distance)} meters.`,
        { status: 403 }
      );
    }

    // Load flag data from KV
    const flag = await env.FLAGS.get(id, { type: "json" });
    if (!flag) return new Response("Flag not found in KV store.", { status: 404 });

    // Determine if flag is enabled (for inject flags)
    if (!flag.enabled) return new Response("This flag has not been activated yet.", {status: 403});

    // Determine winner if not already set
    let winner = flag.winner ? flag.winner : await check(contract, id, env);

    // Update KV store with new contract
    await env.FLAGS.put(
      id,
      JSON.stringify({
        name: flag.name,
        times: flag.times.concat(new Date().toTimeString().split(" ")[0]),
        //contracts: flag.contracts.concat(contract),
        contracts: flag.contracts.concat(`${contract} (Location: ${location.lat.toFixed(5)}, ${location.lon.toFixed(5)} | Distance from target: ${Math.round(distance)}m)`), // Replace this with the previous line to not display location data on scoreboard. -GKT
        red: flag.red,
        blue: flag.blue,
        winner: winner,
      })
    );

    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response("Error: " + err.toString(), { status: 500 });
  }
}

/**
 * escapeRegExp performs contract input validation for consistent contracts. -GKT
 */

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


/**
 * check consumes a contract statement and flag ID from the captureFlag()
 * function. If the supplied contract is correct, then a result is returned
 * bearing the winning team and an index of the winning contract
 * @param {String} contract
 * @param {String} id
 * @returns {String} winningTeam,winningContract
 */
async function check(contract, id, env) {
  const flag = await env.FLAGS.get(id, { type: "json" });
  // Updated variables below for more consistent regex checks via escapeRegExp(). -GKT
  const safeName = escapeRegExp(flag.name);
  const redExp  = new RegExp(`Red HQ(,|\\s)[\\S\\s]*?(,|\\s)Touchdown ${safeName}`, "i");
  const blueExp = new RegExp(`Blue HQ(,|\\s)[\\S\\s]*?(,|\\s)Touchdown ${safeName}`, "i");

  const idx = Array.isArray(flag.contracts) ? flag.contracts.length : 0;

  if (redExp.test(contract))  return "red," + idx;
  if (blueExp.test(contract)) return "blue," + idx;
  return null;
}

/**
 * getBoard consumes a request forwarded by the handleRequest() function
 * and returns a response with boardPage in the body. All data must be
 * retrieved from the KV store prior to issuing a Response.
 * @returns {Response}
 * Updated scope for env. -GKT
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
 * @returns {Response}
 * Updated scope for env. -GKT
 * 
 * To update the point values for each flag, change the values in resetBoard below.
 * Once the scoreboard is reset, it will await contract submission and award the points 
 * listed below if all criteria are met. 
 * 
 * The points can also be reset in the KV pairs section of the Cloudflare deployment. 
 * These are the default/original values, so these values appear until a reset happens. 
 * Once a reset happens, the KV pairs are overwritten with whatever is defined below. 
 * Therefore, the values below SHOULD match the KV pair values, but don't necessarily have to. -GKT
 * 
 */
async function resetBoard(request, env) {
  if (request.method !== "POST") {
    return new Response(resetPage, { headers: { "Content-Type": "text/html" } });
  }

  const confirmation = await request.text();
  if (confirmation !== "RESETMADDUCK") {
    return new Response("Incorrect reset password.", { status: 400 });
  }

  const data = {
    "1":  { name:"Broncos",    times:[], contracts:[], red:800,  blue:800,  winner:null, enabled:true },
    "2":  { name:"Buccaneers", times:[], contracts:[], red:0,    blue:1200, winner:null, enabled:true },
    "3":  { name:"Chargers",   times:[], contracts:[], red:400,  blue:400,  winner:null, enabled:false }, // inject point
    "4":  { name:"Chiefs",     times:[], contracts:[], red:800,  blue:200,  winner:null, enabled:true },
    "5":  { name:"Commanders", times:[], contracts:[], red:400,  blue:400,  winner:null, enabled:true },
    "6":  { name:"Cowboys",    times:[], contracts:[], red:600,  blue:400,  winner:null, enabled:true },
    "7":  { name:"Dolphins",   times:[], contracts:[], red:600,  blue:600,  winner:null, enabled:true },
    "8":  { name:"Eagles",     times:[], contracts:[], red:400,  blue:400,  winner:null, enabled:true },
    "9":  { name:"Giants",     times:[], contracts:[], red:200,  blue:600,  winner:null, enabled:true },
    "10": { name:"Jaguars",    times:[], contracts:[], red:800,  blue:200,  winner:null, enabled:true },
    "11": { name:"Jets",       times:[], contracts:[], red:200,  blue:200,  winner:null, enabled:true },
    "12": { name:"Patriots",   times:[], contracts:[], red:800,  blue:200,  winner:null, enabled:true },
    "13": { name:"Ravens",     times:[], contracts:[], red:200,  blue:200,  winner:null, enabled:false }, //inject point
    "14": { name:"Saints",     times:[], contracts:[], red:200,  blue:600,  winner:null, enabled:true },
    "15": { name:"Seahawks",   times:[], contracts:[], red:800,  blue:200,  winner:null, enabled:true },
    "16": { name:"Texans",     times:[], contracts:[], red:200,  blue:800,  winner:null, enabled:true },
    "17": { name:"Titans",     times:[], contracts:[], red:1200, blue:600,  winner:null, enabled:true },
    "18": { name:"Vikings",    times:[], contracts:[], red:200,  blue:800,  winner:null, enabled:true }
  };

  await Promise.all(Object.entries(data).map(([k, v]) =>
    env.FLAGS.put(k, JSON.stringify(v))
  ));

  return new Response(null, { status: 200 });
}


/**
 * confirmContract will notify the user that their submitted
 * contract has been logged successfully by the Worker.
 * @returns {Response}
 * 
 * Added a redirect to the scoreboard upon successful
 * contract submission. -GKT
 */
async function confirmContract() {
  return Response.redirect("https://gtbranch-development.madduck.workers.dev/board", 303);
}

// Define which flags will be disabled by default and enabled at instructor discretion. -GKT
var INJECT_TARGETS = { chargers: "3", ravens: "13" };

/**
 * enableInject will provide a convenient way for instructors to 
 * enable inject points as required. -GKT
 */
async function enableInject(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  var confirmation = await request.text();
  if (confirmation !== "INJECTMADDUCK") {
    return new Response("Forbidden", { status: 403 });
  }

  var url = new URL(request.url);
  var type = url.searchParams.get("type");
  var id = INJECT_TARGETS[type];
  if (!id) {
    return new Response("Unknown inject type", { status: 400 });
  }

  var flag = await env.FLAGS.get(id, { type: "json" });
  if (!flag) {
    return new Response("Flag not found", { status: 404 });
  }

  // Flip enabled to true; leave points and everything else untouched
  var updated = {
    name: flag.name,
    times: Array.isArray(flag.times) ? flag.times : [],
    contracts: Array.isArray(flag.contracts) ? flag.contracts : [],
    red: flag.red,
    blue: flag.blue,
    winner: flag.winner || null,
    enabled: true
  };

  await env.FLAGS.put(id, JSON.stringify(updated));
  await env.FLAGS.put("__last_inject", JSON.stringify({ type: type, id: id, when: Date.now() }));

  return new Response(null, { status: 200 });
}


/**
 * handleRequest consumes a request forwarded by the main event listener.
 * Depending on the URL path, this function defers Responses to the functions
 * written above. If no suitable function is found for the requested path,
 * a 404 Not Found response is issued to the user. Quack!
 * @param {Request} request
 * @returns {Response}
 * Updated scope for env. -GKT
 */
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  switch (path) {
    case "/":
      return new Response(splashPage, {
        headers: { "Content-Type": "text/html" },
      });
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
    /** 
     * The inject case is a little more complicated because enableInject() 
     * modifies data on the server, whereas the other pages/functions are
     * read-only. Therefore, /inject must use the POST method, whereas the
     * other cases can use the GET method. -GKT
     */
    case "/inject": 
      if (request.method === "GET") {
        return new Response(injectPage, {
          headers: { "Content-Type": "text/html" },
        });
      } else if (request.method === "POST") {
        return enableInject(request, env);
      } else {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { "Allow": "GET, POST" },
        });
      }
    default:
      return new Response("The requested resource could not be found 🦆", {
        status: 404,
      });
  }
}

/**
 * Listen for a fetch event. When such an event occurs, respond with
 * the data provided by the handleRequest() function above.
 * Updated syntax to help with Cloudflare build. -GKT
 */
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
}
