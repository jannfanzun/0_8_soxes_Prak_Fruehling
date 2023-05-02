const inputBox = document.querySelector("#todo-inputBox");
const form = document.querySelector("#todo-form");
const list = document.querySelector("#todo-list");

function renderTasks(data) {
  const taskDiv = document.createElement("div");
  list.replaceChildren();

  for (let i = 0; i < data.length; i++) {
    const todo = data[i];
    const li = document.createElement("li");
    li.classList.add("p.task");
    li.textContent = todo["Title"];
    console.log(todo["Title"]);
    console.log(todo["Status"]);

    const completedBox = document.createElement("input");
    completedBox.type = "checkbox";
    completedBox.classList.add("checkbox");
    completedBox.addEventListener("change", () => {
      todo.completed = completedBox.checked;
      li.style.textDecoration = todo.completed ? "line-through" : "none";
      li.style.color = todo.completed ? "rgb(145, 145, 145)" : "#000";
      if (todo.completed) {
        alert("Task successfully completed!");
      } else if (!todo.completed) {
        li.style.textDecoration = "none";
        li.style.color = "rgb(0, 0, 0)";
        completedBox.checked = false;
      }
      putTask(todo["id"], todo["Title"], todo.completed);
    });

    if (todo["Status"] == true) {
      todo.completed = true;
      li.style.textDecoration = "line-through";
      li.style.color = "rgb(145, 145, 145)";
      completedBox.checked = true;
    }

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.value = todo["DueDate"];
    dueDateInput.addEventListener("change", () => {
      todo["DueDate"] = dueDateInput.value;
      putTask(todo["id"], todo["Title"], todo.completed, todo["DueDate"]);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      const taskId = todo["id"];
      const taskTitle = todo["Title"];
      const confirmation = confirm(
        `Do you want to delete the task '${taskTitle}'?`
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
      const taskId = todo["id"];
      const newText = prompt("New text", li.textContent);
      const status_Task = todo["Status"];
      if (newText !== null && newText.trim() !== "") {
        putTask(taskId, newText.trim(), status_Task, todo["DueDate"]);
        alert("Task edited successfully!");
      }
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton);

    li.appendChild(completedBox);
    li.appendChild(dueDateInput);
    taskDiv.appendChild(li);
    taskDiv.appendChild(buttonDiv);
    list.appendChild(taskDiv);
  }
}

async function getTasks() {
  token = localStorage.getItem("token");
  console.log(token);
  const response = await fetch(
    "https://todobackendjann.azurewebsites.net/todo",
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const data = await response.json();
  console.log(data);

  renderTasks(data);
}

async function addTask() {
  const titleInput = document.getElementById("todo-inputBox");
  const title = sanitizeInput(titleInput.value);

  const token = localStorage.getItem("token");
  console.log(token);

  if (title.trim() === "") {
    return;
  }

  const response = await fetch(
    "https://todobackendjann.azurewebsites.net/todo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ Title: title }),
    }
  );

  if (response.ok) {
    alert("Task successfully added!");
    location.reload();
  }
  console.log(response);

  const data = await response.json();
  renderTasks([data]);
  getTasks();
}

function sanitizeInput(input) {
  const sanitizedInput = input.replace(/[^a-zA-Z0-9äöüÄÖÜ., -]/g, "");
  if (sanitizedInput !== input) {
    alert("Invalid content!");
    return "";
  }
  return sanitizedInput;
}

async function deleteTask(id) {
  token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `https://todobackendjann.azurewebsites.net/todo/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ id }),
      }
    );

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

async function putTask(id, newText, status_Task) {
  token = localStorage.getItem("token");
  console.log(id);
  const response = await fetch(
    `https://todobackendjann.azurewebsites.net/todo/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ Title: newText, Status: status_Task }),
    }
  );

  getTasks();
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function checkToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}

function updateDateTime() {
  const dateTimeElement = document.getElementById("datetime");
  const now = new Date();

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const dateString = now.toLocaleDateString("de-DE", options);
  const timeString = now.toLocaleTimeString();

  dateTimeElement.innerHTML = dateString + " - " + timeString;
}

updateDateTime();

setInterval(updateDateTime, 1000);

getTasks();
checkToken();

document.body.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
