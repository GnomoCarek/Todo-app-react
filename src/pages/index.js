import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, task]);
    setTask('');
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple To-Do List</title>
        <meta name="description" content="A simple to-do list app with Next.js" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>To-Do List</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            className={styles.input}
          />
          <button onClick={handleAddTask} className={styles.button}>
            Add Task
          </button>
        </div>
        <ul className={styles.taskList}>
          {tasks.map((task, index) => (
            <li key={index} className={styles.taskItem}>
              {task}
              <button
                onClick={() => handleDeleteTask(index)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}