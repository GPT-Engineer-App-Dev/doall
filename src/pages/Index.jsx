import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo Application</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Task" : "Add Task"}</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSave={(task) => {
                if (isEdit) {
                  handleEditTask(task);
                } else {
                  handleAddTask(task);
                }
                setIsEdit(false);
                setCurrentTask(null);
              }}
              task={currentTask}
              onCancel={() => {
                setIsEdit(false);
                setCurrentTask(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </header>
      <TaskList tasks={tasks} onEdit={(task) => {
        setCurrentTask(task);
        setIsEdit(true);
      }} onDelete={handleDeleteTask} />
    </div>
  );
};

const TaskList = ({ tasks, onEdit, onDelete }) => (
  <div className="space-y-4">
    {tasks.map((task) => (
      <div key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{task.title}</h2>
          {task.description && <p className="text-gray-600">{task.description}</p>}
          {task.dueDate && <p className="text-gray-500 text-sm">Due: {format(new Date(task.dueDate), "PPP")}</p>}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onEdit(task)}>Edit</Button>
          <Button variant="destructive" onClick={() => onDelete(task.id)}>Delete</Button>
        </div>
      </div>
    ))}
  </div>
);

const TaskForm = ({ onSave, task, onCancel }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [dueDate, setDueDate] = useState(task ? task.dueDate : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: task ? task.id : Date.now(),
      title,
      description,
      dueDate,
    };
    onSave(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default Index;