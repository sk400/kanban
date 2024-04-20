/**
 * @file index.js
 * @description Entry point for the application. It is responsible for:
 * 1. Adding event listeners for submit and drag events for the forms and cards
 * 2. Creating and rendering task cards
 * 3. Updating and deleting tasks
 */

import { addTask, deleteTask, getTasks, updateTask } from "./config.js";

const addForms = document.querySelectorAll(".add");
const cards = document.querySelectorAll(".cards");
const columns = ["todo", "pending", "completed"];
const spans = document.querySelectorAll(
  "span.todo, span.pending, span.completed"
);

/**
 * Creates a task card and returns it
 * @param {Object} task Task object
 * @param {number} index Index of the column
 * @returns {Element} Task card element
 */
const createCard = (task, index) => {
  const element = document.createElement("form");
  element.className = "card";
  element.draggable = true;
  element.dataset.id = task.id;
  element.dataset.column = index;
  element.innerHTML = `
    <input value="${task.content}" type="text" name="task" autocomplete="off" disabled>
    <div>
        <span class="task-id">#${task.id}</span>
        <span>
            <button class="bi bi-pencil edit " data-id="${task.id}"></button>
            <button class="bi bi-check-lg update hide" data-id="${task.id}" data-column="${index}"></button>
            <button class="bi bi-trash3 delete" data-id="${task.id}" data-column="${index}"></button>
        </span>
    </div>
    `;

  return element;
};

/**
 * Add form event listener
 * Adds a task to local storage and renders it to the UI
 */
addForms.forEach((form, index) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get task content from form input
    const content = addForms[index].task.value.trim();

    // Create task object
    const task = {
      content,
    };

    // Add task to database
    addTask({
      columnName: columns[index],
      task,
    });

    // Create task card element and append it to the column
    const card = createCard(task, index);
    cards[index].append(card);

    // Reset form input
    addForms[index].reset();
  });
});

/**
 * Reads and renders tasks from database to UI
 */
const renderCards = () => {
  // Loop through each column
  columns.forEach((column, index) => {
    // Get tasks for current column
    getTasks(column, (tasks) => {
      // Update task count for current column
      spans[index].textContent = tasks.length;

      // Empty column element
      cards[index].innerHTML = "";

      // Loop through each task and create card element
      tasks.map((task) => {
        const card = createCard(task, index);

        // Add card element to column
        cards[index].append(card);
      });
    });
  });
};

renderCards();

/**
 * Attach event listeners to each task card
 * Enables drag and drop and click events
 */
cards.forEach((item, index) => {
  // Drag start
  // Adds a class to the dragging task card
  item.addEventListener("dragstart", (event) => {
    event.target.classList.add("dragging");
  });

  // Drag over
  // Moves the dragged task card to the new column while dragging
  item.addEventListener("dragover", (event) => {
    const element = document.querySelector(".dragging");

    cards[index].appendChild(element);
  });

  // Drag end
  // Removes the dragging class from the task card and updates the task in the database
  item.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");

    const content = event.target.task.value;
    const taskId = event.target.dataset.id;

    const upcommingColumnName = columns[index];
    const previousColumnName = columns[Number(event.target.dataset.column)];

    // Delete the task from the previous column
    deleteTask(previousColumnName, taskId);

    // Add the updated task to the new column
    addTask({ columnName: upcommingColumnName, task: { content } });
  });

  // Click events
  // Enables deletion, editing and updating of tasks
  item.addEventListener("click", (event) => {
    event.preventDefault();

    // Get the form input associated with the task
    const formInput =
      event.target.parentElement.parentElement.previousElementSibling;

    // Delete task
    if (event.target.classList.contains("delete")) {
      // Remove the card element from the DOM
      event.target.parentElement.parentElement.parentElement.remove();

      // Delete the task from the database
      const columnName = columns[index];
      const taskId = event.target.dataset.id;
      deleteTask(columnName, taskId);
    }

    // Edit
    if (event.target.classList.contains("edit")) {
      // Hide this button
      event.target.classList.add("hide");

      // Enable the form input
      formInput.disabled = false;

      // Remove the hide class from the update button
      event.target.nextElementSibling.classList.remove("hide");
    }

    // Update
    if (event.target.classList.contains("update")) {
      // Hide this button
      event.target.classList.add("hide");

      // Disable the form input
      formInput.disabled = true;

      // Remove the hide class from the edit button
      event.target.previousElementSibling.classList.remove("hide");

      const content = formInput.value;
      const taskId = event.target.dataset.id;

      // Update the task in the database
      updateTask({
        id: taskId,
        columnName: columns[index],
        content,
      });
    }
  });
});
