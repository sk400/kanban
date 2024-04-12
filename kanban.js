export default class Kanban {
  static getTasks(columnId) {
    const data = read().find((column) => column.columnId === columnId);
    if (!data) {
      return [];
    }
    return data?.tasks;
  }

  static addTask(columnId, content) {
    // get all tasks

    const data = read();

    // find the column having columnId
    const column = data.find((column) => column.columnId == columnId);
    // push new task to the task list of data

    console.log(column);

    const task = {
      taskId: Math.floor(Math.random() * 100000),
      content,
    };

    column.tasks.push(task);

    // update the localstorage
    save(data);

    return task;
  }

  static updateTask(taskId, updatedContent) {
    const data = read();

    // find the current position of the task - task, column

    const currentTaskLocation = [];
    data.map((column) => {
      const task = column.tasks.find((task) => task.taskId === Number(taskId));
      if (task) {
        currentTaskLocation.push(task, column);
      }
    });

    const [task, column] = currentTaskLocation;

    // delete the task from the column

    data.map((item) => {
      if (item.columnId === Number(column.columnId)) {
        return (item.tasks = item.tasks.filter(
          (task) => task.taskId !== Number(taskId)
        ));
      }
    });

    // Add the task to the desired column and update its content with new content

    task.content = updatedContent.content;

    data
      .find((item) => item.columnId === Number(updatedContent.columnId))
      .tasks.push(task);

    save(data);
  }

  static deleteTask(taskId) {
    const data = read();

    data.map((column) => {
      return (column.tasks = column.tasks.filter(
        (task) => task.taskId !== Number(taskId)
      ));
    });

    save(data);
  }

  static getAllTasks() {
    const data = read();
    columnCount();
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }
}

function read() {
  const data = localStorage.getItem("data");
  if (!data) {
    return [
      { columnId: 0, tasks: [] },
      { columnId: 1, tasks: [] },
      { columnId: 2, tasks: [] },
    ];
  }
  return JSON.parse(data);
}

function save(data) {
  localStorage.setItem("data", JSON.stringify(data));
  columnCount();
}

const columnCount = () => {
  const data = read();
  const todo = document.querySelector("span.todo");
  const pending = document.querySelector("span.pending");
  const completed = document.querySelector("span.completed");

  todo.textContent = data[0].tasks.length;
  pending.textContent = data[1].tasks.length;
  completed.textContent = data[2].tasks.length;
};

// console.log(Kanban.getAllTasks());
// console.log(JSON.parse(localStorage.setItem("data", JSON.stringify(data))));

// console.log(JSON.parse(localStorage.getItem("data")));

// Selectors

// const addForm = document.querySelector(".add");

// Add task functionality to UI

// const addTask = (event) => {
//   event.preventDefault();

//   console.log(addForm.button);
// };

// Fetch all tasks from localStorage and render them to UI

// Delete task functionality to UI

// Update task functionality to UI

// Kanban.updateTask(38833, {
//   columnId: 2,
//   content: "Listen song",
// });

// Kanban.updateTask(44183, {
//   columnId: 2,
//   content: "Go to mindvalley University ",
// });

// Kanban.addTask(0, "Buy a vida v1 pro");
