import Kanban from "./kanban.js";

const todo = document.querySelector(".cards.todo");
const pending = document.querySelector(".cards.pending");
const completed = document.querySelector(".cards.completed");

const addForm = document.querySelectorAll(".add");

const taskBox = [todo, pending, completed];

const addTaskCard = (task, index) => {
  let element = document.createElement("form");
  element.className = "card";
  element.dataset.id = task.taskId;
  element.draggable = true;
  element.innerHTML = `
  <input value="${task.content}" type="text" name="task" autocomplete="off" disabled="disabled">
  <div>
      <span class="task-id">#${task.taskId}</span>
      <span>
          <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
          <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column="${index}"></button>
          <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
      </span>
  </div>
  `;

  taskBox[index].appendChild(element);
};

// Get all tasks

Kanban.getAllTasks().map((tasks, index) => {
  tasks.map((task) => {
    addTaskCard(task, index);
  });
});

// Add task

addForm.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = form.task.value;
    if (content) {
      // call addtask function
      const task = Kanban.addTask(form.submit.dataset.id, content.trim());
      // add task to UI
      addTaskCard(task, form.submit.dataset.id);
      form.reset();
    }
  });
});

taskBox.forEach((column) => {
  column.addEventListener("click", (event) => {
    event.preventDefault();

    const formInput =
      event.target.parentElement.parentElement.previousElementSibling;

    /**
     * Handles the editing of a task when the edit button
     * is clicked.
     */
    if (event.target.classList.contains("edit")) {
      // hide edit button

      event.target.classList.add("hide");

      // show check button

      event.target.nextElementSibling.classList.remove("hide");

      // enable input field

      formInput.removeAttribute("disabled");
    }

    /**
     * Handles the update of a task when the check
     * button is clicked.
     */
    if (event.target.classList.contains("update")) {
      // hide check button
      event.target.classList.add("hide");

      // show edit button
      event.target.previousElementSibling.classList.remove("hide");

      // disable input field

      formInput.setAttribute("disabled", "disabled");

      // get taskId, columnId and content of updated task
      const taskId = event.target.dataset.id;
      const columnId = event.target.dataset.column;
      const content = formInput.value;

      console.log(taskId, columnId, content);

      // call update task function
      Kanban.updateTask(taskId, {
        columnId: columnId,
        content: content,
      });
    }

    if (event.target.classList.contains("delete")) {
      const taskId = event.target.dataset.id;
      formInput.parentElement.remove();
      Kanban.deleteTask(taskId);
    }
  });

  column.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("card")) {
      event.target.classList.add("dragging");
    }
  });

  column.addEventListener("dragover", (event) => {
    const card = document.querySelector(".dragging");
    column.appendChild(card);
  });

  column.addEventListener("dragend", (event) => {
    if (event.target.classList.contains("card")) {
      event.target.classList.remove("dragging");

      const taskId = event.target.dataset.id;
      const columnId = event.target.parentElement.dataset.id;
      const content = event.target.task.value;

      Kanban.updateTask(taskId, {
        columnId,
        content,
      });
    }
  });
});
