"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

export default function NewClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactMethod: "Instagram",
    projectType: "Web Corporativa",
    description: "",
    budget: 0,
    expectedStartDate: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar los datos a Firestore
      const clientRef = await addDoc(collection(db, "clients"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        contact_channel: formData.contactMethod,
        project_type: formData.projectType,
        description: formData.description,
        budget: parseFloat(formData.budget),
        expected_start_date: new Date(formData.expectedStartDate),
        created_at: new Date(),
        status: "Por contactar",
      });

      // Enviar el email usando EmailJS
      const templateParams = {
        name: formData.name,
        email: formData.email,
        project_type: formData.projectType,
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );

      // Crear una tarea automática en Firestore
      await addDoc(collection(db, "tasks"), {
        title: `Contacto inicial con ${formData.name}`,
        description: `Realizar seguimiento con ${formData.name} para reunión de descubrimiento.`,
        clientId: clientRef.id,
        status: "Pendiente",
        priority: "Alta",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Fecha límite en 2 días
        created_at: new Date(),
      });

      alert("Cliente y tarea registrados exitosamente 🎉");
      router.push("/clients");
    } catch (error) {
      console.error("Error registrando cliente o enviando email:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main>
      <h1>Registrar Nuevo Cliente</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre y Apellido"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono (opcional)"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="contactMethod">Medio de Contacto</label>
        <select
          name="contactMethod"
          value={formData.contactMethod}
          onChange={handleChange}
          required
        >
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Email">Email</option>
          <option value="Referido">Referido</option>
          <option value="Sitio Web">Sitio Web</option>
        </select>

        <label htmlFor="projectType">Tipo de Proyecto</label>
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
        >
          <option value="Web Corporativa">Web Corporativa</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Aplicación Móvil">Aplicación Móvil</option>
          <option value="Branding / Identidad Visual">
            Branding / Identidad Visual
          </option>
          <option value="Rediseño de Sitio Web">Rediseño de Sitio Web</option>
          <option value="Otros">Otros</option>
        </select>

        <textarea
          name="description"
          placeholder="Descripción del Proyecto"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="number"
          name="budget"
          placeholder="Presupuesto Estimado"
          value={formData.budget}
          onChange={handleChange}
          required
        />

        <label htmlFor="expectedStartDate">Fecha Esperada de Inicio</label>
        <input
          type="date"
          name="expectedStartDate"
          value={formData.expectedStartDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar Cliente</button>
      </form>
    </main>
  );
}
