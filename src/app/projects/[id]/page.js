"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import ProjectBriefingForm from "@/components/forms/ProjectBriefingForm";
import BriefingList from "@/components/briefings/BriefingList";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showBriefingForm, setShowBriefingForm] = useState(false);
  const [showBriefingList, setShowBriefingList] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectRef = doc(db, "projects", id);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          setProject(projectSnap.data());

          const tasksRef = collection(projectRef, "tasks");
          const tasksSnap = await getDocs(tasksRef);
          const tasksData = [];
          tasksSnap.forEach((taskDoc) => {
            tasksData.push({ id: taskDoc.id, ...taskDoc.data() });
          });

          setTasks(tasksData);
        } else {
          console.error("No such project!");
        }
      } catch (error) {
        console.error("Error fetching project details: ", error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      if (task.status === newStatus) return;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isUpdating: true } : task
        )
      );

      const projectRef = doc(db, "projects", id);
      const taskRef = doc(projectRef, "tasks", taskId);

      await updateDoc(taskRef, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: newStatus, isUpdating: false }
            : task
        )
      );

      alert("Estado de la tarea actualizado correctamente 🎉");
    } catch (error) {
      console.error("Error updating task status: ", error);
      alert("Ocurrió un error al actualizar el estado de la tarea.");
    }
  };

  return (
    <main>
      {project ? (
        <>
          <h1>{project.project_name}</h1>
          <p>{project.description}</p>

          <button onClick={() => setShowBriefingForm(!showBriefingForm)}>
            {showBriefingForm ? "Cerrar Briefing" : "Crear Briefing"}
          </button>
          {showBriefingForm && <ProjectBriefingForm projectId={id} onClose={() => setShowBriefingForm(false)} />}

          <button onClick={() => setShowBriefingList(!showBriefingList)}>
            {showBriefingList ? "Ocultar Briefings" : "Ver Briefings"}
          </button>
          {showBriefingList && <BriefingList projectId={id} />}

          <h2>Tareas Asociadas</h2>
          {tasks.length === 0 ? (
            <p>No hay tareas registradas para este proyecto.</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.task_name}</strong> - Estado: {task.status}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateTaskStatus(task.id, e.target.value)
                    }
                    disabled={task.isUpdating}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completada">Completada</option>
                  </select>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Cargando proyecto...</p>
      )}
    </main>
  );
}