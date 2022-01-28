const html = todos => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck</title>
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
                Flag
              </th>
              <th>
                Red Team
              </th>
              <th>
                Blue Team
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td class="red">
                1155
              </td>
              <td class="green">
                1147
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td class="red">
                -
              </td>
              <td class="green">
                1153
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td class="green">
                1202
              </td>
              <td class="red">
                1230
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td class="green">
                1215
              </td>
              <td class="red">
                1246
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td class="red">
                -
              </td>
              <td class="green">
                1300
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td class="green">
                1305
              </td>
              <td class="red">
                1327
              </td>
            </tr>
            <tr>
              <td>7</td>
              <td class="green">
                1309
              </td>
              <td class="red">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>
     <div id="todos"></div>
     </div>
  </body>

  <script>
    window.todos = ${todos}

    var updateTodos = function() {
      fetch("/", { method: 'PUT', body: JSON.stringify({ todos: window.todos }) })
      populateTodos()
    }

    var completeTodo = function(evt) {
      var checkbox = evt.target
      var todoElement = checkbox.parentNode
      var newTodoSet = [].concat(window.todos)
      var todo = newTodoSet.find(t => t.id == todoElement.dataset.todo)
      todo.completed = !todo.completed
      window.todos = newTodoSet
      updateTodos()
    }

    var populateTodos = function() {
      var todoContainer = document.querySelector("#todos")
      todoContainer.innerHTML = null

      window.todos.forEach(todo => {
        var el = document.createElement("div")
        el.className = "border-t py-4"
        el.dataset.todo = todo.id

        var name = document.createElement("span")
        name.className = todo.completed ? "line-through" : ""
        name.textContent = todo.name

        var checkbox = document.createElement("input")
        checkbox.className = "mx-4"
        checkbox.type = "checkbox"
        checkbox.checked = todo.completed ? 1 : 0
        checkbox.addEventListener('click', completeTodo)

        el.appendChild(checkbox)
        el.appendChild(name)
        todoContainer.appendChild(el)
      })
    }

    populateTodos()

    var createTodo = function() {
      var input = document.querySelector("input[name=name]")
      if (input.value.length) {
        window.todos = [].concat(todos, { id: window.todos.length + 1, name: input.value, completed: false })
        input.value = ""
        updateTodos()
      }
    }

    //document.querySelector("#create").addEventListener('click', createTodo)
  </script>
</html>
`

const htmlFlag = todos => `
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

</html>
`

const defaultData = { todos: [] }

const setCache = data => FLAGS.put("data", data)
const getCache = () => FLAGS.get("data")

async function getTodos(request) {
    let data
    const cache = await getCache()
    if (!cache) {
        await setCache(JSON.stringify(defaultData))
        data = defaultData
    } else {
        data = JSON.parse(cache)
    }
    const body = html(JSON.stringify(data.todos || []).replace(/</g, "\\u003c"))
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
    const body = htmlFlag(JSON.stringify(data.todos || []).replace(/</g, "\\u003c"))
    return new Response(body, {
        headers: { 'Content-Type': 'text/html' },
    })
}

async function updateTodos(request) {
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
        return updateTodos(request)
    } else if (request.url.includes("flag1")) {
        return getFlag(1)
    } else {
        return getTodos(request)
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})