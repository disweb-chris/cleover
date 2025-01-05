import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, auth } from "../src/firebaseClient";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProjectsPage() {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const router = useRouter();

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
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  

  // ✅ Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // ✅ Función para agregar un nuevo proyecto
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
      fetchProjects(selectedClientId); // Actualizamos la lista de proyectos
    } catch (error) {
      console.error("Error al agregar proyecto:", error);
      alert("Ocurrió un error al agregar el proyecto.");
    }
  };
  

  // ✅ Función para obtener proyectos desde Firestore
  const fetchProjects = async (clientId: string) => {
    const q = query(collection(db, "projects"), where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    const projectsData: any[] = [];
    querySnapshot.forEach((doc) => {
      projectsData.push({ id: doc.id, ...doc.data() });
    });
    setProjects(projectsData);
  };

  // ✅ Función para obtener clientes desde Firestore
  const fetchClients = async () => {
    const querySnapshot = await getDocs(collection(db, "clients"));
    const clientsData: any[] = [];
    querySnapshot.forEach((doc) => {
      clientsData.push({ id: doc.id, ...doc.data() });
    });
    setClients(clientsData);
  };

  // ✅ Cargar clientes al iniciar
  useEffect(() => {
    const init = async () => {
      await fetchClients();
    };
    init();
  }, []);

  // ✅ Cargar proyectos del primer cliente automáticamente si no hay un cliente seleccionado
  useEffect(() => {
    if (clients.length > 0 && !selectedClientId) {
      setSelectedClientId(clients[0].id);
      fetchProjects(clients[0].id);
    }
  }, [clients]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Proyectos</h1>

      <select
        value={selectedClientId}
        onChange={(e) => {
          setSelectedClientId(e.target.value);
          fetchProjects(e.target.value);
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

      {/* ✅ Botón de Logout */}
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}
