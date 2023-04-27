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
    li.textContent = todo[1];

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      const taskId = todo[0];
      const taskTitle = todo[1];
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
      const taskId = todo[0];
      const newText = prompt("New text", li.textContent);
      if (newText !== null && newText.trim() !== "") {
        putTask(taskId, newText.trim());
      }
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton);
    taskDiv.appendChild(li);
    taskDiv.appendChild(buttonDiv);
    list.appendChild(taskDiv);
  }
}

async function fetchEmail() {
  try {
    const response = await fetch(
      "https://todobackendjann.azurewebsites.net/user/email"
    );
    const email = await response.text();
    const user = document.querySelector("#user");
    user.textContent = email;
  } catch (error) {
    console.error(error);
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

async function putTask(id, newText) {
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
      body: JSON.stringify({ id, Title: newText }),
    }
  );
  if (response.ok) {
    alert("Task edited successfully!");
  }
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

getTasks();
checkToken();

document.body.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
