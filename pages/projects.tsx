import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, auth } from "../src/firebaseClient";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const router = useRouter();

  // ✅ Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Corregido: pasamos `auth` como argumento
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // ✅ Función para agregar un proyecto
  const handleAddProject = async () => {
    if (!newProjectName || !newProjectDescription || !selectedClientId) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        name: newProjectName,
        description: newProjectDescription,
        clientId: selectedClientId,
      });
      setNewProjectName("");
      setNewProjectDescription("");
      fetchProjects(selectedClientId);
    } catch (error) {
      console.error("Error al agregar proyecto:", error);
    }
  };

  // ✅ Función para obtener proyectos
  const fetchProjects = async (clientId: string) => {
    const q = query(collection(db, "projects"), where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    const projectsData: Project[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Project, "id">;
      projectsData.push({ id: doc.id, ...data });
    });
    setProjects(projectsData);
  };  

  // ✅ Función para obtener clientes
  const fetchClients = async () => {
    const querySnapshot = await getDocs(collection(db, "clients"));
    const clientsData: Client[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Client, "id">;
      clientsData.push({ id: doc.id, ...data });
    });
    setClients(clientsData);
  };
  

  // ✅ Cargar clientes al iniciar
  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ Cargar proyectos cuando se selecciona un cliente
  useEffect(() => {
    if (selectedClientId) {
      fetchProjects(selectedClientId);
    }
  }, [selectedClientId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Proyectos</h1>

      <select
        value={selectedClientId}
        onChange={(e) => {
          setSelectedClientId(e.target.value);
        }}
      >
        <option value="">Selecciona un cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <br />
      <input
        type="text"
        placeholder="Nombre del proyecto"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Descripción del proyecto"
        value={newProjectDescription}
        onChange={(e) => setNewProjectDescription(e.target.value)}
      />
      <br />
      <button onClick={handleAddProject}>Agregar Proyecto</button>

      <h2>Lista de Proyectos:</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong>: {project.description}
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}
