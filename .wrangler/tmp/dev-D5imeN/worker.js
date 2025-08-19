(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // wrangler-modules-watch:wrangler:modules-watch
  var import_middleware_insertion_facade;
  var init_wrangler_modules_watch = __esm({
    "wrangler-modules-watch:wrangler:modules-watch"() {
      import_middleware_insertion_facade = __toESM(require_middleware_insertion_facade());
      init_modules_watch_stub();
    }
  });

  // node_modules/wrangler/templates/modules-watch-stub.js
  var init_modules_watch_stub = __esm({
    "node_modules/wrangler/templates/modules-watch-stub.js"() {
      init_wrangler_modules_watch();
    }
  });

  // node_modules/wrangler/templates/middleware/common.ts
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }
  var import_middleware_insertion_facade2, __facade_middleware__;
  var init_common = __esm({
    "node_modules/wrangler/templates/middleware/common.ts"() {
      import_middleware_insertion_facade2 = __toESM(require_middleware_insertion_facade());
      init_modules_watch_stub();
      __facade_middleware__ = [];
      __name(__facade_register__, "__facade_register__");
      __name(__facade_registerInternal__, "__facade_registerInternal__");
      __name(__facade_invokeChain__, "__facade_invokeChain__");
      __name(__facade_invoke__, "__facade_invoke__");
    }
  });

  // node_modules/wrangler/templates/middleware/loader-sw.ts
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  var import_middleware_insertion_facade3, __FACADE_EVENT_TARGET__, __facade__originalAddEventListener__, __facade__originalRemoveEventListener__, __facade__originalDispatchEvent__, __facade_waitUntil__, __facade_response__, __facade_dispatched__, __Facade_ExtendableEvent__, __Facade_FetchEvent__, __Facade_ScheduledEvent__;
  var init_loader_sw = __esm({
    "node_modules/wrangler/templates/middleware/loader-sw.ts"() {
      import_middleware_insertion_facade3 = __toESM(require_middleware_insertion_facade());
      init_modules_watch_stub();
      init_common();
      if (globalThis.MINIFLARE) {
        __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
      } else {
        __FACADE_EVENT_TARGET__ = new EventTarget();
      }
      __name(__facade_isSpecialEvent__, "__facade_isSpecialEvent__");
      __facade__originalAddEventListener__ = globalThis.addEventListener;
      __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
      __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
      globalThis.addEventListener = function(type, listener, options) {
        if (__facade_isSpecialEvent__(type)) {
          __FACADE_EVENT_TARGET__.addEventListener(
            type,
            listener,
            options
          );
        } else {
          __facade__originalAddEventListener__(type, listener, options);
        }
      };
      globalThis.removeEventListener = function(type, listener, options) {
        if (__facade_isSpecialEvent__(type)) {
          __FACADE_EVENT_TARGET__.removeEventListener(
            type,
            listener,
            options
          );
        } else {
          __facade__originalRemoveEventListener__(type, listener, options);
        }
      };
      globalThis.dispatchEvent = function(event) {
        if (__facade_isSpecialEvent__(event.type)) {
          return __FACADE_EVENT_TARGET__.dispatchEvent(event);
        } else {
          return __facade__originalDispatchEvent__(event);
        }
      };
      globalThis.addMiddleware = __facade_register__;
      globalThis.addMiddlewareInternal = __facade_registerInternal__;
      __facade_waitUntil__ = Symbol("__facade_waitUntil__");
      __facade_response__ = Symbol("__facade_response__");
      __facade_dispatched__ = Symbol("__facade_dispatched__");
      __Facade_ExtendableEvent__ = class ___Facade_ExtendableEvent__ extends Event {
        static {
          __name(this, "__Facade_ExtendableEvent__");
        }
        [__facade_waitUntil__] = [];
        waitUntil(promise) {
          if (!(this instanceof ___Facade_ExtendableEvent__)) {
            throw new TypeError("Illegal invocation");
          }
          this[__facade_waitUntil__].push(promise);
        }
      };
      __Facade_FetchEvent__ = class ___Facade_FetchEvent__ extends __Facade_ExtendableEvent__ {
        static {
          __name(this, "__Facade_FetchEvent__");
        }
        #request;
        #passThroughOnException;
        [__facade_response__];
        [__facade_dispatched__] = false;
        constructor(type, init) {
          super(type);
          this.#request = init.request;
          this.#passThroughOnException = init.passThroughOnException;
        }
        get request() {
          return this.#request;
        }
        respondWith(response) {
          if (!(this instanceof ___Facade_FetchEvent__)) {
            throw new TypeError("Illegal invocation");
          }
          if (this[__facade_response__] !== void 0) {
            throw new DOMException(
              "FetchEvent.respondWith() has already been called; it can only be called once.",
              "InvalidStateError"
            );
          }
          if (this[__facade_dispatched__]) {
            throw new DOMException(
              "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
              "InvalidStateError"
            );
          }
          this.stopImmediatePropagation();
          this[__facade_response__] = response;
        }
        passThroughOnException() {
          if (!(this instanceof ___Facade_FetchEvent__)) {
            throw new TypeError("Illegal invocation");
          }
          this.#passThroughOnException();
        }
      };
      __Facade_ScheduledEvent__ = class ___Facade_ScheduledEvent__ extends __Facade_ExtendableEvent__ {
        static {
          __name(this, "__Facade_ScheduledEvent__");
        }
        #scheduledTime;
        #cron;
        #noRetry;
        constructor(type, init) {
          super(type);
          this.#scheduledTime = init.scheduledTime;
          this.#cron = init.cron;
          this.#noRetry = init.noRetry;
        }
        get scheduledTime() {
          return this.#scheduledTime;
        }
        get cron() {
          return this.#cron;
        }
        noRetry() {
          if (!(this instanceof ___Facade_ScheduledEvent__)) {
            throw new TypeError("Illegal invocation");
          }
          this.#noRetry();
        }
      };
      __facade__originalAddEventListener__("fetch", (event) => {
        const ctx = {
          waitUntil: event.waitUntil.bind(event),
          passThroughOnException: event.passThroughOnException.bind(event)
        };
        const __facade_sw_dispatch__ = /* @__PURE__ */ __name(function(type, init) {
          if (type === "scheduled") {
            const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
              scheduledTime: Date.now(),
              cron: init.cron ?? "",
              noRetry() {
              }
            });
            __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
            event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
          }
        }, "__facade_sw_dispatch__");
        const __facade_sw_fetch__ = /* @__PURE__ */ __name(function(request, _env, ctx2) {
          const facadeEvent = new __Facade_FetchEvent__("fetch", {
            request,
            passThroughOnException: ctx2.passThroughOnException
          });
          __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
          facadeEvent[__facade_dispatched__] = true;
          event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
          const response = facadeEvent[__facade_response__];
          if (response === void 0) {
            throw new Error("No response!");
          }
          return response;
        }, "__facade_sw_fetch__");
        event.respondWith(
          __facade_invoke__(
            event.request,
            globalThis,
            ctx,
            __facade_sw_dispatch__,
            __facade_sw_fetch__
          )
        );
      });
      __facade__originalAddEventListener__("scheduled", (event) => {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: event.scheduledTime,
          cron: event.cron,
          noRetry: event.noRetry.bind(event)
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      });
    }
  });

  // node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var import_middleware_insertion_facade4, drainBody, middleware_ensure_req_body_drained_default;
  var init_middleware_ensure_req_body_drained = __esm({
    "node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts"() {
      import_middleware_insertion_facade4 = __toESM(require_middleware_insertion_facade());
      init_modules_watch_stub();
      drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
        try {
          return await middlewareCtx.next(request, env);
        } finally {
          try {
            if (request.body !== null && !request.bodyUsed) {
              const reader = request.body.getReader();
              while (!(await reader.read()).done) {
              }
            }
          } catch (e) {
            console.error("Failed to drain the unused request body.", e);
          }
        }
      }, "drainBody");
      middleware_ensure_req_body_drained_default = drainBody;
    }
  });

  // node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e) {
    return {
      name: e?.name,
      message: e?.message ?? String(e),
      stack: e?.stack,
      cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
    };
  }
  var import_middleware_insertion_facade5, jsonError, middleware_miniflare3_json_error_default;
  var init_middleware_miniflare3_json_error = __esm({
    "node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts"() {
      import_middleware_insertion_facade5 = __toESM(require_middleware_insertion_facade());
      init_modules_watch_stub();
      __name(reduceError, "reduceError");
      jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
        try {
          return await middlewareCtx.next(request, env);
        } catch (e) {
          const error = reduceError(e);
          return Response.json(error, {
            status: 500,
            headers: { "MF-Experimental-Error-Stack": "true" }
          });
        }
      }, "jsonError");
      middleware_miniflare3_json_error_default = jsonError;
    }
  });

  // .wrangler/tmp/bundle-EN1kss/middleware-insertion-facade.js
  var require_middleware_insertion_facade = __commonJS({
    ".wrangler/tmp/bundle-EN1kss/middleware-insertion-facade.js"() {
      init_loader_sw();
      init_middleware_ensure_req_body_drained();
      init_middleware_miniflare3_json_error();
      __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);
    }
  });

  // worker.js
  var require_worker = __commonJS({
    "worker.js"() {
      var import_middleware_insertion_facade6 = __toESM(require_middleware_insertion_facade());
      init_modules_watch_stub();
      var style = `
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
      var toolbar = `
<div id="toolbar" style="background-color: #333; color: white; padding: 10px;">
    <a href="/../board" style="color: white; margin-right: 15px;">Scoreboard</a>
    <a href="/../reset" style="color: white; margin-right: 15px;">Reset</a>
    <a href="https://github.com/OpMadDuck/operation-mad-duck" target="_blank" style="color: white; margin-right: 15px;">GitHub</a>
    <a href="/../settings" style="color: white; margin-right: 15px;">Settings</a>
</div>
`;
      var flagPage = /* @__PURE__ */ __name((flag) => `
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
  <\/script>
</html>
`, "flagPage");
      var boardPage = /* @__PURE__ */ __name((flags) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Scoreboard</title>
    ${style}
  </head>
  <body>
    ${toolbar}
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
  <\/script>
</html>
`, "boardPage");
      var resetPage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Reset</title>
    ${style}
  </head>
  <body>
    ${toolbar}
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
  <\/script>
</html>
`;
      var settingsPage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck | Settings</title>
    ${style}
  </head>
  <body>
    ${toolbar}
    <div class="container">
      <div class="subcontainer">
        <table>
          <thead>
            <tr>
              <th style="width:15%">Setting</th>
              <th style="width:65%">Description</th>
              <th style="width:10%">On</th>
              <th style="width:10%">Off</th>
            </tr>
          </thead>
          <tbody id='settings'>
          </tbody>
          <tr>
            <th></th>
            <th></th>
            <th id='on'></th>
            <th id='off'></th>
          </tr>
        </table>
      </div>
     </div>
  </body>
</html>
`;
      async function getFlag(request) {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const flag = await FLAGS.get(id.toString(), { type: "json" });
        if (flag === null) {
          return new Response("The requested resource could not be found \u{1F986}", {
            status: 404
          });
        }
        const body = flagPage(flag);
        return new Response(body, {
          headers: { "Content-Type": "text/html" }
        });
      }
      __name(getFlag, "getFlag");
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
              times: flag.times.concat((/* @__PURE__ */ new Date()).toTimeString().split(" ")[0]),
              contracts: flag.contracts.concat(contract),
              red: flag.red,
              blue: flag.blue,
              winner
            })
          );
          return new Response(null, { status: 200 });
        } catch (err) {
          return new Response(err, { status: 500 });
        }
      }
      __name(captureFlag, "captureFlag");
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
      __name(check, "check");
      async function getBoard() {
        const promises = [];
        for (const key of Array(18).keys()) {
          promises.push(FLAGS.get((key + 1).toString(), { type: "json" }));
        }
        const data = await Promise.all(promises);
        const body = boardPage(JSON.stringify(data));
        return new Response(body, {
          headers: { "Content-Type": "text/html" }
        });
      }
      __name(getBoard, "getBoard");
      async function getSettings() {
        return new Response(settingsPage, {
          headers: { "Content-Type": "text/html" }
        });
      }
      __name(getSettings, "getSettings");
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
            headers: { "Content-Type": "text/html" }
          });
        }
      }
      __name(resetBoard, "resetBoard");
      async function confirmContract() {
        return new Response("Contract received \u{1F4AC}", {
          status: 200,
          headers: { "Clear-Site-Data": "*" }
        });
      }
      __name(confirmContract, "confirmContract");
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
          case "/settings":
            return getSettings();
          case "/reset":
            return resetBoard(request);
          case "/confirm":
            return confirmContract();
          default:
            return new Response("The requested resource could not be found \u{1F986}", {
              status: 404
            });
        }
      }
      __name(handleRequest, "handleRequest");
      addEventListener("fetch", (event) => {
        event.respondWith(handleRequest(event.request));
      });
    }
  });
  require_worker();
})();
//# sourceMappingURL=worker.js.map
