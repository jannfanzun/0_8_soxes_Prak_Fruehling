function createTaskElement(task) {
  const div = document.createElement("div");
  div.classList.add("task");

  const p = document.createElement("p");
  p.innerText = task;
  p.classList.add("p-task");
  div.append(p);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-btn");
  div.append(deleteButton);

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.classList.add("edit-btn");
  div.append(editButton);

  deleteButton.addEventListener("click", function () {
    div.remove();
  });

  editButton.addEventListener("click", function () {
    const newTask = prompt("Edit task", p.innerText);

    if (newTask === null || newTask.trim() === "") {
      return;
    }

    p.innerText = newTask;
  });

  return div;
}

function addTask() {
  const task = document.getElementById("todo-inputBox").value;

  if (task.trim() === "") {
    return;
  }

  const div = createTaskElement(task);

  const container = document.getElementById("todo-list");
  container.append(div);

  document.getElementById("todo-inputBox").value = "";
}
