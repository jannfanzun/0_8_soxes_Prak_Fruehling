const inputBox = document.querySelector("#todo-inputBox");
const form = document.querySelector("#todo-form");
const list = document.querySelector("#todo-list");

function renderTasks(data) {
  list.replaceChildren();
  for (let i = 0; i < data.length; i++) {
    const todo = data[i];
    const li = document.createElement("li");
    li.classList.add("p.task");
    li.textContent = todo.title;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      li.remove();
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    editButton.addEventListener("click", function () {
      const newTask = prompt("Edit task", li.innerText);

      if (newTask === null || newTask.trim() === "") {
        return;
      }

      li.innerText = newTask;
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton);

    const taskDiv = document.createElement("div");
    taskDiv.appendChild(li);
    taskDiv.appendChild(buttonDiv);

    list.appendChild(taskDiv);
  }
}


async function getTasks() {
  const response = await fetch("http://127.0.0.1:5000/todo");
  const data = await response.json();
  console.log(data); // Debugging purposes

  renderTasks(data);
}


async function addTask(event) {
  event.preventDefault();
  const title = inputBox.value;

  const response = await fetch("http://127.0.0.1:5000/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  const data = await response.json();

  inputBox.value = "";

  renderTasks([data]);
  getTasks();

  alert("Task successfully added!");
}

getTasks();

