const html = todos => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Operation Mad Duck</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet"></link>
  </head>
<!--
  <body class="bg-green-100">
    <div class="w-full h-full flex content-center justify-center mt-8">
      <div class="bg-white shadow-md rounded px-8 pt-6 py-8 mb-4">
        <h1 class="block text-grey-800 text-md font-bold mb-2">Todos</h1>
        <div class="flex">
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-800 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" placeholder="A new todo"></input>
          <button class="bg-blue-500 hover:bg-blue-800 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="create" type="submit">Create</button>
        </div>
        <div class="mt-4" id="todos"></div>
      </div>
    </div>
  </body>
  -->

  <body class="bg-blue-100">
    <div class="w-full h-full flex content-center justify-center mt-8">
      <div class="bg-white shadow-md rounded px-8 pt-6 py-8 mb-4">
        <h1 class="block text-grey-800 text-lg text-center font-bold mb-2">Operation Mad Duck</h1>
        <div class="flex flex-col">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
    <div class="py-4 inline-block min-w-full sm:px-6 lg:px-8">
      <div class="overflow-hidden">
        <table class="min-w-full border">
          <thead class="border-b bg-gray-50">
            <tr>
              <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                Flag
              </th>
              <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                Red Team
              </th>
              <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                Blue Team
              </th>
            </tr>
          </thead class="border-b">
          <tbody class="text-center">
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">1</td>
              <td class="text-sm text-red-500 px-6 py-4 whitespace-nowrap">
                1155
              </td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1147
              </td>
            </tr class="bg-white border-b">
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">2</td>
              <td class="text-sm text-slate-500 px-6 py-4 whitespace-nowrap">
                -
              </td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1153
              </td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">3</td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1202
              </td>
              <td class="text-sm text-red-500 px-6 py-4 whitespace-nowrap">
                1230
              </td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">4</td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1215
              </td>
              <td class="text-sm text-red-500 px-6 py-4 whitespace-nowrap">
                1246
              </td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">5</td>
              <td class="text-sm text-slate-500 px-6 py-4 whitespace-nowrap">
                -
              </td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1300
              </td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">6</td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1305
              </td>
              <td class="text-sm text-red-500 px-6 py-4 whitespace-nowrap">
                1327
              </td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">7</td>
              <td class="text-sm text-green-500 px-6 py-4 whitespace-nowrap">
                1309
              </td>
              <td class="text-sm text-slate-500 px-6 py-4 whitespace-nowrap">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
        <div class="mt-4" id="todos"></div>
      </div>
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

    document.querySelector("#create").addEventListener('click', createTodo)
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