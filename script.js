function addTask() {
  // Eingabefeld auslesen
  const task = document.getElementById("todo-inputBox").value;

  // Prüfen, ob Eingabefeld leer ist
  if (task.trim() === "") {
    return;
  }

  // Neue Listen-Element erstellen
  const li = document.createElement("li");
  li.textContent = task;
  li.classList.add("li-task");

  // Delete-Button erstellen und hinzufügen
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  li.appendChild(deleteButton);

  // Edit-Button erstellen und hinzufügen
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");
  li.appendChild(editButton);

  // Funktion zum Entfernen des Listenelements hinzufügen
  deleteButton.addEventListener("click", function () {
    li.remove();
  });

  // Listen-Element zur Liste hinzufügen
  const ul = document.getElementById("todo-list");
  ul.appendChild(li);

  // Eingabefeld leeren
  document.getElementById("todo-inputBox").value = "";
}
