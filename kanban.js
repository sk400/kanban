// Kanban class consists of all the methods
// 2 independent functions - read(get data from data source) and save(save changes)
// Note - The firestore will be used for data storage. I am using localStorage because of net error

const read = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  return data ?? [];
};

const save = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
};

const countTasks = (columnId) => {
  const data = read();
  const count = data.find((item) => item.columnId == columnId).tasks.length;
  return count;
};

export class Kanban {
  // get tasks

  static getAllTasks() {
    const data = read();

    return [[...data[0].tasks], [...data[1].tasks], [...data[2].tasks]];
  }

  static addTask(columnId, content) {
    const data = read();

    const task = { taskId: new Date().getTime(), content };

    data.map((item) => {
      if (item.columnId == columnId) {
        item.tasks = [...item.tasks, task];
      }
    });
    save(data);
    return task;
  }

  static deleteTask(taskId) {
    const data = read();

    data.map((col) => {
      let task = col.tasks.find((item) => item.taskId == taskId);
      if (task) {
        col.tasks = col.tasks.filter((task) => task.taskId != taskId);
      }
    });

    save(data);
  }

  static updateTask(columnId, { taskId, content }) {
    const data = read();

    //   find the column

    let column = {};

    data.map((col) => {
      let task = col.tasks.find((item) => item.taskId == taskId);
      if (task) {
        column = {
          id: col.columnId,
        };
      }
    });

    // Delete from previous column

    data.map((col) => {
      if (col.columnId == column.id) {
        col.tasks = col.tasks.filter((item) => item.taskId != taskId);
      }
    });

    // Update the content

    const task = {
      taskId,
      content,
    };

    // Add to desired column
    data.map((item) => {
      if (item.columnId == columnId) {
        item.tasks = [...item.tasks, task];
      }
    });

    // Save changes

    save(data);
  }
}
