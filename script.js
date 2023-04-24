function createTaskElement(task) {
  const p = document.createElement("p");
  p.innerText = task;
  p.classList.add("p-task");

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-btn");
  p.append(deleteButton);

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.classList.add("edit-btn");
  p.append(editButton);

  deleteButton.addEventListener("click", function () {
    p.remove();
  });

  editButton.addEventListener("click", function () {
    const newTask = prompt("Edit task", p.innerText);

    if (newTask === null || newTask.trim() === "") {
      return;
    }

    p.innerText = newTask;
  });

  return p;
}

function addTask() {
  const task = document.getElementById("todo-inputBox").value;

  if (task.trim() === "") {
    return;
  }

  const p = createTaskElement(task);

  const ul = document.getElementById("todo-list");
  ul.append(p);

  document.getElementById("todo-inputBox").value = "";
}
