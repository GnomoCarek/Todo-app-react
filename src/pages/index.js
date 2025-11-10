import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [task, setTask] = useState('');
  const [columns, setColumns] = useState({
    [uuidv4()]: {
      name: 'To Do',
      items: [],
    },
    [uuidv4()]: {
      name: 'In Progress',
      items: [],
    },
    [uuidv4()]: {
      name: 'Done',
      items: [],
    },
  });

  const handleAddTask = () => {
    const firstColumnId = Object.keys(columns)[0];
    if (task.trim() === '') return;
    const newColumns = { ...columns };
    newColumns[firstColumnId].items.push({ id: uuidv4(), content: task });
    setColumns(newColumns);
    setTask('');
  };

  const handleDeleteTask = (columnId, itemId) => {
    const newColumns = { ...columns };
    newColumns[columnId].items = newColumns[columnId].items.filter(
      (item) => item.id !== itemId
    );
    setColumns(newColumns);
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple To-Do List</title>
        <meta name="description" content="A simple to-do list app with Next.js" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Kanban Board</h1>
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
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.kanbanContainer}>
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.column}
                  >
                    <h2>{column.name}</h2>
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.taskItem}
                          >
                            {item.content}
                            <button
                              onClick={() => handleDeleteTask(columnId, item.id)}
                              className={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}
