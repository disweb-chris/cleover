import { useEffect, useState } from "react";
import { addClient, getClients } from "../services/firebaseClient";

export default function ClientsPage() {
  // Definición de la interfaz del cliente
  interface Client {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
    direccion: string;
    datosFacturacion: {
      razonSocial: string;
      cuit: string;
      direccionFiscal: string;
      condicionIva: string;
    };
    datosMarketing: {
      redesSociales: {
        instagram: string;
        linkedin: string;
      };
      fuenteContacto: string;
      preferenciasComunicacion: string[];
    };
    proyectos: string[];
    notas: {
      notaId: string;
      contenido: string;
      fechaCreacion: string;
      creadoPor: string;
    }[];
  }

  // Estados para los clientes y los valores del formulario
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmpresa, setNewEmpresa] = useState("");
  const [newDireccion, setNewDireccion] = useState("");
  const [newRazonSocial, setNewRazonSocial] = useState("");
  const [newCuit, setNewCuit] = useState("");
  const [newDireccionFiscal, setNewDireccionFiscal] = useState("");
  const [newCondicionIva, setNewCondicionIva] = useState("");
  const [newInstagram, setNewInstagram] = useState("");
  const [newLinkedin, setNewLinkedin] = useState("");
  const [newFuenteContacto, setNewFuenteContacto] = useState("");
  const [preferenciasComunicacion, setPreferenciasComunicacion] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Función para obtener los clientes desde Firestore
  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      console.log("Clientes obtenidos:", data);
      setClients(data);
    };

    fetchClients();
  }, []);

  // Función para manejar los cambios en los checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      // Si está marcado, lo agregamos al array
      setPreferenciasComunicacion([...preferenciasComunicacion, value]);
    } else {
      // Si no está marcado, lo eliminamos del array
      setPreferenciasComunicacion(preferenciasComunicacion.filter((pref) => pref !== value));
    }
  };

  // Función para agregar un cliente con validaciones
  const handleAddClient = async () => {
    if (!newClient.trim()) {
      setError("El nombre del cliente no puede estar vacío.");
      return;
    }

    try {
      const clientData: Omit<Client, "id"> = {
        nombre: newClient.trim(),
        email: newEmail.trim(),
        telefono: newPhone.trim(),
        empresa: newEmpresa.trim(),
        direccion: newDireccion.trim(),
        datosFacturacion: {
          razonSocial: newRazonSocial.trim(),
          cuit: newCuit.trim(),
          direccionFiscal: newDireccionFiscal.trim(),
          condicionIva: newCondicionIva.trim(),
        },
        datosMarketing: {
          redesSociales: {
            instagram: newInstagram.trim(),
            linkedin: newLinkedin.trim(),
          },
          fuenteContacto: newFuenteContacto.trim(),
          preferenciasComunicacion: preferenciasComunicacion,
        },
        proyectos: [],
        notas: [],
      };

      // Agregar cliente a Firestore
      await addClient(clientData);

      // Refrescar la lista de clientes después de agregar uno nuevo
      const updatedClients = await getClients();
      setClients(updatedClients);

      // Limpiar los campos del formulario
      setNewClient("");
      setNewEmail("");
      setNewPhone("");
      setNewEmpresa("");
      setNewDireccion("");
      setNewRazonSocial("");
      setNewCuit("");
      setNewDireccionFiscal("");
      setNewCondicionIva("");
      setNewInstagram("");
      setNewLinkedin("");
      setNewFuenteContacto("");
      setPreferenciasComunicacion([]);
      setError("");
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      setError("Ocurrió un error al agregar el cliente.");
    }
  };

  // Render del componente
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Clientes</h1>

      {/* Formulario de ingreso de cliente */}
      <h2>Datos del Cliente</h2>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={newClient}
        onChange={(e) => setNewClient(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email del cliente"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono del cliente"
        value={newPhone}
        onChange={(e) => setNewPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Empresa del cliente"
        value={newEmpresa}
        onChange={(e) => setNewEmpresa(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección del cliente"
        value={newDireccion}
        onChange={(e) => setNewDireccion(e.target.value)}
      />

      <h2>Datos de Facturación</h2>
      <input
        type="text"
        placeholder="Razón Social"
        value={newRazonSocial}
        onChange={(e) => setNewRazonSocial(e.target.value)}
      />
      <input
        type="text"
        placeholder="CUIT"
        value={newCuit}
        onChange={(e) => setNewCuit(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección Fiscal"
        value={newDireccionFiscal}
        onChange={(e) => setNewDireccionFiscal(e.target.value)}
      />
      <input
        type="text"
        placeholder="Condición IVA"
        value={newCondicionIva}
        onChange={(e) => setNewCondicionIva(e.target.value)}
      />

      <h2>Datos de Marketing</h2>
      <input
        type="text"
        placeholder="Instagram"
        value={newInstagram}
        onChange={(e) => setNewInstagram(e.target.value)}
      />
      <input
        type="text"
        placeholder="LinkedIn"
        value={newLinkedin}
        onChange={(e) => setNewLinkedin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Fuente de Contacto"
        value={newFuenteContacto}
        onChange={(e) => setNewFuenteContacto(e.target.value)}
      />

      <h2>Preferencias de Comunicación</h2>
      <label>
        <input
          type="checkbox"
          value="email"
          checked={preferenciasComunicacion.includes("email")}
          onChange={handleCheckboxChange}
        />
        Email
      </label>
      <label>
        <input
          type="checkbox"
          value="whatsapp"
          checked={preferenciasComunicacion.includes("whatsapp")}
          onChange={handleCheckboxChange}
        />
        WhatsApp
      </label>
      <label>
        <input
          type="checkbox"
          value="llamada"
          checked={preferenciasComunicacion.includes("llamada")}
          onChange={handleCheckboxChange}
        />
        Llamada Telefónica
      </label>

      <button onClick={handleAddClient}>Agregar Cliente</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista de clientes */}
      <h2>Lista de Clientes:</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <strong>{client.nombre}</strong> - {client.email} - {client.telefono} - {client.empresa}
          </li>
        ))}
      </ul>
    </div>
  );
}
