'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener los proyectos
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = [];
        projectsSnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });

        // Obtener los clientes
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = {};
        clientsSnapshot.forEach((doc) => {
          clientsData[doc.id] = doc.data().name;
        });

        setProjects(projectsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <main>
        <h1>Lista de Proyectos</h1>
        {projects.length === 0 ? (
          <p>No hay proyectos registrados.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.id}`}>
                  {project.project_name} - Cliente: {clients[project.clientId] || 'Cliente desconocido'}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </ProtectedRoute>
  );
}
