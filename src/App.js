import React, { useState, useEffect } from "react";
import "./App.css";
import logo from './logo.png';

function DoneDeal() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (title && description) {
      setTasks([
        ...tasks,
        { id: Date.now(), title, description, status: "Planifié" },
      ]);
      setTitle("");
      setDescription("");
    }
    else{
      alert('Please fill the informations of the task first!')
    }
  };

  const updateStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (id) => {
    const task = tasks.find((task) => task.id === id);
    setEditingTaskId(id);
    setEditingTitle(task.title);
    setEditingDescription(task.description);
  };

  const saveTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title: editingTitle, description: editingDescription }
          : task
      )
    );
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? task.status === statusFilter : true)
  );

  return (
    <div className="app">
      <nav>
        <img src={logo} alt="" />
      </nav>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by task name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Planifié">To-Do</option>
          <option value="En cours">In Progress</option>
          <option value="Terminé">Done</option>
        </select>
      </div>
      <div className="tasks-container">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task">
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                />
                <button onClick={() => saveTask(task.id)} className="save-btn">
                  Save
                </button>
                <button
                  onClick={() => setEditingTaskId(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <select
                  className={
                    task.status === "Planifié"
                      ? "status-planifie"
                      : task.status === "En cours"
                      ? "status-en-cours"
                      : "status-termine"
                  }
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                  <option value="Planifié">To-Do</option>
                  <option value="En cours">In Progress</option>
                  <option value="Terminé">Done</option>
                </select>
                <button
                  onClick={() => startEditing(task.id)}
                  className="modify-btn"
                >
                  Modify
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  disabled={editingTaskId === task.id}
                  className="delete-btn"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoneDeal;
