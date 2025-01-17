// Archivo: /src/components/forms/ProjectBriefingForm.js

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";

const ProjectBriefingForm = ({ projectId, onClose }) => {
  const [briefingData, setBriefingData] = useState({
    meetingDate: "",
    projectGoal: "",
    businessDescription: "",
    targetAudience: "",
    technicalRequirements: "",
    estimatedDeadline: "",
    budget: "",
  });

  const handleChange = (e) => {
    setBriefingData({ ...briefingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectRef = doc(db, "projects", projectId);

      // Guardar el Briefing
      await addDoc(collection(projectRef, "briefings"), briefingData);

      // Crear automáticamente una tarea en la subcolección 'tasks'
      const taskData = {
        task_name: `Redactar propuesta para ${briefingData.projectGoal}`,
        description:
          "Basado en la información del briefing, redactar una propuesta para el cliente.",
        status: "Pendiente",
        due_date: new Date(
          new Date(briefingData.meetingDate).getTime() + 2 * 24 * 60 * 60 * 1000
        ),
        created_at: serverTimestamp(),
      };

      await addDoc(collection(projectRef, "tasks"), taskData);

      // Enviar notificación por email usando EmailJS
      const templateParams = {
        task_name: taskData.task_name,
        project_goal: briefingData.projectGoal,
        due_date: new Date(taskData.due_date).toLocaleDateString("es-ES"),
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_TASK,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );

      alert("Briefing, tarea y notificación enviados exitosamente");
      onClose();
    } catch (error) {
      console.error(
        "Error al guardar el briefing, tarea o enviar notificación:",
        error
      );
      alert(
        "Ocurrió un error al guardar el briefing, tarea o enviar notificación."
      );
    }
  };

  return (
    <div>
      <h2>Formulario de Briefing</h2>
      <form onSubmit={handleSubmit}>
        <label>Fecha de la Reunión:</label>
        <input
          type="date"
          name="meetingDate"
          value={briefingData.meetingDate}
          onChange={handleChange}
          required
        />

        <label>Objetivo del Proyecto:</label>
        <input
          type="text"
          name="projectGoal"
          value={briefingData.projectGoal}
          onChange={handleChange}
          required
        />

        <label>Descripción del Negocio:</label>
        <textarea
          name="businessDescription"
          value={briefingData.businessDescription}
          onChange={handleChange}
          required
        ></textarea>

        <label>Público Objetivo:</label>
        <input
          type="text"
          name="targetAudience"
          value={briefingData.targetAudience}
          onChange={handleChange}
          required
        />

        <label>Requerimientos Técnicos:</label>
        <input
          type="text"
          name="technicalRequirements"
          value={briefingData.technicalRequirements}
          onChange={handleChange}
        />

        <label>Plazo Estimado:</label>
        <input
          type="date"
          name="estimatedDeadline"
          value={briefingData.estimatedDeadline}
          onChange={handleChange}
        />

        <label>Presupuesto Disponible:</label>
        <input
          type="number"
          name="budget"
          value={briefingData.budget}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar Briefing</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default ProjectBriefingForm;
