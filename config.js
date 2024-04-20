// config.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import {
  addDoc,
  collection,
  onSnapshot,
  getFirestore,
  serverTimestamp,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDdEIRB7WyopvntNJ2E8n-ccR_9pWHRA0",
  authDomain: "shareme-rebuild.firebaseapp.com",
  projectId: "shareme-rebuild",
  storageBucket: "shareme-rebuild.appspot.com",
  messagingSenderId: "874280342564",
  appId: "1:874280342564:web:81ab33c0c184055a08b4b1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Creates a new task in the given column
 *
 * @param {object} data
 * @param {string} data.columnName
 * @param {object} data.task
 */
export const addTask = async ({ columnName, task }) => {
  try {
    await addDoc(collection(db, "columns", columnName, "tasks"), {
      ...task,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Gets all the tasks in a given column and calls the callback function with the result
 *
 * @param {string} columnName
 * @param {function} cb
 */
export const getTasks = (columnName, cb) => {
  const q = query(
    collection(db, "columns", columnName, "tasks"),
    orderBy("createdAt")
  );
  onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    cb(documents);
  });
};

/**
 * Updates a task with the given id in the given column
 *
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.columnName
 * @param {string} data.content
 */
export const updateTask = async ({ id, columnName, content }) => {
  try {
    const docRef = doc(db, "columns", columnName, "tasks", id);

    await updateDoc(docRef, { content });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Deletes a task with the given id in the given column
 *
 * @param {string} columnName
 * @param {string} id
 */
export const deleteTask = async (columnName, id) => {
  try {
    await deleteDoc(doc(db, "columns", columnName, "tasks", id));
    console.log("deleted");
  } catch (error) {
    console.log(error);
  }
};
