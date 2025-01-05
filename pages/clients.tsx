import { useEffect, useState } from "react";
import { addClient, getClients } from "../src/firebaseClient";

export default function ClientsPage() {
  interface Client {
    id: string;
    name: string;
  }
  
  const [clients, setClients] = useState<Client[]>([]);
  
  const [newClient, setNewClient] = useState("");
  const [error, setError] = useState("");

  // Función para obtener los clientes desde Firestore
  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };

    fetchClients();
  }, []);

  // Función para agregar un cliente con validaciones
  const handleAddClient = async () => {
    if (!newClient.trim()) {
      setError("El nombre del cliente no puede estar vacío.");
      return;
    }

    try {
      await addClient({ name: newClient.trim() });
      setNewClient("");
      setError(""); // Limpiar el error si la operación es exitosa
      const updatedClients = await getClients();
      setClients(updatedClients);
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      setError("Ocurrió un error al agregar el cliente.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Clientes</h1>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={newClient}
        onChange={(e) => setNewClient(e.target.value)}
      />
      <button onClick={handleAddClient}>Agregar Cliente</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Lista de Clientes:</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
}
