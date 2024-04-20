import { addTask } from "./config.js";
import { Kanban } from "./kanban.js";

// Add task
const addForms = document.querySelectorAll(".add");

const cards = document.querySelectorAll(".cards");

const columns = ["todo", "pending", "completed"];

const createCard = (task, index) => {
  const element = document.createElement("form");
  element.className = "card";

  element.draggable = true;

  element.dataset.id = task.taskId;

  element.innerHTML = `
    <input value="${task.content}" type="text" name="task" autocomplete="off" disabled>
    <div>
        <span class="task-id">#${task.taskId}</span>
        <span>
            <button class="bi bi-pencil edit " data-id="${task.taskId}"></button>
            <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column="${index}"></button>
            <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
        </span>
    </div>
    `;

  return element;
};

addForms.forEach((form, index) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = addForms[index].task.value.trim();
    const columnId = index;

    const task = Kanban.addTask(columnId, content);

    addTask({ columnName: columns[index], task });

    const card = createCard(task, index);
    cards[index].append(card);
    addForms[index].reset();
  });
});

// Read and render tasks to ui

const renderCards = () => {
  const allColumnTasks = Kanban.getAllTasks();

  //   console.log(allColumnTasks);

  allColumnTasks.forEach((columnTasks, index) => {
    columnTasks.map((task) => {
      const card = createCard(task, index);
      cards[index].append(card);
    });
  });
};

renderCards();

cards.forEach((item) => {
  // Drag start
  item.addEventListener("dragstart", (event) => {
    event.target.classList.add("dragging");

    console.log(event.target.task.value);
  });

  // Drag over

  item.addEventListener("dragover", (event) => {
    const element = document.querySelector(".dragging");

    // console.log(event.target.);

    const content = element.task.value;
    const taskId = element.dataset.id;

    if (event.target.classList.contains("cards")) {
      const column = event.target.dataset.id;
      cards[Number(column)].appendChild(element);
      Kanban.updateTask(column, { taskId, content });
    }
  });

  // Drag end

  item.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
  });

  // Click events

  item.addEventListener("click", (event) => {
    event.preventDefault();
    const formInput =
      event.target.parentElement.parentElement.previousElementSibling;

    // Delete task

    if (event.target.classList.contains("delete")) {
      event.target.parentElement.parentElement.parentElement.remove();
      Kanban.deleteTask(event.target.dataset.id);
    }

    // Edit

    if (event.target.classList.contains("edit")) {
      // hide this button
      event.target.classList.add("hide");
      //   enable the form input
      formInput.disabled = false;

      //   remove hide from update button
      event.target.nextElementSibling.classList.remove("hide");
    }

    //   Update

    if (event.target.classList.contains("update")) {
      // hide this button
      event.target.classList.add("hide");
      //   enable the form input
      formInput.disabled = true;

      //   remove hide from update button
      event.target.previousElementSibling.classList.remove("hide");

      const column = event.target.dataset.column;
      const content = formInput.value;
      const taskId = event.target.dataset.id;

      Kanban.updateTask(column, { taskId, content });
    }
  });
});
