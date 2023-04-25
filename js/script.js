const inputBox = document.querySelector("#todo-inputBox");
const form = document.querySelector("#todo-form");
const list = document.querySelector("#todo-list");

function renderTasks(data) {
  list.replaceChildren();
  for (let i = 0; i < data.length; i++) {
    const todo = data[i];
    const li = document.createElement("li");
    li.classList.add("p.task");
    li.textContent = todo[1];

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      const taskId = todo[0];
      const taskTitle = todo[1];
      const confirmation = confirm(
        `Do you want to delete task '${taskTitle}' with ID '${taskId}'?`
      );

      if (confirmation) {
        deleteTask(taskId);
        li.remove();
        buttonDiv.remove();
      }
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    editButton.addEventListener("click", () => {
      const taskId = todo[0];
      const newText = prompt("New text", li.textContent);
      if (newText !== null && newText.trim() !== "") {
        putTask(taskId, newText.trim());
      }
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
  console.log(data);

  renderTasks(data);
}

async function addTask() {
  const title = document.getElementById("todo-inputBox").value;

  if (title.trim() === "") {
    return;
  }

  const response = await fetch("http://127.0.0.1:5000/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Title: title }),
  });
  const data = await response.json();

  if (title == "") {
    return;
  }

  renderTasks([data]);
  getTasks();

  alert("Task successfully added!");
}

async function deleteTask(id) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete the task.");
    }

    alert("Task successfully deleted!");
    getTasks();
  } catch (error) {
    console.error("Failed to delete task:", error);
    alert("An error occurred while deleting the task.");
  }
}

async function putTask(id, newText) {
  console.log(id);
  const response = await fetch(`http://127.0.0.1:5000/todo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, Title: newText }),
  });
  if (response.ok) {
    alert("Task edited successfully!");
  }
  getTasks();
}

getTasks();
