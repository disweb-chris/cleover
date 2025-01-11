import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, auth } from "../services/firebaseClient";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import styles from "../styles/projects.module.css";


interface Project {
  id: string;
  name: string;
  description: string;
  objective: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  services: string[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  clientId: string;
}

interface Client {
  id: string;
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] = useState<string>("");
  const [newProjectObjective, setNewProjectObjective] = useState<string>("");
  const [newProjectStartDate, setNewProjectStartDate] = useState<string>("");
  const [newProjectEstimatedEndDate, setNewProjectEstimatedEndDate] = useState<string>("");
  const [newProjectStatus, setNewProjectStatus] = useState<string>("Pendiente");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [newProjectTotalAmount, setNewProjectTotalAmount] = useState<number>(0);
  const [newProjectCurrency, setNewProjectCurrency] = useState<string>("USD");
  const [newProjectPaymentMethod, setNewProjectPaymentMethod] = useState<string>("Transferencia");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const router = useRouter();

  // ✅ Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // ✅ Función para agregar un proyecto con los nuevos campos
  const handleAddProject = async () => {
    if (!newProjectName || !newProjectDescription || !selectedClientId) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        name: newProjectName,
        description: newProjectDescription,
        objective: newProjectObjective,
        startDate: newProjectStartDate,
        estimatedEndDate: newProjectEstimatedEndDate,
        status: newProjectStatus,
        services: selectedServices,
        totalAmount: newProjectTotalAmount,
        currency: newProjectCurrency,
        paymentMethod: newProjectPaymentMethod,
        clientId: selectedClientId,
      });

      // Limpiar campos después de agregar el proyecto
      setNewProjectName("");
      setNewProjectDescription("");
      setNewProjectObjective("");
      setNewProjectStartDate("");
      setNewProjectEstimatedEndDate("");
      setNewProjectStatus("Pendiente");
      setSelectedServices([]);
      setNewProjectTotalAmount(0);
      setNewProjectCurrency("USD");
      setNewProjectPaymentMethod("Transferencia");
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
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData: Client[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Client, "id">;
        clientsData.push({ id: doc.id, ...data });
      });
  
      setClients(clientsData);
      console.log("Clientes cargados:", clientsData); // 👀 Agregado para verificar el estado
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };
  

  // ✅ Cargar clientes al iniciar
  useEffect(() => {
    fetchClients();

    // ✅ Prueba de conexión con Firestore
    const testFirestoreConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      } catch (error) {
        console.error("Error conectando a Firestore:", error);
      }
    };

    testFirestoreConnection();
  }, []);

  // ✅ Cargar proyectos cuando se selecciona un cliente
  useEffect(() => {
    if (selectedClientId) {
      fetchProjects(selectedClientId);
    }
  }, [selectedClientId]);

  // ✅ Función para alternar servicios seleccionados
  const toggleService = (service: string) => {
    setSelectedServices((prevServices) =>
      prevServices.includes(service)
        ? prevServices.filter((s) => s !== service)
        : [...prevServices, service]
    );
  };

  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Proyectos</h1>

    <form className={styles.form}>
      <select
        className={styles.select}
        value={selectedClientId}
        onChange={(e) => setSelectedClientId(e.target.value)}
      >
        <option value="">Selecciona un cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.nombre} - {client.empresa}
          </option>
        ))}
      </select>

      <input
        className={styles.input}
        type="text"
        placeholder="Nombre del proyecto"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Descripción breve del proyecto"
        value={newProjectDescription}
        onChange={(e) => setNewProjectDescription(e.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Objetivo del proyecto"
        value={newProjectObjective}
        onChange={(e) => setNewProjectObjective(e.target.value)}
      />

      <label>Fecha de Inicio:</label>
      <input
        className={styles.input}
        type="date"
        value={newProjectStartDate}
        onChange={(e) => setNewProjectStartDate(e.target.value)}
      />

      <label>Fecha de Entrega Estimada:</label>
      <input
        className={styles.input}
        type="date"
        value={newProjectEstimatedEndDate}
        onChange={(e) => setNewProjectEstimatedEndDate(e.target.value)}
      />

      <label>Estado del Proyecto:</label>
      <select
        className={styles.select}
        value={newProjectStatus}
        onChange={(e) => setNewProjectStatus(e.target.value)}
      >
        <option value="Pendiente">Pendiente</option>
        <option value="En Proceso">En Proceso</option>
        <option value="Completado">Completado</option>
      </select>

      <button className={styles.button} type="button" onClick={handleAddProject}>
        Agregar Proyecto
      </button>
    </form>

    <h2 className={styles.projectList}>Lista de Proyectos:</h2>
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <strong>{project.name}</strong>: {project.description}
        </li>
      ))}
    </ul>

    <button className={styles.button} onClick={handleLogout}>
      Cerrar sesión
    </button>
  </div>
  );
}